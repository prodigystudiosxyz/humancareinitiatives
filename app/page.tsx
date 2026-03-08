'use client';
import React from 'react';
import Hero from './components/Hero';
import CustomHero from './components/CustomHero';
import MissionSection from './components/MissionSection';
import ProjectsSection from './components/ProjectsSection';
import ImpactStories from './components/ImpactStories';
import FeaturedCampaigns from './components/FeaturedCampaigns';
import ImpactStats from './components/ImpactStats';
import Newsletter from './components/Newsletter';
import { useAdminData } from './admin/AdminDataContext';

export default function HomePage() {
  const { heroConfig } = useAdminData();

  return (
    <>
      {heroConfig.activeHero === 'primary' ? (
        <Hero />
      ) : (
        <CustomHero
          heading={heroConfig.heading}
          backgroundImage={heroConfig.backgroundImage}
          ctaText={heroConfig.ctaText}
          ctaLink={heroConfig.ctaLink}
        />
      )}
      <MissionSection />
      <ProjectsSection />
      <ImpactStories />
      <FeaturedCampaigns />
      <ImpactStats />
      <Newsletter />
    </>
  );
}
