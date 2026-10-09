import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AlertsPage() {
  const { t } = useApp();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [broadcastState, setBroadcastState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleLaunch = () => {
    setBroadcastState('sending');
    setTimeout(() => setBroadcastState('sent'), 2000);
  };

  const todaySales = 8420;
  const weeklyAvg = 12380;
  const dropPercent = Math.round(((weeklyAvg - todaySales) / weeklyAvg) * 100);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Low Sales Alert */}
      {!alertDismissed ? (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/20 p-5 animate-slide-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />

          <div className="relative flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-2xl shrink-0">
              ⚠️
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-amber-900 dark:text-amber-300">{t('lowSalesAlert')}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {t('alertActive')}
                </span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200/70 mb-4">{t('lowSalesAlertDesc')}</p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/60 dark:bg-slate-900/40 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">{t('saleAmount')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">₹{todaySales.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-900/40 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">{t('weeklyAvg')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">₹{weeklyAvg.toLocaleString()}</p>
                </div>
                <div className="bg-error-500/10 rounded-lg p-3">
                  <p className="text-[10px] text-error-600 dark:text-error-400 mb-0.5">{t('drop')}</p>
                  <p className="text-lg font-bold text-error-600 dark:text-error-400 tabular-nums flex items-center gap-1">
                    📉 {dropPercent}%
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setAlertDismissed(true)}
              className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors shrink-0 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-3">
          <span className="text-lg">📉</span>
          <p className="text-sm text-slate-500 dark:text-slate-400">Alert dismissed.</p>
          <button
            onClick={() => setAlertDismissed(false)}
            className="ml-auto text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            Restore
          </button>
        </div>
      )}

      {/* Flash Sale Broadcast */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-md shadow-amber-500/20">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('flashSaleTitle')}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('flashSaleDesc')}</p>
          </div>
        </div>

        <div className="p-5">
          {/* Message preview */}
          <div className="mb-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">📡</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">WhatsApp Broadcast Preview</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              ⚡ FLASH SALE ALERT! 40% OFF on all items for the next 3 hours only! Visit us now — limited stock available. Show this message at checkout. 🛒
            </p>
          </div>

          {/* Action button */}
          {broadcastState === 'idle' && (
            <button
              onClick={handleLaunch}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20 transition-all"
            >
              📤 {t('launchBroadcast')}
            </button>
          )}

          {broadcastState === 'sending' && (
            <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <div className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <span className="text-sm font-medium">{t('broadcastSending')}</span>
            </div>
          )}

          {broadcastState === 'sent' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400">
                <span className="text-base">✅</span>
                <span className="text-sm font-medium">{t('broadcastLaunched')}</span>
              </div>
              <button
                onClick={() => setBroadcastState('idle')}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
