import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

interface TopBarProps {
  onOpenMobile: () => void;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export default function TopBar({ onOpenMobile, titleKey, descKey }: TopBarProps) {
  const { t } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 text-lg"
          >
            ☰
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{t(titleKey)}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">{t(descKey)}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
            <input
              type="text"
              placeholder={t('search')}
              className="w-56 pl-9 pr-4 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
