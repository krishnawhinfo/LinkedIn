import React, { useState } from 'react';
import { 
  Users, 
  Type as TypeIcon, 
  Zap, 
  Calendar as CalendarIcon,
  Search,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  compareProfiles, 
  generateHeadlines, 
  analyzeViralPost, 
  generateCalendar 
} from '../services/gemini';
import { 
  ComparisonResult, 
  HeadlineSuggestion, 
  ViralAnalysis, 
  ContentCalendar,
  AppTab
} from '../types';

interface SmartModulesProps {
  activeTab: AppTab;
  onComparisonComplete: (data: ComparisonResult) => void;
  onHeadlinesComplete: (data: HeadlineSuggestion) => void;
  onViralComplete: (data: ViralAnalysis) => void;
  onCalendarComplete: (data: ContentCalendar) => void;
  onLoading: (loading: boolean) => void;
}

const SmartModules: React.FC<SmartModulesProps> = ({ 
  activeTab, 
  onComparisonComplete, 
  onHeadlinesComplete, 
  onViralComplete, 
  onCalendarComplete,
  onLoading
}) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [viralPost, setViralPost] = useState('');
  const [niche, setNiche] = useState('');
  const [calendarGoal, setCalendarGoal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!p1 || !p2) return;
    setError(null);
    onLoading(true);
    try {
      const result = await compareProfiles(p1, p2);
      onComparisonComplete(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to compare profiles.');
    } finally {
      onLoading(false);
    }
  };

  const handleHeadlines = async () => {
    if (!industry || !goal) return;
    setError(null);
    onLoading(true);
    try {
      const result = await generateHeadlines(industry, goal);
      onHeadlinesComplete(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate headlines.');
    } finally {
      onLoading(false);
    }
  };

  const handleViral = async () => {
    if (!viralPost) return;
    setError(null);
    onLoading(true);
    try {
      const result = await analyzeViralPost(viralPost);
      onViralComplete(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze viral post.');
    } finally {
      onLoading(false);
    }
  };

  const handleCalendar = async () => {
    if (!niche || !calendarGoal) return;
    setError(null);
    onLoading(true);
    try {
      const result = await generateCalendar(niche, calendarGoal);
      onCalendarComplete(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate calendar.');
    } finally {
      onLoading(false);
    }
  };

  const ErrorDisplay = () => error ? (
    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4">
      <AlertCircle size={16} />
      <span>{error}</span>
    </div>
  ) : null;

  if (activeTab === 'compare') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Competitor Comparison</h3>
            <p className="text-sm text-slate-500">Compare two profiles to find growth gaps.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">Profile 1 (Your Profile)</label>
              <button 
                onClick={() => {
                  setP1("Sarah Jenkins\nSenior UX Designer at CreativeHub\n\nExperience:\n- Led redesign of mobile app increasing retention by 25%.\n- Mentored 5 junior designers.\n- Expert in Figma, React, and User Research.");
                  setP2("Mark Thompson\nLead Product Designer at DesignPro\n\nExperience:\n- 12 years in UI/UX.\n- Speaker at UX Conf 2024.\n- Focused on B2B enterprise solutions and design systems.");
                }}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Try Sample
              </button>
            </div>
            <textarea
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="Paste profile content here..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Profile 2 (Competitor)</label>
            <textarea
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              placeholder="Paste competitor profile content here..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
            />
          </div>
          <ErrorDisplay />
          <button
            onClick={handleCompare}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200"
          >
            Compare Profiles
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'headlines') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
            <TypeIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">AI Headline Generator</h3>
            <p className="text-sm text-slate-500">Craft high-impact headlines for your niche.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">Industry</label>
              <button 
                onClick={() => {
                  setIndustry("Cybersecurity");
                  setGoal("Establish authority as a CISO");
                }}
                className="text-xs text-purple-600 hover:underline font-medium"
              >
                Try Sample
              </button>
            </div>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. SaaS, Digital Marketing, FinTech"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Thought leadership, Lead generation"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <ErrorDisplay />
          <button
            onClick={handleHeadlines}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200"
          >
            Generate Headlines
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'viral') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Viral Post Analyzer</h3>
            <p className="text-sm text-slate-500">Deconstruct viral posts to learn their secrets.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">Viral Post Content</label>
              <button 
                onClick={() => setViralPost("I just quit my 6-figure job with no backup plan.\n\nEveryone told me I was crazy.\n\nBut here's the thing: I wasn't happy.\n\nI spent 10 years climbing a ladder that was leaning against the wrong wall.\n\nToday, I'm starting my own agency.\n\nIt's scary. It's uncertain. But for the first time in a decade, I'm excited to wake up.\n\nDon't wait for the 'perfect' time. It doesn't exist.\n\n#entrepreneurship #career #growth")}
                className="text-xs text-amber-600 hover:underline font-medium"
              >
                Try Sample
              </button>
            </div>
            <textarea
              value={viralPost}
              onChange={(e) => setViralPost(e.target.value)}
              placeholder="Paste a viral LinkedIn post here..."
              className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-sm"
            />
          </div>
          <ErrorDisplay />
          <button
            onClick={handleViral}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-200"
          >
            Analyze Post
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'calendar') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Content Calendar Generator</h3>
            <p className="text-sm text-slate-500">Get a 30-day plan tailored to your niche.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">Your Niche</label>
              <button 
                onClick={() => {
                  setNiche("Remote Work Productivity");
                  setCalendarGoal("Build a community of remote managers");
                }}
                className="text-xs text-emerald-600 hover:underline font-medium"
              >
                Try Sample
              </button>
            </div>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. AI for Business, Personal Finance"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Main Goal</label>
            <input
              type="text"
              value={calendarGoal}
              onChange={(e) => setCalendarGoal(e.target.value)}
              placeholder="e.g. Grow following, Promote newsletter"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <ErrorDisplay />
          <button
            onClick={handleCalendar}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
          >
            Generate 30-Day Plan
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SmartModules;
