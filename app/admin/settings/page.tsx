'use client';

import React, { useState, useEffect } from 'react';
import styles from '../AdminDashboard.module.css';
import { useAdminData } from '../AdminDataContext';
import { Save, Layout, Info } from 'lucide-react';
import { AdminCard, AdminButton } from '../components/AdminUI';

export default function SettingsPage() {
    const {
        heroConfig, setHeroConfig
    } = useAdminData();

    // Local states for drafts
    const [heroDraft, setHeroDraft] = useState(heroConfig);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setHeroDraft(heroConfig);
    }, [heroConfig]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await setHeroConfig(heroDraft);
        setSaving(false);
    };

    return (
        <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
                <div className={styles.titleRow}>
                    <Layout className={styles.sectionIcon} size={28} />
                    <div>
                        <h2 className={styles.sectionTitle}>Website Settings</h2>
                        <p className={styles.sectionDescription}>Manage global configurations, branding, and hero section variants.</p>
                    </div>
                </div>
            </div>

            <AdminCard
                title="Hero Section Configuration"
                fullWidth
                footer={
                    <AdminButton
                        onClick={() => { }}
                        type="submit"
                        loading={saving}
                        form="settings-form"
                    >
                        <Save size={18} style={{ marginRight: '8px' }} />
                        Save Settings
                    </AdminButton>
                }
            >
                <form id="settings-form" className={styles.form} onSubmit={handleSave}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup} style={{ flex: '1 1 300px' }}>
                            <label>Active Hero Variant</label>
                            <select
                                value={heroDraft.activeHero}
                                onChange={(e) => setHeroDraft({ ...heroDraft, activeHero: e.target.value as any })}
                            >
                                <option value="primary">Primary (Interactive Cards)</option>
                                <option value="secondary">Secondary (Custom Banner)</option>
                            </select>
                            <p className={styles.fieldHelp}>Choose which hero design to display on the landing page.</p>
                        </div>

                        <div className={styles.formGroup} style={{ flex: '1 1 100%' }}>
                            <label>Heading Text</label>
                            <input
                                type="text"
                                value={heroDraft.heading}
                                onChange={(e) => setHeroDraft({ ...heroDraft, heading: e.target.value })}
                                placeholder="e.g. Transform lives today"
                            />
                        </div>

                        <div className={styles.formGroup} style={{ flex: '1 1 100%' }}>
                            <label>Background Image URL (Secondary Hero)</label>
                            <input
                                type="text"
                                value={heroDraft.backgroundImage}
                                onChange={(e) => setHeroDraft({ ...heroDraft, backgroundImage: e.target.value })}
                                placeholder="https://..."
                            />
                            <p className={styles.fieldHelp}>Only used if "Secondary" variant is selected.</p>
                        </div>

                        <div className={styles.formGroup} style={{ flex: '1 1 300px' }}>
                            <label>Call to Action Text</label>
                            <input
                                type="text"
                                value={heroDraft.ctaText}
                                onChange={(e) => setHeroDraft({ ...heroDraft, ctaText: e.target.value })}
                                placeholder="Donate Now"
                            />
                        </div>

                        <div className={styles.formGroup} style={{ flex: '1 1 300px' }}>
                            <label>Call to Action Link</label>
                            <input
                                type="text"
                                value={heroDraft.ctaLink}
                                onChange={(e) => setHeroDraft({ ...heroDraft, ctaLink: e.target.value })}
                                placeholder="/donate"
                            />
                        </div>
                    </div>
                </form>
            </AdminCard>

            <div className={styles.infoNotice}>
                <Info size={18} />
                <p>
                    <strong>Note:</strong> Other sections like Social Links, Contact Info, and About Us content have been moved to their respective specialized management areas for better organization.
                </p>
            </div>
        </div>
    );
}

