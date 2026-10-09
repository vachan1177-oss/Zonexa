import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface CampaignCard {
  id: string;
  emoji: string;
  titleKey: 'whatsappPreview' | 'instagramAsset' | 'reelsAsset';
  descKey: 'whatsappPreviewDesc' | 'instagramAssetDesc' | 'reelsAssetDesc';
  accent: 'success' | 'accent' | 'brand';
  preview: string | null;
}

const campaignCards: CampaignCard[] = [
  {
    id: 'whatsapp',
    emoji: '💬',
    titleKey: 'whatsappPreview',
    descKey: 'whatsappPreviewDesc',
    accent: 'success',
    preview: '🎉 Flash Sale! Get 30% off on all coffee combos today only! Walk in or order via WhatsApp. Limited stock — hurry! ☕',
  },
  {
    id: 'instagram',
    emoji: '📸',
    titleKey: 'instagramAsset',
    descKey: 'instagramAssetDesc',
    accent: 'accent',
    preview: null,
  },
  {
    id: 'reels',
    emoji: '🎬',
    titleKey: 'reelsAsset',
    descKey: 'reelsAssetDesc',
    accent: 'brand',
    preview: null,
  },
];

const accentMap: Record<string, { bg: string; text: string; btn: string }> = {
  success: {
    bg: 'bg-success-50 dark:bg-success-500/10',
    text: 'text-success-600 dark:text-success-400',
    btn: 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-success-500/20',
  },
  accent: {
    bg: 'bg-accent-50 dark:bg-accent-500/10',
    text: 'text-accent-600 dark:text-accent-400',
    btn: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-accent-500/20',
  },
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-500/10',
    text: 'text-brand-600 dark:text-brand-400',
    btn: 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-brand-500/20',
  },
};

export default function CampaignHub() {
  const { t } = useApp();
  const [postedCards, setPostedCards] = useState<Set<string>>(new Set());

  const togglePost = (cardId: string) => {
    setPostedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Campaign cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
          ⚡ {t('generatedCampaign')}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {campaignCards.map((card) => {
            const a = accentMap[card.accent];
            const isPosted = postedCards.has(card.id);

            return (
              <div
                key={card.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow"
              >
                {/* Preview area */}
                <div className={`relative h-44 flex items-center justify-center ${a.bg}`}>
                  {card.preview ? (
                    <div className="px-4 py-3 max-w-[90%] bg-white dark:bg-slate-800 rounded-xl rounded-tl-none shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-base">💬</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">WhatsApp</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{card.preview}</p>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center gap-2 ${a.text}`}>
                      <span className="text-5xl opacity-40">{card.emoji}</span>
                      <span className="text-xs font-medium opacity-60">Preview</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${a.bg} text-base`}>
                      {card.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t(card.titleKey)}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t(card.descKey)}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-3">
                    <button
                      onClick={() => togglePost(card.id)}
                      className={`
                        w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                        ${isPosted
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          : `${a.btn} text-white shadow-md`
                        }
                      `}
                    >
                      {isPosted ? (
                        <>✅ {t('posted')}</>
                      ) : (
                        <>📤 {t('postToOpen')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
