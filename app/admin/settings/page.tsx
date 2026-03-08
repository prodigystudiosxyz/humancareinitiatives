'use client';

import React, { useState, useEffect } from 'react';
import styles from '../AdminDashboard.module.css';
import { useAdminData } from '../AdminDataContext';

export default function SettingsPage() {
    const { heroConfig, setHeroConfig } = useAdminData();

    // Social Links (Mock for now)
    const [socialLinks, setSocialLinks] = useState({
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        twitter: '',
    });

    // Custom Hero Local State
    const [heroDraft, setHeroDraft] = useState(heroConfig);

    useEffect(() => {
        setHeroDraft(heroConfig);
    }, [heroConfig]);

    const [isSavingSocial, setIsSavingSocial] = useState(false);
    const [socialSuccessMsg, setSocialSuccessMsg] = useState('');

    const [isSavingHero, setIsSavingHero] = useState(false);
    const [heroSuccessMsg, setHeroSuccessMsg] = useState('');

    const handleSaveSocial = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSocial(true);
        setSocialSuccessMsg('');

        setTimeout(() => {
            setIsSavingSocial(false);
            setSocialSuccessMsg('Social settings saved successfully (mock)');
            setTimeout(() => setSocialSuccessMsg(''), 3000);
        }, 800);
    };

    const handleSaveHero = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingHero(true);
        setHeroSuccessMsg('');

        // Actually save to context
        setHeroConfig(heroDraft);

        setTimeout(() => {
            setIsSavingHero(false);
            setHeroSuccessMsg('Hero configuration saved!');
            setTimeout(() => setHeroSuccessMsg(''), 3000);
        }, 500);
    };

    return (
        <div className={styles.sectionStack}>

            {/* Custom Hero Settings */}
            <div className={styles.panelCardFull}>
                <h3>Hero Section Configuration</h3>
                <p>Choose which hero section is displayed on the homepage and customize the secondary hero layout.</p>

                {heroSuccessMsg && <p className={styles.notice}>{heroSuccessMsg}</p>}

                <form className={styles.form} onSubmit={handleSaveHero} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="activeHero">Active Hero Variant</label>
                            <select
                                id="activeHero"
                                value={heroDraft.activeHero}
                                onChange={(e) => setHeroDraft({ ...heroDraft, activeHero: e.target.value as 'primary' | 'secondary' })}
                            >
                                <option value="primary">Primary Hero (Built-in Cards Layout)</option>
                                <option value="secondary">Secondary Hero (Custom Layout)</option>
                            </select>
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
                            <h4 style={{ margin: '0.5rem 0 1rem 0' }}>Secondary Hero Customization</h4>
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="heroHeading">Heading Text</label>
                            <input
                                id="heroHeading"
                                type="text"
                                value={heroDraft.heading}
                                onChange={(e) => setHeroDraft({ ...heroDraft, heading: e.target.value })}
                                placeholder="E.g. Together, we can build a better tomorrow"
                                required
                            />
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="heroBg">Background Image URL</label>
                            <input
                                id="heroBg"
                                type="url"
                                value={heroDraft.backgroundImage}
                                onChange={(e) => setHeroDraft({ ...heroDraft, backgroundImage: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="ctaText">CTA Button Text</label>
                            <input
                                id="ctaText"
                                type="text"
                                value={heroDraft.ctaText}
                                onChange={(e) => setHeroDraft({ ...heroDraft, ctaText: e.target.value })}
                                placeholder="E.g. Discover Our Impact"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="ctaLink">CTA Button Link</label>
                            <input
                                id="ctaLink"
                                type="text"
                                value={heroDraft.ctaLink}
                                onChange={(e) => setHeroDraft({ ...heroDraft, ctaLink: e.target.value })}
                                placeholder="E.g. /donate"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ marginTop: '1.5rem' }}>
                        <button type="submit" className={styles.primaryBtn} disabled={isSavingHero}>
                            {isSavingHero ? 'Saving...' : 'Save Hero Config'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Social Links Form */}
            <div className={styles.panelCardFull}>
                <h3>Footer Social Links</h3>
                <p>Manage the social media links displayed in the website footer.</p>

                {socialSuccessMsg && <p className={styles.notice}>{socialSuccessMsg}</p>}

                <form className={styles.form} onSubmit={handleSaveSocial}>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="facebook">Facebook URL</label>
                            <input
                                id="facebook"
                                type="url"
                                value={socialLinks.facebook}
                                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                                placeholder="https://facebook.com/your-page"
                            />
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="instagram">Instagram URL</label>
                            <input
                                id="instagram"
                                type="url"
                                value={socialLinks.instagram}
                                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                placeholder="https://instagram.com/your-profile"
                            />
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="linkedin">LinkedIn URL</label>
                            <input
                                id="linkedin"
                                type="url"
                                value={socialLinks.linkedin}
                                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/your-profile"
                            />
                        </div>

                        <div className={styles.fieldSpanFull}>
                            <label htmlFor="twitter">Twitter URL</label>
                            <input
                                id="twitter"
                                type="url"
                                value={socialLinks.twitter}
                                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                                placeholder="https://twitter.com/your-handle"
                            />
                        </div>
                    </div>

                    <div className={styles.buttonRow}>
                        <button type="submit" className={styles.primaryBtn} disabled={isSavingSocial}>
                            {isSavingSocial ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.panelCardFull}>
                <h3>Mock Settings Disclaimer</h3>
                <p className={styles.mutedText}>
                    Note: The Footer Social Links is a mock settings frame. Only the Hero Section configuration is fully integrated to the frontend.
                </p>
            </div>
        </div>
    );
}
