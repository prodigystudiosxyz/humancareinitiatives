export type AppealUpdate = {
  date: string;
  title: string;
  body: string;
};

export type Appeal = {
  id: number;
  slug: string;
  project: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
  location: string;
  supporters: number;
  story: string[];
  impactPoints: string[];
  updates: AppealUpdate[];
  donations: {
    donorName: string;
    amount: number;
    createdLabel: string;
    message?: string;
    anonymous?: boolean;
  }[];
};

export const appeals: Appeal[] = [
  {
    id: 1,
    slug: 'ramadan-2026',
    project: 'Religious & Seasonal',
    title: 'Ramadan 2026 Appeal',
    description: 'Provide food parcels and meals to vulnerable families during the holy month of Ramadan.',
    image: 'https://images.unsplash.com/photo-1584260273760-b984dd81de70?auto=format&fit=crop&q=80&w=800',
    raised: 5000,
    target: 50000,
    location: 'Bangladesh',
    supporters: 45,
    story: [
      'Ramadan is a time of spiritual reflection and charity. However, millions of families struggle to find enough food to break their fast.',
      'Through our Ramadan 2026 Appeal, we aim to provide comprehensive food parcels and daily Iftar meals to the most vulnerable households.',
    ],
    impactPoints: [
      'Provide monthly food parcels for a family of 4',
      'Distribute daily hot Iftar meals',
      'Ensure vulnerable communities observe Ramadan with dignity',
    ],
    updates: [
      {
        date: 'Recent',
        title: 'Campaign Launched',
        body: 'Our Ramadan 2026 appeal is officially live, aiming to reach 5,000 families this year.',
      },
    ],
    donations: [
      { donorName: 'Anonymous donor', amount: 100, createdLabel: 'Recently', anonymous: true },
    ],
  },
];

export function getAppealBySlug(slug: string) {
  return appeals.find((appeal) => appeal.slug === slug);
}
