import { useState, useRef, useEffect, type DragEvent } from 'react';
import { useApp } from '@/context/AppContext';

interface FeedbackEntry {
  id: string;
  text: string;
  type: 'video' | 'audio' | 'text';
  timestamp: string;
}

export default function FeedbackPage() {
  const { t } = useApp();
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [textFeedback, setTextFeedback] = useState('');

  // Audio recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Video drag state
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRecordingAudio) {
      audioTimerRef.current = setInterval(() => {
        setAudioTime((prev) => prev + 1);
      }, 1000);
    } else if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
    }
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [isRecordingAudio]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleAudioRecording = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
      setHasAudio(true);
    } else {
      setAudioTime(0);
      setHasAudio(false);
      setIsRecordingAudio(true);
    }
  };

  const handleVideoDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files[0];
    if (file) setVideoFile(file.name);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file.name);
  };

  const addTextFeedback = () => {
    if (!textFeedback.trim()) return;
    addFeedbackEntry(textFeedback.trim(), 'text');
    setTextFeedback('');
  };

  const addFeedbackEntry = (text: string, type: FeedbackEntry['type']) => {
    const entry: FeedbackEntry = {
      id: `fb${Date.now()}`,
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setFeedbackList((prev) => [entry, ...prev]);
  };

  const removeFeedback = (id: string) => {
    setFeedbackList((prev) => prev.filter((f) => f.id !== id));
  };

  const submitAudio = () => {
    if (hasAudio) {
      addFeedbackEntry(`Audio feedback — ${formatTime(audioTime)}`, 'audio');
      setHasAudio(false);
      setAudioTime(0);
    }
  };

  const submitVideo = () => {
    if (videoFile) {
      addFeedbackEntry(`Video feedback — ${videoFile}`, 'video');
      setVideoFile(null);
    }
  };

  const feedbackEmoji = { video: '🎥', audio: '🎙️', text: '📝' };

  return (
    <div className="space-y-6">
      {/* Three feedback zones */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Video Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-500/10 dark:to-violet-500/20 text-2xl">
              🎥
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('videoFeedback')}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('videoFeedbackDesc')}</p>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => videoInputRef.current?.click()}
            onDragOver={handleVideoDragOver}
            onDragLeave={handleVideoDragLeave}
            onDrop={handleVideoDrop}
            className={`
              flex-1 min-h-[160px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all
              ${isDraggingVideo
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500/50'
              }
            `}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/mov,video/webm"
              className="hidden"
              onChange={handleVideoSelect}
            />
            {videoFile ? (
              <>
                <span className="text-4xl mb-2">🎬</span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center truncate max-w-full">{videoFile}</p>
                <p className="text-[10px] text-success-600 dark:text-success-400 mt-1">✅ {t('uploadComplete')}</p>
              </>
            ) : (
              <>
                <span className="text-4xl opacity-30 mb-2">🎥</span>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">{t('dropVideoHere')}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{t('supportedVideoFormats')}</p>
              </>
            )}
          </div>

          {videoFile && (
            <button
              onClick={submitVideo}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-md shadow-violet-500/20 transition-all"
            >
              ✅ {t('addFeedback')}
            </button>
          )}
        </div>

        {/* Audio Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-500/10 dark:to-accent-500/20 text-2xl">
              🎙️
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('audioFeedback')}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('audioFeedbackDesc')}</p>
            </div>
          </div>

          {/* Recording area */}
          <div className="flex-1 min-h-[160px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4">
            {isRecordingAudio ? (
              <>
                <div className="relative mb-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error-500/10 animate-pulse-glow">
                    <span className="text-3xl">🎙️</span>
                  </div>
                  <span className="absolute -top-1 -right-1 flex w-3.5 h-3.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-error-500" />
                  </span>
                </div>
                <p className="text-xs font-medium text-error-600 dark:text-error-400">{t('recordingAudio')}</p>
                <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white mt-1">{formatTime(audioTime)}</p>
              </>
            ) : hasAudio ? (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success-500/10 mb-3">
                  <span className="text-3xl">▶️</span>
                </div>
                <p className="text-xs font-medium text-success-600 dark:text-success-400">{t('audioRecorded')}</p>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mt-1">{formatTime(audioTime)}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                  <span className="text-3xl opacity-40">🎙️</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">{t('audioFeedbackDesc')}</p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={toggleAudioRecording}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${isRecordingAudio
                  ? 'bg-error-500 text-white hover:bg-error-600 shadow-md shadow-error-500/20'
                  : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-md shadow-accent-500/20'
                }
              `}
            >
              {isRecordingAudio ? '⏹️' : '🎙️'}
              {isRecordingAudio ? t('stopAudio') : t('recordAudio')}
            </button>
            {hasAudio && !isRecordingAudio && (
              <button
                onClick={submitAudio}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-success-500 text-white hover:bg-success-600 shadow-md shadow-success-500/20 transition-all"
              >
                ✅ {t('addFeedback')}
              </button>
            )}
          </div>
        </div>

        {/* Text Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-500/10 dark:to-brand-500/20 text-2xl">
              📝
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('textFeedback')}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('textFeedbackDesc')}</p>
            </div>
          </div>

          <textarea
            value={textFeedback}
            onChange={(e) => setTextFeedback(e.target.value)}
            placeholder={t('feedbackPlaceholder')}
            className="flex-1 min-h-[160px] resize-none w-full px-3 py-3 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all leading-relaxed"
          />

          <button
            onClick={addTextFeedback}
            disabled={!textFeedback.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all"
          >
            ➕ {t('addFeedback')}
          </button>
        </div>
      </div>

      {/* Feedback Log */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <span className="text-lg">📋</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('feedbackLog')}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{feedbackList.length} entries</p>
          </div>
        </div>

        <div className="px-4 pb-4 max-h-80 overflow-y-auto">
          {feedbackList.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl opacity-30 block mb-2">💬</span>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('noFeedback')}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {feedbackList.map((f) => (
                <li
                  key={f.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 animate-slide-in-right group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-base shrink-0 border border-slate-200 dark:border-slate-700">
                    {feedbackEmoji[f.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 break-words">{f.text}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{f.timestamp}</p>
                  </div>
                  <button
                    onClick={() => removeFeedback(f.id)}
                    className="p-1 rounded text-slate-300 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 text-sm"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
