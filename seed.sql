-- Human Care Initiative - Seed Data

-- 0. CLEANUP
DELETE FROM public.site_settings;
DELETE FROM public.magazine_posts;
DELETE FROM public.impact_gallery;
DELETE FROM public.impact_reports;
DELETE FROM public.impact_stories;
DELETE FROM public.donations;
DELETE FROM public.appeals;
DELETE FROM public.subprojects;
DELETE FROM public.projects;

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (id, value) VALUES 
('hero_config', '{
    "activeHero": "primary",
    "heading": "Together, we can build a better tomorrow",
    "backgroundImage": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    "ctaText": "Discover Our Impact",
    "ctaLink": "#projects"
}'),
('social_links', '{
    "facebook": "https://facebook.com",
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com",
    "twitter": ""
}'),
('about_story', $JSON$
{
    "headline": "Human Care was inspired by a mother in Bangladesh who would quietly feed those who came to her door even when she herself went to bed hungry.",
    "title": "HCI Story",
    "content_left": "From that simple but profound act grew a mission of care. But as a few friends noticed, care wasn’t enough.\\nOrganisations desperate to help, would fly in, fly out, year after year, but the problems seemed to keep getting bigger rather than smaller.\\nOn closer inspection, often, behind the impact numbers and reports: the most in need and vulnerable were left forgotten, only the strongest made their way to the front of the line to access help.\\nSomething needed to be improved.\\nThe most vulnerable could not simply wait to be found, they had to be sought out. And they needed more than a temporary bandage.",
    "content_right": "Human Care was a humble attempt at that answer.\\nWith a dedicated focus on Bangladesh, we committed to building expertise in sustainable, strategic impact.\\nThrough a trusted local network of hundreds of volunteers across every district, we identify and prioritise those most in need, ensuring help reaches the forgotten first.\\nThat mission to care for the most vulnerable continues today, so we can work to a future where we don''t need to exist tomorrow."
}
$JSON$),
('about_formula', $JSON$
{
    "title": "The Human Care Formula",
    "items": [
        {
            "label": "Our Vision",
            "content": "A world where Human Care **doesn''t need to exist** for the most vulnerable in Bangladesh to live with freedom, justice, and dignity."
        },
        {
            "label": "Our Mission",
            "content": "To provide **strategic, sustainable, and dignified support** to those most in need in Bangladesh."
        },
        {
            "label": "Strategy",
            "content": "Focusing on local expertise and volunteer networks to ensure resources reach the **most forgotten** first."
        }
    ]
}
$JSON$),
('about_values', $JSON$
{
    "title": "Our Values",
    "items": [
        {
            "title": "Care",
            "description": "We try to look and act beyond the material and metrics. We try our best to listen to our brothers and sisters, and attempt to walk in their shoes, not for marketing, but to design better programmes and processes so your pound goes further.",
            "icon": "Heart"
        },
        {
            "title": "Dignity",
            "description": "We don’t give, we serve. We don’t put aid in people’s hands, they take it from us. Our hands are never raised above theirs, and their hands are never outstretched beneath ours.",
            "icon": "HandHeart"
        },
        {
            "title": "Sustainable",
            "description": "A cornerstone of our approach is not just giving a handout but also a strong hand up. Communities should be given the tools to stand on their own two feet without us or you.",
            "icon": "RefreshCcw"
        }
    ]
}
$JSON$),
('newsletter_config', '{
    "headline": "What''s quietly transforming \\ncommunities in Bangladesh?",
    "privacy_text": "Stay updated with real stories of impact. No spam"
}'),
('footer_config', '{
    "brand_description": "Human Care is a UK based charity specializing in delivering strategic, sustainable, and dignified support to the most needy in Bangladesh."
}')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- 2. PROJECTS (CLEAR AND INSERT NEW)
INSERT INTO public.projects (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Humanitarian and Emergency Response', 'humanitarian-emergency-response', 'Immediate assistance to disaster-affected communities across Bangladesh.'),
  ('22222222-2222-2222-2222-222222222222', 'Education Support and Child Development', 'education-support-child-development', 'Ensuring vulnerable children and talented students have the opportunity to continue their education.'),
  ('33333333-3333-3333-3333-333333333333', 'Livelihood and Economic Empowerment', 'livelihood-economic-empowerment', 'Supporting vulnerable families by providing income-generating opportunities and resources.'),
  ('44444444-4444-4444-4444-444444444444', 'Water, Sanitation, Health and Hygiene (WASH)', 'wash-program', 'Improving community health by installing deep tube wells and sanitation facilities.'),
  ('55555555-5555-5555-5555-555555555555', 'Religious and Seasonal Welfare', 'religious-seasonal-welfare', 'Supporting vulnerable families during important religious periods like Ramadan and Eid.');

-- 3. SUBPROJECTS (CLEAR AND INSERT NEW)
INSERT INTO public.subprojects (
  id, project_id, title, slug, summary, thumbnail_url, category, raised, goal,
  is_landing_project, is_navbar_project, is_featured_campaign, custom_tagline, short_description, locations
) VALUES
  -- Humanitarian & Emergency
  ('01111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Emergency Food Assistance', 'emergency-food-assistance', 
   'Emergency food packages for flood and disaster victims including rice, lentils, and oil.', 
   'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', 
   'emergency', 12450, 45000, true, true, true, 'Most urgent now', '14,320 flash flood affected families supported so far.', ARRAY['Sylhet', 'Sunamganj', 'Kurigram', 'Jamalpur', 'Feni']),

  ('01222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Rohingya Humanitarian Food Support', 'rohingya-food-support', 
   'Assistance delivered to Rohingya refugee families living in camps facing food shortages.', 
   'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', 
   'emergency', 8500, 20000, false, true, false, null, null, ARRAY['Cox’s Bazar']),

  ('01333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Winter Relief and Clothing', 'winter-relief-clothing', 
   'Distributing blankets and warm clothing to elderly and children in cold-prone areas.', 
   'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', 
   'emergency', 5600, 15000, false, false, false, null, null, ARRAY['Rangpur', 'Kurigram', 'Gaibandha']),

  ('01444444-4444-4444-4444-444411111111', '11111111-1111-1111-1111-111111111111', 'Emergency Response & Disaster Support', 'emergency-response-disaster', 
   'Rapid support including food, shelter materials, and clothing during crises.', 
   'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800', 
   'emergency', 2100, 10000, false, false, false, null, null, ARRAY['Bangladesh']),

  -- Education
  ('02111111-1111-1111-1111-111122222222', '22222222-2222-2222-2222-222222222222', 'Orphan Care and Education', 'orphan-care-education', 
   'Accommodation, food, and education expenses for orphan children in 25 supported orphanages.', 
   'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 34200, 60000, true, true, true, 'Sponsor an orphan', '1,400 orphan students receiving regular support.', ARRAY['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi']),

  ('02222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Educational Scholarship Program', 'educational-scholarship', 
   'Scholarships for school, university, and postgraduate researchers from low-income families.', 
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 12000, 25000, false, false, false, null, null, ARRAY['Dhaka']),

  -- Livelihood
  ('03111111-1111-1111-1111-111133333333', '33333333-3333-3333-3333-333333333333', 'Livelihood Development Program', 'livelihood-development', 
   'Income-generating assets: sewing machines, rickshaws, and small business capital.', 
   'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80', 
   'sustainable', 8900, 20000, true, true, false, null, null, ARRAY['Dhaka', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Hatiya', 'Bogura', 'Sylhet']),

  ('03222222-2222-2222-2222-222233333333', '33333333-3333-3333-3333-333333333333', 'Livestock Support Program', 'livestock-support', 
   'Providing dairy cows and goats to rural households for sustainable income.', 
   'https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 4500, 12000, false, false, false, null, null, ARRAY['Bangladesh']),

  -- WASH
  ('04111111-1111-1111-1111-111144444444', '44444444-4444-4444-4444-444444444444', 'Safe Water Access (Deep Tube Wells)', 'safe-water-access', 
   'Installing deep tube wells to provide clean drinking water to water-scarce communities.', 
   'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 18600, 30000, false, true, false, null, null, ARRAY['Bangladesh']),

  ('04444444-4444-4444-4444-444444444447', '44444444-4444-4444-4444-444444444444', 'Blind Girls Support & Rehabilitation', 'blind-girls-support', 
   'Accommodation, education, and healthcare for visually impaired girls in Dhaka.', 
   'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 12000, 20000, false, false, false, null, null, ARRAY['Dhaka']),

  -- Religious & Seasonal
  ('05111111-1111-1111-1111-111155555555', '55555555-5555-5555-5555-555555555555', 'Ramadan Food Assistance', 'ramadan-food-assistance', 
   'Providing essential food packages to vulnerable families during the holy month of Ramadan.', 
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', 
   'emergency', 15000, 30000, false, true, false, null, null, ARRAY['Dhaka', 'Sylhet', 'Rajshahi']),

  ('05222222-2222-2222-2222-222255555556', '55555555-5555-5555-5555-555555555555', 'Qurbani Meat Distribution', 'qurbani-meat-distribution', 
   'Sharing the joy of Eid-ul-Adha by distributing fresh meat to those who cannot afford it.', 
   'https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?auto=format&fit=crop&q=80&w=800', 
   'emergency', 0, 50000, false, true, false, null, null, ARRAY['Bangladesh']),

  ('05333333-3333-3333-3333-333355555557', '55555555-5555-5555-5555-555555555555', 'Masjid Construction & Renovation', 'masjid-construction', 
   'Building and restoring community mosques to serve as centers for spiritual and social growth.', 
   'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', 
   'sustainable', 5000, 25000, false, false, false, null, null, ARRAY['Sylhet', 'Sunamganj']);

-- 4. IMPACT STORIES
INSERT INTO public.impact_stories (id, title, image_url, content, display_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Meet Sabina!', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=800', 
   'In 2015 she and her two children were struggling to make ends meet.<br/><br/>Human Care gave her a cow. Selling the offspring and produce at the local market, she was able to purchase a piece of farming land and a fish farm.<br/><br/>She and her family are now only Allah dependent!', 
   1),
  ('b2222222-2222-2222-2222-222222222222', 'Meet Zaheer!', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800', 
   'Zaheer lived in our supported orphanage home as a child, and we now fund him through university.<br/><br/>We follow through with our orphans and help them achieve their childhood dreams!', 
   2),
  ('b3333333-3333-3333-3333-333333333333', 'Meet Amina!', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800', 
   'Amina''s village had no clean water for miles. Human Care installed a deep tube well right next to her cluster of homes.\\nNow she and 40 other families have instant access to safe, clean water every single day.', 
   3);
