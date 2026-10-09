import { useState, type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';
import InputStudio from '@/pages/InputStudio';
import CampaignHub from '@/pages/CampaignHub';
import FeedbackPage from '@/pages/FeedbackPage';
import AlertsPage from '@/pages/AlertsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DataManagement from '@/pages/DataManagement';

interface PageMeta {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  component: ReactNode;
}

const pageMap: Record<string, PageMeta> = {
  'input-studio': {
    titleKey: 'inputStudioTitle',
    descKey: 'inputStudioDesc',
    component: <InputStudio />,
  },
  campaigns: {
    titleKey: 'campaignHubTitle',
    descKey: 'campaignHubDesc',
    component: <CampaignHub />,
  },
  feedback: {
    titleKey: 'feedbackTitle',
    descKey: 'feedbackDesc',
    component: <FeedbackPage />,
  },
  alerts: {
    titleKey: 'alertsTitle',
    descKey: 'alertsDesc',
    component: <AlertsPage />,
  },
  analytics: {
    titleKey: 'analyticsTitle',
    descKey: 'analyticsDesc',
    component: <AnalyticsPage />,
  },
  'data-mgmt': {
    titleKey: 'dataMgmtTitle',
    descKey: 'dataMgmtDesc',
    component: <DataManagement />,
  },
};

export default function DashboardLayout() {
  const { currentPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = pageMap[currentPage] ?? pageMap['input-studio'];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          onOpenMobile={() => setMobileOpen(true)}
          titleKey={meta.titleKey}
          descKey={meta.descKey}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div key={currentPage} className="animate-fade-in">
            {meta.component}
          </div>
        </main>
      </div>
    </div>
  );
}
