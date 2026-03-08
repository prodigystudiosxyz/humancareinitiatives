export type NewsItem = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    image: string;
    date?: string;
    content: string[];
};

export const leadStory: NewsItem = {
    id: 0,
    slug: 'rebuilding-livelihoods-after-flood',
    title: 'Rebuilding Livelihoods After the Flood',
    summary: 'Inside the community-led recovery model now active across northern districts.',
    image: 'https://images.unsplash.com/photo-1524492449090-1f53069de623?auto=format&fit=crop&w=1200&q=80',
    date: 'March 2026',
    content: [
        'The devastating floods that swept through the northern districts left thousands of families without homes or livelihoods. In the wake of this disaster, a community-led recovery model has emerged as the most effective path forward.',
        'Working hand-in-hand with local leaders, we have established rapid Response Centers to distribute essential supplies and coordinate rebuilding efforts. The focus is not just on immediate relief, but on long-term sustainability.',
        'Through micro-grants and agricultural support, communities are beginning to plant new seeds and rebuild their businesses. The resilience shown by these families is nothing short of inspiring.',
    ],
};

export const highlights: NewsItem[] = [
    {
        id: 1,
        slug: 'well-construction-accelerating',
        title: 'How Well Construction Is Accelerating',
        summary: 'Updates on our safe water access initiatives.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80',
        date: 'February 2026',
        content: [
            'Access to clean water remains one of the most critical challenges in rural areas. Our recent push to accelerate deep tube well construction is already showing results.',
            'By streamlining the logistics of drilling equipment delivery and partnering with local engineering firms, we have reduced the average construction time by 30%.',
            'This means more families get access to safe drinking water sooner, significantly reducing the incidence of waterborne diseases in these vulnerable communities.',
        ],
    },
    {
        id: 2,
        slug: 'community-teachers-driving-attendance',
        title: 'Community Teachers Driving Attendance',
        summary: 'The impact of local educators on student retention.',
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=700&q=80',
        date: 'January 2026',
        content: [
            'Education is the cornerstone of sustainable development. However, keeping children in school requires more than just building classrooms; it requires dedicated teachers who understand the local context.',
            'Our new initiative focuses on training and supporting teachers from within the communities they serve. This approach has led to a remarkable increase in student attendance and engagement.',
            'When students see role models from their own backgrounds leading the classroom, they are more motivated to learn and succeed.',
        ],
    },
    {
        id: 3,
        slug: 'nutrition-programs-expanding',
        title: 'Nutrition Programs Expanding for Mothers',
        summary: 'Supporting maternal health through targeted nutrition.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
        date: 'December 2025',
        content: [
            'Maternal health is inextricably linked to the health of the entire family. Recognizing this, we have expanded our nutrition programs targeted specifically at expectant and new mothers.',
            'These programs provide essential vitamins, nutrient-dense food supplements, and critical health education. The goal is to ensure both mothers and babies receive the best possible start.',
            'Early results indicate a significant improvement in maternal health indicators and healthier birth weights across the participating regions.',
        ],
    },
];

export const stories: NewsItem[] = [
    {
        id: 4,
        slug: 'on-the-ground-in-khulna',
        title: 'On the Ground in Khulna',
        summary: 'A quick look at local teams managing rapid response delivery.',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80',
        date: 'November 2025',
        content: [
            'Our teams in Khulna are working around the clock to manage the influx of relief supplies and ensure they reach the most affected areas efficiently.',
            'The logistical challenges are immense, from navigating damaged roads to coordinating with multiple local agencies. Yet, the dedication of our volunteers makes it possible.',
            'This rapid response delivery model is proving crucial in minimizing the impact of the recent crises and providing immediate support to those in need.',
        ],
    },
    {
        id: 5,
        slug: 'how-donor-giving-reached-42-communities',
        title: 'How Donor Giving Reached 42 Communities',
        summary: 'Tracking distribution and outcomes from recent campaigns.',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
        date: 'October 2025',
        content: [
            'Transparency and accountability are at the core of our operations. After our recent major fundraising campaign, we set out to meticulously track every donation.',
            'We are proud to report that the funds raised have successfully supported 42 distinct communities across the country. The impact ranges from new school supplies to emergency medical care.',
            'This extensive reach was made possible by the incredible generosity of our donors and the hard work of our field teams who ensured the aid reached its intended destinations.',
        ],
    },
    {
        id: 6,
        slug: 'new-year-for-education-support',
        title: 'A New Year for Education Support',
        summary: 'What changed in school readiness and classroom retention.',
        image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
        date: 'September 2025',
        content: [
            'As the new school year begins, we are seeing the fruits of our long-term education support initiatives. School readiness programs have better prepared incoming students.',
            'Furthermore, classroom retention rates have improved significantly, thanks in part to our continuous support for both students and their families.',
            'By addressing underlying issues such as poverty and lack of resources, we are helping create an environment where education can truly thrive.',
        ],
    },
    {
        id: 7,
        slug: 'women-led-microenterprise-updates',
        title: 'Women-Led Microenterprise Updates',
        summary: 'Small grants and practical training driving household growth.',
        image: 'https://images.unsplash.com/photo-1592598015799-63f67a5d6c4f?auto=format&fit=crop&w=900&q=80',
        date: 'August 2025',
        content: [
            'Empowering women economically is one of the most effective ways to lift entire families out of poverty. Our microenterprise program is doing just that.',
            'By providing small seed grants and practical business training, we are helping women start and grow their own small businesses, from tailoring to agriculture.',
            'These enterprises are not only generating income but also fostering a sense of independence and leadership among the women participants.',
        ],
    },
    {
        id: 8,
        slug: 'inside-medical-camp-workflow',
        title: 'Inside the Medical Camp Workflow',
        summary: 'How outreach teams process hundreds of patients each week.',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
        date: 'July 2025',
        content: [
            'Our mobile medical camps bring essential healthcare services to remote areas where access is otherwise limited. The workflow is designed for maximum efficiency.',
            'From initial triage to consultations with doctors and dispensing medications, every step is carefully coordinated. Our outreach teams process hundreds of patients weekly.',
            'This dedicated effort ensures that even the most isolated communities receive the medical attention they desperately need.',
        ],
    },
    {
        id: 9,
        slug: 'youth-volunteers-local-change',
        title: 'Youth Volunteers and Local Change',
        summary: 'A snapshot of volunteer-led activity across partner regions.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
        date: 'June 2025',
        content: [
            'The energy and passion of youth are driving significant change at the local level. Our youth volunteer programs are empowering young people to take the lead.',
            'Whether it is organizing community clean-ups, tutoring younger students, or assisting in relief distribution, these volunteers are making a tangible difference.',
            'They are not just helping their communities today; they are developing the leadership skills necessary to guide those communities tomorrow.',
        ],
    },
];

export const allNews: NewsItem[] = [leadStory, ...highlights, ...stories];

export function getNewsBySlug(slug: string): NewsItem | undefined {
    return allNews.find((news) => news.slug === slug);
}

export function getSimilarNews(currentId: number, limit: number = 3): NewsItem[] {
    return allNews.filter((news) => news.id !== currentId).slice(0, limit);
}
