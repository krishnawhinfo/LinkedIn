import React from 'react';
import Markdown from 'react-markdown';
import { 
  Download, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  Search, 
  PenTool, 
  Sparkles, 
  LayoutDashboard,
  Users,
  Zap,
  Calendar as CalendarIcon,
  Award,
  BarChart3,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { 
  ProfileAnalysis, 
  LinkedInPost, 
  ComparisonResult, 
  HeadlineSuggestion, 
  ViralAnalysis, 
  ContentCalendar 
} from '../types';
import { jsPDF } from 'jspdf';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultsDisplayProps {
  analysis?: ProfileAnalysis;
  post?: LinkedInPost;
  comparison?: ComparisonResult;
  headlines?: HeadlineSuggestion;
  viralAnalysis?: ViralAnalysis;
  calendar?: ContentCalendar;
  loading: boolean;
}

export default function ResultsDisplay({ 
  analysis, 
  post, 
  comparison,
  headlines,
  viralAnalysis,
  calendar,
  loading 
}: ResultsDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    let text = '';
    if (analysis) text = analysis.fullReport;
    else if (post) text = post.content;
    else if (comparison) text = comparison.gapAnalysis;
    else if (headlines) text = headlines.headlines.map(h => h.text).join('\n');
    else if (viralAnalysis) text = viralAnalysis.whyItWorked;
    else if (calendar) text = JSON.stringify(calendar, null, 2);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(10, 102, 194); // LinkedIn Blue
    doc.text("LinkedIn Profile Strategic Audit", 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Overall Profile Score: ${analysis.score}/100`, 20, 35);
    
    let y = 50;
    const checkPage = (height: number) => {
      if (y + height > 280) {
        doc.addPage();
        y = 20;
      }
    };

    const addSection = (title: string, content: string | string[]) => {
      checkPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 20, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      if (Array.isArray(content)) {
        content.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, 170);
          checkPage(lines.length * 6);
          doc.text(lines, 25, y);
          y += (lines.length * 6);
        });
      } else {
        const lines = doc.splitTextToSize(content, 170);
        checkPage(lines.length * 6);
        doc.text(lines, 20, y);
        y += (lines.length * 6);
      }
      y += 10;
    };

    addSection("First Impression", analysis.firstImpression);
    addSection("Headline Suggestions", analysis.headlineReview.suggestions);
    addSection("About Section Clarity", analysis.aboutReview.clarity);
    addSection("Optimized About Section", analysis.aboutReview.optimizedVersion);
    addSection("Experience Suggestions", analysis.experienceAnalysis.suggestions);
    addSection("SEO Keywords", analysis.seoOptimization.industrySuggestions);
    addSection("Visibility Blockers", analysis.visibilityGaps.blockers);
    addSection("30-Day Action Plan", analysis.actionPlan);
    
    doc.save("LinkedIn_Strategic_Audit.pdf");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[600px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="text-[var(--color-brand-primary)]" size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Analyzing & Strategizing...</h3>
          <p className="text-slate-500 mt-2">Our AI is crunching the data to build your growth plan.</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (!analysis && !post && !comparison && !headlines && !viralAnalysis && !calendar) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[600px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ready for Analysis</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Your results will appear here once you submit your profile or content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900">
            {analysis && 'Strategic Audit Report'}
            {post && 'Generated LinkedIn Post'}
            {comparison && 'Competitor Comparison'}
            {headlines && 'AI Headlines'}
            {viralAnalysis && 'Viral Analysis'}
            {calendar && '30-Day Content Calendar'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {analysis && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            >
              <Download size={16} />
              PDF Report
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * analysis.score) / 100} className="text-blue-600 transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-900">{analysis.score}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Profile Score</h2>
                  <p className="text-slate-500">Overall optimization rating</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <ScoreStat label="SEO" value={analysis.breakdown.seo} />
                <ScoreStat label="Authority" value={analysis.breakdown.authority} />
                <ScoreStat label="Clarity" value={analysis.breakdown.clarity} />
                <ScoreStat label="Engagement" value={analysis.breakdown.engagement} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard icon={<TrendingUp className="text-green-600" />} title="Headline: What Works" items={analysis.headlineReview.works} color="green" />
            <ResultCard icon={<AlertTriangle className="text-amber-600" />} title="Headline: Gaps" items={analysis.headlineReview.doesntWork} color="amber" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-blue-600" />
              Headline Suggestions
            </h4>
            <div className="space-y-3">
              {analysis.headlineReview.suggestions.map((h, i) => (
                <div key={i} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 italic">"{h}"</div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <PenTool size={18} className="text-blue-400" />
              Optimized About Section
            </h4>
            <div className="bg-white/10 rounded-xl p-4 text-sm font-mono leading-relaxed text-slate-200 whitespace-pre-wrap">
              {analysis.aboutReview.optimizedVersion}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">30-Day Action Plan</h4>
            <div className="space-y-3">
              {analysis.actionPlan.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComparisonCard data={comparison.profile1} isWinner={comparison.winner === comparison.profile1.name} />
            <ComparisonCard data={comparison.profile2} isWinner={comparison.winner === comparison.profile2.name} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Gap Analysis</h4>
            <div className="markdown-body text-sm text-slate-600 leading-relaxed">
              <Markdown>{comparison.gapAnalysis}</Markdown>
            </div>
          </div>
          <ResultCard icon={<Lightbulb className="text-amber-500" />} title="Recommendations" items={comparison.recommendations} color="amber" />
        </div>
      )}

      {/* Headlines Results */}
      {headlines && (
        <div className="space-y-4">
          {headlines.headlines.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-lg font-bold text-slate-900 mb-2">{h.text}</p>
              <p className="text-sm text-slate-500 italic">Strategy: {h.strategy}</p>
            </div>
          ))}
        </div>
      )}

      {/* Viral Analysis Results */}
      {viralAnalysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Hook Analysis</h4>
            <div className="markdown-body text-sm text-slate-600 leading-relaxed">
              <Markdown>{viralAnalysis.hookAnalysis}</Markdown>
            </div>
          </div>
          <ResultCard icon={<Zap className="text-amber-500" />} title="Psychological Triggers" items={viralAnalysis.psychologicalTriggers} color="amber" />
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Structural Breakdown</h4>
            <div className="markdown-body text-sm text-slate-600 leading-relaxed">
              <Markdown>{viralAnalysis.structuralBreakdown}</Markdown>
            </div>
          </div>
          <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold mb-2">Why It Worked</h4>
            <div className="markdown-body text-blue-100 text-sm leading-relaxed">
              <Markdown>{viralAnalysis.whyItWorked}</Markdown>
            </div>
          </div>
          <ResultCard icon={<CheckCircle2 className="text-emerald-500" />} title="Recreation Tips" items={viralAnalysis.recreationTips} color="emerald" />
        </div>
      )}

      {/* Calendar Results */}
      {calendar && (
        <div className="space-y-8">
          {calendar.weeks.map((week) => (
            <div key={week.week} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Week {week.week}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {week.days.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400">Day {day.day}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600 font-medium">{day.postType}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">{day.topic}</p>
                    <p className="text-xs text-slate-500 italic">Hook: {day.hookIdea}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Results */}
      {post && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">Content Summary</h4>
            <div className="markdown-body text-sm text-slate-600 leading-relaxed">
              <Markdown>{post.summary}</Markdown>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-3">Key Insights</h4>
            <ul className="space-y-2">
              {post.insights.map((insight, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative">
            <div className="absolute top-4 right-4 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded">
              Final Post
            </div>
            <div className="markdown-body font-sans text-lg text-slate-800">
              <Markdown>{post.content}</Markdown>
            </div>
            {post.imageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <img 
                  src={post.imageUrl} 
                  alt="Generated LinkedIn Post Visual" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="text-blue-600 font-semibold hover:underline cursor-pointer">
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" />
                Strategy Insight
              </h4>
              <p className="text-emerald-800 text-sm leading-relaxed">
                {post.strategy}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Target size={18} className="text-blue-600" />
                Alternate Hooks
              </h4>
              <ul className="space-y-2">
                {post.alternateHooks.map((hook, i) => (
                  <li key={i} className="text-blue-800 text-xs italic">"{hook}"</li>
                ))}
              </ul>
            </div>
          </div>

          {post.carouselOutline && (
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <LayoutDashboard className="text-blue-400" />
                Carousel Outline
              </h3>
              <div className="space-y-6">
                {post.carouselOutline.slides.map((slide, i) => (
                  <div key={i} className="border-l-2 border-blue-500/30 pl-6 py-2">
                    <h4 className="text-blue-400 font-bold text-sm mb-1">Slide {i + 1}: {slide.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{slide.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ScoreStat = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-lg font-black text-slate-900">{value}%</p>
  </div>
);

const ComparisonCard = ({ data, isWinner }: { data: { name: string, score: number, strengths: string[] }, isWinner: boolean }) => (
  <div className={cn(
    "p-6 rounded-2xl border transition-all",
    isWinner ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/10" : "bg-white border-slate-200"
  )}>
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-bold text-slate-900">{data.name}</h4>
      {isWinner && <Trophy className="text-amber-500" size={20} />}
    </div>
    <div className="text-3xl font-black text-blue-600 mb-4">{data.score}</div>
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strengths</p>
      {data.strengths.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
          <CheckCircle2 size={14} className="text-emerald-500" />
          {s}
        </div>
      ))}
    </div>
  </div>
);

const ResultCard = ({ icon, title, items, color }: { icon: React.ReactNode, title: string, items: string[], color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    emerald: 'text-emerald-500',
    purple: 'text-purple-500',
    slate: 'text-slate-500'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 flex gap-2">
            <span className={cn("font-bold", colorMap[color] || 'text-slate-500')}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
