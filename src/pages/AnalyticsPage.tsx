import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function AnalyticsPage() {
  const { t } = useApp();
  const [score, setScore] = useState(0);
  const targetScore = 78;
  const [agent2Active, setAgent2Active] = useState(true);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = targetScore / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  const checks = [
    {
      id: 'hallucination',
      emoji: '🛡️',
      titleKey: 'hallucinationCheck' as const,
      descKey: 'hallucinationCheckDesc' as const,
      status: 'passed' as const,
      statusText: t('passed'),
      accent: 'success',
    },
    {
      id: 'composition',
      emoji: '🏗️',
      titleKey: 'compositionStrength' as const,
      descKey: 'compositionStrengthDesc' as const,
      status: 'passed' as const,
      statusText: t('passed'),
      accent: 'brand',
    },
    {
      id: 'competitor',
      emoji: '⚔️',
      titleKey: 'competitorComparison' as const,
      descKey: 'competitorComparisonDesc' as const,
      status: 'warning' as const,
      statusText: t('failed'),
      accent: 'amber',
    },
  ];

  const accentClasses: Record<string, { bg: string; text: string; badge: string }> = {
    success: {
      bg: 'bg-success-50 dark:bg-success-500/10',
      text: 'text-success-600 dark:text-success-400',
      badge: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300',
    },
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-500/10',
      text: 'text-brand-600 dark:text-brand-400',
      badge: 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    },
  };

  return (
    <div className="space-y-6">
      {/* Optimization Score - Gauge */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col lg:flex-row items-center gap-8">
        {/* Gauge */}
        <div className="relative w-56 h-56 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth="14"
              className="stroke-slate-100 dark:stroke-slate-800"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth="14"
              stroke={scoreColor}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums text-slate-900 dark:text-white">{score}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('outOf100')}</span>
          </div>
        </div>

        {/* Score info */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('optimizationScore')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('analyticsDesc')}</p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-50 dark:bg-success-500/10">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-xs font-medium text-success-700 dark:text-success-400">Good (75+)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Fair (50-74)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-50 dark:bg-error-500/10">
              <div className="w-2 h-2 rounded-full bg-error-500" />
              <span className="text-xs font-medium text-error-700 dark:text-error-400">Poor (&lt;50)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Check boxes */}
      <div className="grid md:grid-cols-3 gap-4">
        {checks.map((check) => {
          const a = accentClasses[check.accent];
          return (
            <div
              key={check.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${a.bg} text-xl`}>
                  {check.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t(check.titleKey)}</h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{t(check.descKey)}</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${a.badge}`}>
                {check.status === 'passed' ? '✅' : '⚠️'}
                {check.statusText}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI Agents */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Agent 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-xl">
              🤖
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('aiAgent1')}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success-600 dark:text-success-400">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                {t('agentActive')}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('aiAgent1Desc')}</p>
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-success-50 dark:bg-success-500/10">
            <span className="text-sm shrink-0 mt-0.5">✅</span>
            <p className="text-xs font-medium text-success-700 dark:text-success-400">{t('aiAgent1Status')}</p>
          </div>
        </div>

        {/* Agent 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-xl">
              🕷️
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('aiAgent2')}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent-600 dark:text-accent-400">
                <div className="w-3 h-3 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                {t('agentActive')}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('aiAgent2Desc')}</p>
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-accent-50 dark:bg-accent-500/10">
            <div className="w-4 h-4 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-accent-700 dark:text-accent-400">{t('aiAgent2Status')}</p>
          </div>
          <button
            onClick={() => setAgent2Active(!agent2Active)}
            className="mt-3 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {agent2Active ? '⏸ Pause agent' : '▶ Resume agent'}
          </button>
        </div>
      </div>
    </div>
  );
}
