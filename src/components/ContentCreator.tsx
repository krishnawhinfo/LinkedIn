import React, { useState } from 'react';
import { PenTool, Link as LinkIcon, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { generatePost, analyzeUrlContent } from '../services/gemini';
import { Tone, LinkedInPost } from '../types';

interface ContentCreatorProps {
  onPostGenerated: (post: LinkedInPost) => void;
  onLoading: (loading: boolean) => void;
}

const TONES: Tone[] = ['Normal', 'Professional', 'Aggressive', 'Bold', 'Excited', 'Inspirational', 'Storytelling', 'Analytical', 'Contrarian', 'Educational'];

export default function ContentCreator({ onPostGenerated, onLoading }: ContentCreatorProps) {
  const [source, setSource] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!source.trim()) {
      setError(`Please provide ${inputType === 'url' ? 'a URL' : 'content'} first.`);
      return;
    }

    setError(null);
    onLoading(true);
    try {
      let result: LinkedInPost;
      if (inputType === 'url') {
        result = await analyzeUrlContent(source, tone);
      } else {
        result = await generatePost(source, tone, 'text');
      }
      onPostGenerated(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate post. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
          <PenTool size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Content Creator</h2>
          <p className="text-sm text-slate-500">Turn any source into a high-performing LinkedIn post.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setInputType('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              inputType === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={16} />
            Text/Transcript
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              inputType === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LinkIcon size={16} />
            URL/Link
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              {inputType === 'url' ? 'Enter URL' : 'Paste Content'}
            </label>
            <button 
              onClick={() => {
                if (inputType === 'url') {
                  setSource('https://www.linkedin.com/pulse/future-ai-marketing-2025-trends-watch-out-for/');
                } else {
                  setSource('Artificial Intelligence is transforming how we think about productivity. In 2025, the focus will shift from "AI as a tool" to "AI as a teammate". Companies that integrate AI into their core workflows will see a 30% increase in operational efficiency, while those that resist will struggle to keep up with the pace of innovation.');
                }
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Try Sample Data
            </button>
          </div>
          {inputType === 'url' ? (
            <input
              type="url"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://example.com/article-or-youtube-link"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          ) : (
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste article text, YouTube transcript, or notes here..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Select Tone</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                  tone === t 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
        >
          <Sparkles size={18} />
          Generate Post
        </button>
      </div>
    </div>
  );
}
