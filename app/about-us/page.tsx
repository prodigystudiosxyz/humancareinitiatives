import React from 'react';
import AboutStory from '../components/AboutStory';
import AboutFormula from '../components/AboutFormula';
import AboutValues from '../components/AboutValues';
import AboutCTA from '../components/AboutCTA';

export const metadata = {
  title: 'About Us | Human Care Initiative',
  description: 'Learn about the story and mission of Human Care Initiative, dedicated to serving the most vulnerable in Bangladesh.',
};

export default function AboutUsPage() {
  return (
    <div className="about-us-page">
      <AboutStory />
      <AboutFormula />
      <AboutValues />
      <AboutCTA />
    </div>
  );
}
