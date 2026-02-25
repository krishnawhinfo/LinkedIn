import { GoogleGenAI, Type } from "@google/genai";
import { Tone, ProfileAnalysis, LinkedInPost, ComparisonResult, HeadlineSuggestion, ViralAnalysis, ContentCalendar } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callGemini = async (params: any, retries = 5, delay = 2000): Promise<any> => {
  try {
    return await ai.models.generateContent(params);
  } catch (error: any) {
    const isQuotaError = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
    if (isQuotaError && retries > 0) {
      const jitter = Math.random() * 1000;
      console.warn(`Gemini Quota exceeded. Retrying in ${delay + jitter}ms... (${retries} retries left)`);
      await sleep(delay + jitter);
      return callGemini(params, retries - 1, delay * 1.5);
    }
    
    if (isQuotaError) {
      throw new Error("Gemini API quota exceeded. Please try again in a few minutes or check your billing details.");
    }
    
    throw error;
  }
};

const cleanText = (text: string) => {
  // Remove zero-width spaces and other common "junk" characters that can cause rendering issues
  return text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
};

const parseAIResponse = (text: string) => {
  try {
    const cleaned = cleanText(text);
    const parsed = JSON.parse(cleaned);
    
    // Recursively handle literal \n strings in the parsed object
    const fixNewLines = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/\\n/g, '\n');
      }
      if (Array.isArray(obj)) {
        return obj.map(fixNewLines);
      }
      if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = fixNewLines(obj[key]);
        }
        return newObj;
      }
      return obj;
    };

    return fixNewLines(parsed);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {};
  }
};

export const analyzeProfile = async (profileData: string): Promise<ProfileAnalysis> => {
  const isUrl = profileData.trim().startsWith('http');
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: isUrl 
      ? `Analyze the LinkedIn profile at this URL: ${profileData.trim()}. Extract all relevant information (About, Experience, Headline, etc.) and provide a full report.`
      : `Analyze the following LinkedIn profile data and generate a detailed LinkedIn Profile Optimization Report.
    
    Profile Data:
    ${profileData}`,
    config: {
      tools: [{ urlContext: {} }],
      systemInstruction: `You are an expert LinkedIn growth strategist, personal branding consultant, and SEO analyst. 
      Provide a deep, data-driven audit. Be critical, professional, and highly actionable.
      
      The report must include:
      1. Overall Profile Score (Out of 100) and a breakdown (SEO, Authority, Clarity, Engagement readiness)
      2. First Impression Analysis
      3. Headline Review (What works, what doesn't, 5 improved suggestions)
      4. About Section Review (Clarity, Authority, Keywords missing, Emotional connection, Rewritten optimized version)
      5. Experience Section Analysis (Impact-driven?, Metrics used?, Rewriting suggestions)
      6. SEO & Keyword Optimization (Missing keywords, Industry-relevant keyword suggestions)
      7. Engagement & Visibility Gaps (Why profile may not be getting traffic, Algorithm improvement suggestions)
      8. Personal Branding Clarity (Positioning analysis, Niche clarity)
      9. Traffic Growth Strategy (Content suggestions, Posting frequency, Networking strategy, Engagement strategy)
      10. Action Plan (30-Day Optimization Plan)`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              seo: { type: Type.NUMBER },
              authority: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              engagement: { type: Type.NUMBER },
            },
            required: ["seo", "authority", "clarity", "engagement"]
          },
          firstImpression: { type: Type.STRING },
          headlineReview: {
            type: Type.OBJECT,
            properties: {
              works: { type: Type.ARRAY, items: { type: Type.STRING } },
              doesntWork: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["works", "doesntWork", "suggestions"]
          },
          aboutReview: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.STRING },
              authority: { type: Type.STRING },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              emotionalConnection: { type: Type.STRING },
              optimizedVersion: { type: Type.STRING },
            },
            required: ["clarity", "authority", "missingKeywords", "emotionalConnection", "optimizedVersion"]
          },
          experienceAnalysis: {
            type: Type.OBJECT,
            properties: {
              isImpactDriven: { type: Type.BOOLEAN },
              metricsUsed: { type: Type.BOOLEAN },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["isImpactDriven", "metricsUsed", "suggestions"]
          },
          seoOptimization: {
            type: Type.OBJECT,
            properties: {
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              industrySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["missingKeywords", "industrySuggestions"]
          },
          visibilityGaps: {
            type: Type.OBJECT,
            properties: {
              blockers: { type: Type.ARRAY, items: { type: Type.STRING } },
              algorithmSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["blockers", "algorithmSuggestions"]
          },
          brandingClarity: {
            type: Type.OBJECT,
            properties: {
              positioning: { type: Type.STRING },
              nicheClarity: { type: Type.STRING },
            },
            required: ["positioning", "nicheClarity"]
          },
          growthStrategy: {
            type: Type.OBJECT,
            properties: {
              contentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              postingFrequency: { type: Type.STRING },
              networkingStrategy: { type: Type.STRING },
              engagementStrategy: { type: Type.STRING },
            },
            required: ["contentSuggestions", "postingFrequency", "networkingStrategy", "engagementStrategy"]
          },
          actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          fullReport: { type: Type.STRING, description: "A comprehensive markdown summary of the entire audit." },
        },
        required: [
          "score", "breakdown", "firstImpression", "headlineReview", "aboutReview", 
          "experienceAnalysis", "seoOptimization", "visibilityGaps", 
          "brandingClarity", "growthStrategy", "actionPlan", "fullReport"
        ]
      }
    }
  });

  return parseAIResponse(response.text || "{}");
};

