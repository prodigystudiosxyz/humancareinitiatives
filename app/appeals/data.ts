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
    slug: 'ramadan-food-support',
    project: 'Emergency Relief',
    title: 'Ramadan Food Support',
    description: 'Food packs and daily essentials for vulnerable families.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
    raised: 3517,
    target: 50000,
    location: 'Dhaka and surrounding districts',
    supporters: 126,
    story: [
      'This appeal helps vulnerable households prepare for Ramadan with dignity. Donations go toward staple food packs, cooking essentials, and urgent support for families facing rising living costs.',
      'Our team works through local volunteers and community partners to identify households who would otherwise struggle to access food support. Priority is given to widows, elderly people, and families affected by displacement or income loss.',
      'Each contribution helps us respond quickly and distribute support where it is needed most, while keeping delivery practical and community-led.',
    ],
    impactPoints: [
      'Food packs for families facing immediate hardship',
      'Local volunteer delivery across priority communities',
      'Support focused on widows, elderly people, and displaced households',
    ],
    updates: [
      {
        date: 'March 2, 2026',
        title: 'First distribution round prepared',
        body: 'Our field team has finalized beneficiary lists for the first Ramadan distribution round and procurement is underway.',
      },
      {
        date: 'February 20, 2026',
        title: 'Community coordination completed',
        body: 'Volunteers across multiple districts have confirmed delivery points to ensure packs reach families quickly.',
      },
    ],
    donations: [
      { donorName: 'Ahmed', amount: 100, createdLabel: 'Today', message: 'May this reach families in time.' },
      { donorName: 'Fatima', amount: 50, createdLabel: '2 days ago' },
      { donorName: 'Anonymous donor', amount: 25, createdLabel: 'Recently', anonymous: true },
    ],
  },
  {
    id: 2,
    slug: 'flood-shelter-response',
    project: 'Emergency Relief',
    title: 'Flood Shelter Response',
    description: 'Rapid shelter kits and hygiene support in flood zones.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80',
    raised: 11840,
    target: 42000,
    location: 'Sylhet flood-affected communities',
    supporters: 204,
    story: [
      'Flooding leaves families without safe shelter, dry bedding, or basic hygiene supplies. This appeal supports fast response kits to help households stabilize in the immediate aftermath.',
      'Support includes shelter materials, blankets, hygiene items, and practical essentials that reduce exposure and restore a minimum level of safety.',
      'The aim is not only to respond quickly, but to make sure assistance reaches communities that are often underserved when roads and access routes are disrupted.',
    ],
    impactPoints: [
      'Emergency shelter kits for displaced households',
      'Hygiene and bedding support after flooding',
      'Fast local coordination in hard-to-reach areas',
    ],
    updates: [
      {
        date: 'January 28, 2026',
        title: 'Shelter materials dispatched',
        body: 'Initial batches of tarpaulins and dry bedding support have been sent to partner teams in affected zones.',
      },
    ],
    donations: [
      { donorName: 'Yusuf', amount: 250, createdLabel: 'Today' },
      { donorName: 'Anonymous donor', amount: 100, createdLabel: '5 days ago', anonymous: true },
      { donorName: 'Maryam', amount: 40, createdLabel: 'Recently' },
    ],
  },
  {
    id: 3,
    slug: 'clean-water-wells',
    project: 'Water & Sanitation',
    title: 'Clean Water Wells',
    description: 'Community wells to provide safe and reliable clean water.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
    raised: 15920,
    target: 60000,
    location: 'Rural communities across Bangladesh',
    supporters: 189,
    story: [
      'Access to clean water changes daily life for entire communities. This appeal supports the installation of safe water points where families currently walk long distances or rely on unsafe sources.',
      'By placing wells close to homes and communal areas, the project reduces time spent collecting water and improves day-to-day health outcomes.',
      'The work is planned with local communities so each installation is practical, maintainable, and built around long-term use.',
    ],
    impactPoints: [
      'Safe water access for villages without reliable sources',
      'Reduced time spent collecting water, especially for women and children',
      'Locally coordinated installation and upkeep planning',
    ],
    updates: [
      {
        date: 'February 12, 2026',
        title: 'Site assessments completed',
        body: 'Three priority communities have been surveyed and approved for the next well installations.',
      },
    ],
    donations: [
      { donorName: 'Hassan', amount: 75, createdLabel: 'Today' },
      { donorName: 'Anonymous donor', amount: 30, createdLabel: '1 day ago', anonymous: true },
      { donorName: 'Zara', amount: 120, createdLabel: '1 week ago', message: 'For clean water access.' },
    ],
  },
  {
    id: 4,
    slug: 'school-essentials-drive',
    project: 'Education',
    title: 'School Essentials Drive',
    description: 'Uniforms, books, and classroom materials for children.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    raised: 6425,
    target: 20000,
    location: 'Primary schools in underserved districts',
    supporters: 97,
    story: [
      'Many children remain excluded from learning because they cannot afford basic school supplies. This appeal supports uniforms, stationery, books, and classroom materials.',
      'The goal is to reduce the hidden barriers that keep children from attending school consistently and participating with confidence.',
    ],
    impactPoints: [
      'Uniforms and books for children in need',
      'Basic materials that support classroom participation',
      'Targeted support for families under financial strain',
    ],
    updates: [
      {
        date: 'February 1, 2026',
        title: 'School shortlist confirmed',
        body: 'Partner schools have submitted their final supply requests for the next delivery phase.',
      },
    ],
    donations: [
      { donorName: 'Imran', amount: 60, createdLabel: 'Recently' },
      { donorName: 'Aisha', amount: 35, createdLabel: '4 days ago' },
      { donorName: 'Anonymous donor', amount: 20, createdLabel: '1 week ago', anonymous: true },
    ],
  },
  {
    id: 5,
    slug: 'women-skills-program',
    project: 'Livelihood',
    title: 'Women Skills Program',
    description: 'Skills and startup kits for women-led household income.',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80',
    raised: 9275,
    target: 30000,
    location: 'Women-led households in community hubs',
    supporters: 113,
    story: [
      'This appeal supports women with practical skills training and starter resources that can translate into stable household income.',
      'Rather than short-term assistance alone, the focus is on building pathways toward resilience and self-sustaining livelihoods.',
    ],
    impactPoints: [
      'Skills development linked to local market needs',
      'Starter kits for income-generating work',
      'Support for women-led households under pressure',
    ],
    updates: [
      {
        date: 'January 18, 2026',
        title: 'Training cohort selected',
        body: 'Community coordinators have finalized the first group of participants for the upcoming cycle.',
      },
    ],
    donations: [
      { donorName: 'Bilal', amount: 90, createdLabel: 'Today' },
      { donorName: 'Anonymous donor', amount: 50, createdLabel: 'Recently', anonymous: true },
      { donorName: 'Sadia', amount: 25, createdLabel: '6 days ago' },
    ],
  },
  {
    id: 6,
    slug: 'scholarship-fund',
    project: 'Education',
    title: 'Scholarship Fund',
    description: 'Annual scholarships for high-potential students in need.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
    raised: 10100,
    target: 25000,
    location: 'Secondary and university students',
    supporters: 142,
    story: [
      'The scholarship fund helps students with strong potential continue their education despite financial barriers.',
      'Support is directed toward fees, study materials, and other costs that often interrupt educational progress.',
    ],
    impactPoints: [
      'Scholarships for students at risk of dropping out',
      'Support for fees and essential study costs',
      'Longer-term investment in educational opportunity',
    ],
    updates: [
      {
        date: 'February 8, 2026',
        title: 'Applications under review',
        body: 'The review process is underway for this year’s scholarship candidates.',
      },
    ],
    donations: [
      { donorName: 'Noor', amount: 150, createdLabel: 'Today' },
      { donorName: 'Anonymous donor', amount: 50, createdLabel: '3 days ago', anonymous: true },
      { donorName: 'Khalid', amount: 80, createdLabel: 'Recently' },
    ],
  },
];

export function getAppealBySlug(slug: string) {
  return appeals.find((appeal) => appeal.slug === slug);
}
