import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface Campaign {
  id: string;
  title: string;
  date: string;
  type: 'voice' | 'text';
  status: 'draft' | 'published';
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', title: 'Diwali Mega Promo', date: 'Oct 8, 2026', type: 'text', status: 'published' },
  { id: 'c2', title: 'Monsoon Combo Offer', date: 'Sep 22, 2026', type: 'voice', status: 'published' },
  { id: 'c3', title: 'Weekend Flash Sale', date: 'Sep 15, 2026', type: 'voice', status: 'draft' },
  { id: 'c4', title: 'New Menu Launch', date: 'Sep 3, 2026', type: 'text', status: 'published' },
  { id: 'c5', title: 'Coffee Lovers Day', date: 'Aug 28, 2026', type: 'voice', status: 'draft' },
];

export default function InputStudio() {
  const { t } = useApp();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeCampaign, setActiveCampaign] = useState<string | null>(mockCampaigns[0]?.id ?? null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesTitle, setNotesTitle] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setRecordTime(0);
      setHasRecording(false);
      setIsRecording(true);
    }
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
      {/* Recent Campaigns log */}
      <div className="xl:w-72 shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              📋 {t('recentCampaigns')}
            </h3>
            <button className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors text-sm">
              ➕
            </button>
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {campaigns.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 px-3 py-4 text-center">{t('noCampaigns')}</p>
            ) : (
              <ul className="space-y-1">
                {campaigns.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveCampaign(c.id)}
                      className={`
                        w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all
                        ${activeCampaign === c.id
                          ? 'bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <span className="text-lg shrink-0 mt-0.5">
                        {c.type === 'voice' ? '🎙️' : '📝'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-medium truncate ${activeCampaign === c.id ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {c.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{c.date}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            c.status === 'published'
                              ? 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400'
                              : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                          }`}>
                            {c.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main area: two columns */}
      <div className="flex-1 grid md:grid-cols-2 gap-4 lg:gap-6">
        {/* Voice Upload card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-500/10 dark:to-accent-500/20 text-2xl">
              🎤
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('voiceUpload')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('voiceUploadDesc')}</p>
            </div>
          </div>

          {/* Recording area */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6">
            {isRecording ? (
              <>
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-error-500/10 animate-pulse-glow">
                    <span className="text-4xl">🎤</span>
                  </div>
                  <span className="absolute -top-1 -right-1 flex w-4 h-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-error-500" />
                  </span>
                </div>
                <p className="text-sm font-medium text-error-600 dark:text-error-400 mb-1">{t('recording')}</p>
                <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{formatTime(recordTime)}</p>
              </>
            ) : hasRecording ? (
              <>
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success-500/10 mb-4">
                  <span className="text-4xl">▶️</span>
                </div>
                <p className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">{t('voiceRecorded')}</p>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {t('voiceDuration')}: {formatTime(recordTime)}
                </p>
                <button
                  onClick={() => { setHasRecording(false); setRecordTime(0); }}
                  className="mt-3 text-xs text-slate-400 hover:text-error-500 transition-colors"
                >
                  {t('clearAll')}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <span className="text-4xl opacity-40">🎤</span>
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center">{t('voiceUploadDesc')}</p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={toggleRecording}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isRecording
                  ? 'bg-error-500 text-white hover:bg-error-600 shadow-md shadow-error-500/20'
                  : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-md shadow-accent-500/20'
                }
              `}
            >
              {isRecording ? '⏹️' : '🎤'}
              {isRecording ? t('stopRecording') : t('recordVoice')}
            </button>
            {hasRecording && !isRecording && (
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                💾 {t('save')}
              </button>
            )}
          </div>
        </div>

        {/* Messy text / notes input */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-500/20 text-2xl">
              ✏️
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('messyText')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('messyTextDesc')}</p>
            </div>
          </div>

          {/* Title input */}
          <input
            type="text"
            value={notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
            placeholder={t('title')}
            className="w-full px-3 py-2 mb-3 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
          />

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('typeNotes')}
            className="flex-1 min-h-[200px] resize-none w-full px-3 py-3 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all leading-relaxed"
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">⏱️ {wordCount} {t('words')}</span>
              <span>{notes.length} {t('chars')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setNotes(''); setNotesTitle(''); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                🗑️ {t('clearAll')}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-sm shadow-brand-500/20 transition-all">
                💾 {t('saveDraft')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
