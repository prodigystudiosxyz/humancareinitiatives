import React from 'react';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import ImpactStories from './components/ImpactStories';
import FeaturedCampaigns from './components/FeaturedCampaigns';
import ImpactStats from './components/ImpactStats';
import Newsletter from './components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <ImpactStories />
      <FeaturedCampaigns />
      <ImpactStats />
      <Newsletter />
    </>
  );
}
