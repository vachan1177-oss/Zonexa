import { useState, type FormEvent } from 'react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const { t, login, theme, toggleTheme, lang, toggleLang } = useApp();
  const [email, setEmail] = useState(() => localStorage.getItem('zonexa-remembered-email') || '');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(() => !!localStorage.getItem('zonexa-remembered-email'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('invalidCreds'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (rememberEmail) {
        localStorage.setItem('zonexa-remembered-email', email.trim());
      } else {
        localStorage.removeItem('zonexa-remembered-email');
      }
      login(email.trim());
    }, 800);
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotSent(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-900 dark:to-accent-950 transition-colors duration-300 p-4">
      {/* Top-right controls */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          🌐 {lang === 'en' ? 'EN' : 'ಕನ್'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors text-base"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 mb-4">
            <span className="text-3xl font-black text-white tracking-tighter">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('appName')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('appTagline')}</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{t('loginTitle')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('loginSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('email')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-error-500 dark:text-error-400 animate-fade-in">{error}</p>
            )}

            {/* Remember email + forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-500 focus:ring-brand-500/30 cursor-pointer"
                />
                <span className="text-slate-600 dark:text-slate-400">{t('rememberEmail')}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
              >
                {t('forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white font-medium hover:from-brand-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-60 transition-all shadow-lg shadow-brand-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signingIn')}
                </>
              ) : (
                <>
                  {t('signIn')} ➜
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-5">
            {t('demoNote')}
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in p-4"
          onClick={closeForgot}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {forgotSent ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-50 dark:bg-success-500/10 text-3xl mb-4">
                  ✅
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{t('resetLinkSent')}</p>
                <button
                  onClick={closeForgot}
                  className="mt-4 w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('forgotTitle')}</h3>
                  <button
                    onClick={closeForgot}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-base"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('forgotDesc')}</p>
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📧</span>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder={t('resetEmail')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!forgotEmail.trim()}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-medium hover:from-brand-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all"
                  >
                    {t('sendResetLink')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
