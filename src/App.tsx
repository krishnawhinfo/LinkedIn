import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCircle, 
  FileText, 
  TrendingUp, 
  LayoutDashboard, 
  PenTool, 
  Settings,
  ChevronRight,
  Sparkles,
  Download,
  Loader2,
  BrainCircuit,
  Users,
  Type as TypeIcon,
  Zap,
  Calendar as CalendarIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProfileOptimizer from './components/ProfileOptimizer';
import ContentCreator from './components/ContentCreator';
import SmartModules from './components/SmartModules';
import ResultsDisplay from './components/ResultsDisplay';
import { 
  AppTab, 
  ProfileAnalysis, 
  LinkedInPost, 
  ComparisonResult, 
  HeadlineSuggestion, 
  ViralAnalysis, 
  ContentCalendar 
} from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('profile');
  const [loading, setLoading] = useState(false);
  
  // Results states
  const [analysis, setAnalysis] = useState<ProfileAnalysis | undefined>();
  const [post, setPost] = useState<LinkedInPost | undefined>();
  const [comparison, setComparison] = useState<ComparisonResult | undefined>();
  const [headlines, setHeadlines] = useState<HeadlineSuggestion | undefined>();
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | undefined>();
  const [calendar, setCalendar] = useState<ContentCalendar | undefined>();

  const resetResults = () => {
    setAnalysis(undefined);
    setPost(undefined);
    setComparison(undefined);
    setHeadlines(undefined);
    setViralAnalysis(undefined);
    setCalendar(undefined);
  };

  const handleAnalysisComplete = (data: ProfileAnalysis) => {
    resetResults();
    setAnalysis(data);
  };

  const handlePostGenerated = (data: LinkedInPost) => {
    resetResults();
    setPost(data);
  };

  const handleComparisonComplete = (data: ComparisonResult) => {
    resetResults();
    setComparison(data);
  };

  const handleHeadlinesComplete = (data: HeadlineSuggestion) => {
    resetResults();
    setHeadlines(data);
  };

  const handleViralComplete = (data: ViralAnalysis) => {
    resetResults();
    setViralAnalysis(data);
  };

  const handleCalendarComplete = (data: ContentCalendar) => {
    resetResults();
    setCalendar(data);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserCircle size={18} /> },
    { id: 'content', label: 'Content', icon: <PenTool size={18} /> },
    { id: 'compare', label: 'Compare', icon: <Users size={18} /> },
    { id: 'headlines', label: 'Headlines', icon: <TypeIcon size={18} /> },
    { id: 'viral', label: 'Viral', icon: <Zap size={18} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={18} /> },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center text-white">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LinkGrow AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Strategy & Branding</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <TabButton 
                key={tab.id}
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id as AppTab)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
              <img src="https://picsum.photos/seed/user/32/32" alt="User" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Mobile Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <TabButton 
                  key={tab.id}
                  active={activeTab === tab.id} 
                  onClick={() => setActiveTab(tab.id as AppTab)}
                  icon={tab.icon}
                  label={tab.label}
                />
              ))}
            </div>
          </div>

          {/* Left Column - Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && (
                  <ProfileOptimizer 
                    onAnalysisComplete={handleAnalysisComplete} 
                    onLoading={setLoading} 
                  />
                )}
                {activeTab === 'content' && (
                  <ContentCreator 
                    onPostGenerated={handlePostGenerated} 
                    onLoading={setLoading} 
                  />
                )}
                {(['compare', 'headlines', 'viral', 'calendar'] as const).includes(activeTab as any) && (
                  <SmartModules
                    activeTab={activeTab}
                    onComparisonComplete={handleComparisonComplete}
                    onHeadlinesComplete={handleHeadlinesComplete}
                    onViralComplete={handleViralComplete}
                    onCalendarComplete={handleCalendarComplete}
                    onLoading={setLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-blue-400" />
                Growth Tip
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {activeTab === 'profile' && "LinkedIn profiles with professional headshots get 21x more views."}
                {activeTab === 'content' && "The first 3 lines of your post are the most critical."}
                {activeTab === 'compare' && "Benchmarking against competitors helps identify content gaps."}
                {activeTab === 'headlines' && "Your headline is your first sales pitch. Make it count."}
                {activeTab === 'viral' && "Viral posts often use 'curiosity gaps' to keep readers engaged."}
                {activeTab === 'calendar' && "Consistency is the #1 factor in LinkedIn algorithm success."}
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-7">
             <ResultsDisplay 
               analysis={analysis} 
               post={post} 
               comparison={comparison}
               headlines={headlines}
               viralAnalysis={viralAnalysis}
               calendar={calendar}
               loading={loading} 
             />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 LinkGrow AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-[var(--color-brand-primary)]">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-[var(--color-brand-primary)]">Terms of Service</a>
            <a href="#" className="text-sm text-slate-500 hover:text-[var(--color-brand-primary)]">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
        active 
          ? "bg-white text-[var(--color-brand-primary)] shadow-sm" 
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