export const compareProfiles = async (p1: string, p2: string): Promise<ComparisonResult> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Compare these two LinkedIn profiles:
    Profile 1: ${p1}
    Profile 2: ${p2}`,
    config: {
      systemInstruction: "You are an expert LinkedIn strategist. Compare two profiles and provide a gap analysis, identifying a winner and recommendations.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profile1: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "score", "strengths"]
          },
          profile2: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "score", "strengths"]
          },
          gapAnalysis: { type: Type.STRING },
          winner: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["profile1", "profile2", "gapAnalysis", "winner", "recommendations"]
      }
    }
  });
  return parseAIResponse(response.text || "{}");
};

export const generateHeadlines = async (industry: string, goal: string): Promise<HeadlineSuggestion> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 LinkedIn headlines for someone in the ${industry} industry with the goal of ${goal}.`,
    config: {
      systemInstruction: "You are a professional LinkedIn copywriter. Generate high-impact headlines.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headlines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                strategy: { type: Type.STRING }
              },
              required: ["text", "strategy"]
            }
          }
        },
        required: ["headlines"]
      }
    }
  });
  return parseAIResponse(response.text || "{}");
};

export const analyzeViralPost = async (post: string): Promise<ViralAnalysis> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Analyze this viral LinkedIn post and explain why it worked: ${post}`,
    config: {
      systemInstruction: "You are a viral content specialist. Analyze the post's structure, psychological triggers, and hooks.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hookAnalysis: { type: Type.STRING },
          psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          structuralBreakdown: { type: Type.STRING },
          whyItWorked: { type: Type.STRING },
          recreationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["hookAnalysis", "psychologicalTriggers", "structuralBreakdown", "whyItWorked", "recreationTips"]
      }
    }
  });
  return parseAIResponse(response.text || "{}");
};

export const generateCalendar = async (niche: string, goal: string): Promise<ContentCalendar> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Generate a 30-day LinkedIn content calendar for the niche: ${niche} with the goal: ${goal}.`,
    config: {
      systemInstruction: "You are a content strategist. Generate a structured 30-day plan.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING },
          goal: { type: Type.STRING },
          weeks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.NUMBER },
                days: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.NUMBER },
                      topic: { type: Type.STRING },
                      postType: { type: Type.STRING },
                      hookIdea: { type: Type.STRING }
                    },
                    required: ["day", "topic", "postType", "hookIdea"]
                  }
                }
              },
              required: ["week", "days"]
            }
          }
        },
        required: ["niche", "goal", "weeks"]
      }
    }
  });
  return parseAIResponse(response.text || "{}");
};


export const generateImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const response = await callGemini({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: `Professional LinkedIn style image: ${prompt}. High quality, clean, corporate but creative. DO NOT include any text, watermarks, logos, or overlays on the image.` }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
};

