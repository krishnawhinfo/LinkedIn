import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UserCircle, Upload, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeProfile } from '../services/gemini';
import { ProfileAnalysis } from '../types';

interface ProfileOptimizerProps {
  onAnalysisComplete: (analysis: ProfileAnalysis) => void;
  onLoading: (loading: boolean) => void;
}

export default function ProfileOptimizer({ onAnalysisComplete, onLoading }: ProfileOptimizerProps) {
  const [profileText, setProfileText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const text = await file.text();
      setProfileText(text);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!profileText.trim()) {
      setError('Please provide profile data first.');
      return;
    }

    setError(null);
    onLoading(true);
    try {
      const result = await analyzeProfile(profileText);
      onAnalysisComplete(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze profile. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <UserCircle size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Profile Optimizer</h2>
          <p className="text-sm text-slate-500">Audit your LinkedIn profile for maximum visibility.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Paste LinkedIn Profile URL or Upload PDF/TXT</label>
            <button 
              onClick={() => setProfileText("Alex Rivera\nProduct Marketing Manager at SaaSFlow\n\nExperience:\n- Scaled user acquisition by 200% in 12 months.\n- Managed a $500k monthly ad budget across LinkedIn and Google.\n- Launched 3 major product features with cross-functional teams.\n\nAbout:\nI'm a marketing leader obsessed with growth and customer psychology. I've spent 8 years helping SaaS companies find their voice and their audience.")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Try Sample Data
            </button>
          </div>
          <textarea
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            placeholder="Paste your 'About' section, experience, or full profile text here..."
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
          />
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto text-slate-400 mb-2" size={24} />
          <p className="text-sm text-slate-500">
            {isDragActive ? 'Drop the file here' : 'Drag & drop profile PDF/TXT or click to upload'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200"
        >
          <Sparkles size={18} />
          Analyze Profile
        </button>
      </div>
    </div>
  );
}
