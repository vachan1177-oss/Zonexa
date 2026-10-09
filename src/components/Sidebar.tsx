import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

interface NavItem {
  id: string;
  emoji: string;
  labelKey: TranslationKey;
}

const navItems: NavItem[] = [
  { id: 'input-studio', emoji: '🏠', labelKey: 'navInputStudio' },
  { id: 'campaigns', emoji: '✨', labelKey: 'navCampaigns' },
  { id: 'feedback', emoji: '💬', labelKey: 'navFeedback' },
  { id: 'alerts', emoji: '🚨', labelKey: 'navAlerts' },
  { id: 'analytics', emoji: '📊', labelKey: 'navAnalytics' },
  { id: 'data-mgmt', emoji: '🗄️', labelKey: 'navDataMgmt' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { t, currentPage, setCurrentPage, logout, theme, toggleTheme, lang, toggleLang } = useApp();

  const handleNav = (id: string) => {
    setCurrentPage(id);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64 shrink-0
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          flex flex-col
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-500 shadow-lg shadow-brand-500/30">
              <span className="text-lg font-black text-white tracking-tighter">Z</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{t('appName')}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{t('appTagline')}</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
            {t('pages')}
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${active
                        ? 'bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-600 dark:text-brand-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    <span className="text-base shrink-0">{item.emoji}</span>
                    <span className="truncate">{t(item.labelKey)}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer controls */}
        <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-1">
          <div className="flex items-center gap-2 px-1 mb-2">
            <button
              onClick={toggleLang}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              🌐 {lang === 'en' ? 'English' : 'ಕನ್ನಡ'}
            </button>
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? t('dark') : t('light')}
            </button>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-error-50 dark:hover:bg-error-500/10 hover:text-error-600 dark:hover:text-error-400 transition-all"
          >
            <span className="text-base shrink-0">🚪</span>
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