export const generatePost = async (sourceContent: string, tone: Tone, inputType: string): Promise<LinkedInPost> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following content and generate a high-performing LinkedIn post.
    
    Source Content (${inputType}):
    ${sourceContent}
    
    Tone selected: ${tone}
    
    Follow these steps:
    Step 1: Provide a short summary of the content.
    Step 2: Extract 3–5 key insights.
    Step 3: Generate a high-performing LinkedIn post (Strong hook, clear formatting, insightful commentary, CTA, 5 hashtags).
    Step 4: Provide 2 alternate hooks.
    Step 5: Suggest a carousel version outline (5-7 slides).
    Step 6: Provide a detailed prompt for an AI image generator that would complement this post.`,
    config: {
      systemInstruction: `You are a professional LinkedIn copywriter and content marketer. Optimize for the LinkedIn algorithm. 
      
      CRITICAL: The generated post content MUST be highly structured and point-by-point. Use bullet points, numbered lists, and clear section breaks. 
      IMPORTANT: Every bullet point MUST start on a new line. Avoid long paragraphs.
      
      Tone Guidelines:
      - Aggressive: Use strong language, challenge reader assumptions, use pattern interrupts, make bold claims (but factual).
      - Excited: High energy, limited exclamation emphasis, optimistic framing.
      - Professional: Data-driven, structured, clean.
      - Storytelling: Narrative opening, personal reflection tone, lesson at the end.
      - Analytical: Logical breakdown, bullet insights, industry framing.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          strategy: { type: Type.STRING },
          alternateHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING, description: "Detailed prompt for generating a LinkedIn-appropriate image. Explicitly state to NOT include text or watermarks." },
          carouselOutline: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                  required: ["title", "content"]
                }
              }
            },
            required: ["slides"]
          }
        },
        required: ["summary", "insights", "content", "hashtags", "strategy", "alternateHooks", "imagePrompt", "carouselOutline"]
      }
    }
  });

  const postData = parseAIResponse(response.text || "{}");
  if (postData.imagePrompt) {
    postData.imageUrl = await generateImage(postData.imagePrompt);
  }
  return postData;
};

export const analyzeUrlContent = async (url: string, tone: Tone): Promise<LinkedInPost> => {
  const response = await callGemini({
    model: "gemini-3-flash-preview",
    contents: `Analyze the content from this URL: ${url} and create a LinkedIn post with ${tone} tone.
    
    Follow these steps:
    Step 1: Provide a short summary of the content.
    Step 2: Extract 3–5 key insights.
    Step 3: Generate a high-performing LinkedIn post (Strong hook, clear formatting, insightful commentary, CTA, 5 hashtags).
    Step 4: Provide 2 alternate hooks.
    Step 5: Suggest a carousel version outline (5-7 slides).
    Step 6: Provide a detailed prompt for an AI image generator that would complement this post.`,
    config: {
      tools: [{ urlContext: {} }],
      systemInstruction: `You are a professional LinkedIn copywriter. Use the URL context to extract key insights and create a viral-style post.
      
      CRITICAL: The generated post content MUST be highly structured and point-by-point. Use bullet points, numbered lists, and clear section breaks. 
      IMPORTANT: Every bullet point MUST start on a new line. Avoid long paragraphs.
      
      Tone Guidelines:
      - Aggressive: Use strong language, challenge reader assumptions, use pattern interrupts, make bold claims (but factual).
      - Excited: High energy, limited exclamation emphasis, optimistic framing.
      - Professional: Data-driven, structured, clean.
      - Storytelling: Narrative opening, personal reflection tone, lesson at the end.
      - Analytical: Logical breakdown, bullet insights, industry framing.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          strategy: { type: Type.STRING },
          alternateHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING, description: "Detailed prompt for generating a LinkedIn-appropriate image. Explicitly state to NOT include text or watermarks." },
          carouselOutline: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                  required: ["title", "content"]
                }
              }
            },
            required: ["slides"]
          }
        },
        required: ["summary", "insights", "content", "hashtags", "strategy", "alternateHooks", "imagePrompt", "carouselOutline"]
      }
    }
  });

  const postData = parseAIResponse(response.text || "{}");
  if (postData.imagePrompt) {
    postData.imageUrl = await generateImage(postData.imagePrompt);
  }
  return postData;
};
