'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Lock, ChevronDown, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './DonatePage.module.css';

type Frequency = 'once' | 'monthly';
type Amount = 10 | 30 | 50 | 100 | 'other';
type AuthMode = 'guest' | 'signin';

interface CampaignOption {
    id: string;
    title: string;
    type: 'appeal' | 'project';
    slug?: string;
}

interface FeaturedAppeal {
    id: string;
    title: string;
    description: string;
    image_url: string;
    raised: number;
    goal: number;
    slug: string;
}

function DonateContent() {
    const supabase = createClient();
    const searchParams = useSearchParams();

    // Form state
    const [frequency, setFrequency] = useState<Frequency>('once');
    const [authMode, setAuthMode] = useState<AuthMode>('guest');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>('zakat');
    const [amount, setAmount] = useState<Amount>(30);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [giftAid, setGiftAid] = useState(false);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Personal details state
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorAddress, setDonorAddress] = useState('');

    // Data state
    const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
    const [featuredAppeal, setFeaturedAppeal] = useState<FeaturedAppeal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Appeals and Subprojects for the dropdown
            const [appealsRes, subprojectsRes] = await Promise.all([
                supabase.from('appeals').select('id, title, slug').order('title'),
                supabase.from('subprojects').select('id, title, slug').order('title')
            ]);

            const options: CampaignOption[] = [
                { id: 'zakat', title: 'Zakat', type: 'project', slug: 'zakat' },
                { id: 'sadaqah', title: 'Sadaqah', type: 'project', slug: 'sadaqah' }
            ];

            if (appealsRes.data) {
                options.push(...appealsRes.data.map(a => ({ id: a.id, title: a.title, type: 'appeal' as const, slug: a.slug })));
            }
            if (subprojectsRes.data) {
                options.push(...subprojectsRes.data.map(s => ({ id: s.id, title: s.title, type: 'project' as const, slug: s.slug })));
            }
            setCampaigns(options);

            // 2. Fetch one urgent appeal for the bottom card
            const { data: urgentData } = await supabase
                .from('appeals')
                .select('*')
                .eq('is_urgent', true)
                .limit(1)
                .single();

            if (urgentData) {
                setFeaturedAppeal(urgentData);
            } else {
                const { data: latestData } = await supabase
                    .from('appeals')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                if (latestData) setFeaturedAppeal(latestData);
            }

            // 3. Handle URL parameters
            const urlAmount = searchParams.get('amount');
            const urlCampaign = searchParams.get('campaign');
            const urlMode = searchParams.get('mode');

            if (urlAmount) {
                const amt = parseInt(urlAmount);
                if ([10, 30, 50, 100].includes(amt)) {
                    setAmount(amt as Amount);
                } else {
                    setAmount('other');
                    setCustomAmount(urlAmount);
                }
            }

            if (urlCampaign) {
                // Try matching by ID first, then by slug
                const match = options.find(o => o.id === urlCampaign || o.slug === urlCampaign);
                if (match) {
                    setSelectedCampaignId(match.id);
                } else {
                    setSelectedCampaignId(urlCampaign);
                }
            }

            if (urlMode === 'monthly') {
                setFrequency('monthly');
            }

            if (searchParams.get('giftAid') === 'true') {
                setGiftAid(true);
            }

            setLoading(false);
        };

        fetchData();
    }, [searchParams]);

    const displayAmount = amount === 'other' ? (customAmount || '0') : amount;

    const handleAmountClick = (value: Amount) => {
        setAmount(value);
        if (value !== 'other') {
            setCustomAmount('');
        }
    };

    const handleDonate = async () => {
        setIsSubmitting(true);
        setErrorMsg('');

        const donationAmount = parseFloat(displayAmount.toString());
        if (isNaN(donationAmount) || donationAmount <= 0) {
            setErrorMsg('Please enter a valid donation amount.');
            setIsSubmitting(false);
            return;
        }

        if (!donorName || !donorEmail) {
            setErrorMsg('Please enter your name and email address.');
            setIsSubmitting(false);
            return;
        }

        if (giftAid && !donorAddress) {
            setErrorMsg('Address is mandatory when Gift Aid is selected.');
            setIsSubmitting(false);
            return;
        }

        const campaign = campaigns.find(c => c.id === selectedCampaignId);

        const { error } = await supabase.from('donations').insert({
            type: campaign?.type || 'project',
            target_id: selectedCampaignId === 'zakat' || selectedCampaignId === 'sadaqah' ? null : selectedCampaignId,
            donor_name: donorName,
            donor_email: donorEmail,
            donor_address: giftAid ? donorAddress : null,
            amount: donationAmount,
            gift_aid: giftAid,
            status: 'completed', // Mocking a successful payment
            frequency: frequency
        });

        if (error) {
            console.error('Donation error:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } else {
            setSubmitted(true);
            // In a real app, update the raised amount of the appeal/subproject here or via a DB trigger
        }
        setIsSubmitting(false);
    };

    const progress = featuredAppeal ? Math.min((featuredAppeal.raised / featuredAppeal.goal) * 100 || 0, 100) : 0;

    if (submitted) {
        return (
            <div className={styles.pageContainer} style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <div className={styles.formCard} style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ color: '#008080', marginBottom: '1.5rem' }}>
                        <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
                    </div>
                    <h1 className={styles.headline}>Thank you!</h1>
                    <p className={styles.description}>
                        Your donation of £{displayAmount} has been received.
                        Your contribution of {frequency === 'monthly' ? 'monthly support' : 'once'} will make a real difference in Bangladesh.
                    </p>
                    <button onClick={() => setSubmitted(false)} className={styles.submitBtn} style={{ marginTop: '2rem' }}>
                        Make another donation
                    </button>
                    <a href="/" className={styles.helperText} style={{ display: 'block', marginTop: '1rem', textDecoration: 'underline' }}>
                        Return to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.backgroundGlow}></div>

            <div className={styles.contentWrapper}>
                <div className={styles.formColumn}>
                    <div className={styles.formCard}>
                        {/* Frequency Toggle */}
                        <div className={styles.frequencyToggle}>
                            <button
                                className={`${styles.toggleBtn} ${frequency === 'once' ? styles.activeToggle : ''}`}
                                onClick={() => setFrequency('once')}
                            >
                                <span className={styles.dot}></span> Give Once
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${frequency === 'monthly' ? styles.activeToggle : ''}`}
                                onClick={() => setFrequency('monthly')}
                            >
                                <span className={styles.dot}></span> Give Monthly
                            </button>
                        </div>

                        {/* Checkout Option */}
                        <div className={styles.sectionGroup}>
                            <label className={styles.sectionLabel}>Checkout Option</label>
                            <button
                                className={`${styles.authOptionBtn} ${authMode === 'guest' ? styles.authActive : ''}`}
                                onClick={() => setAuthMode('guest')}
                            >
                                Guest Checkout
                            </button>
                            <p className={styles.helperText}>You can create an account after guest checkout.</p>

                            <div className={styles.divider}>
                                <span>OR SIGN IN</span>
                            </div>

                            <button
                                className={`${styles.authOptionBtn} ${authMode === 'signin' ? styles.authActive : ''}`}
                                onClick={() => setAuthMode('signin')}
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Appeal Selector */}
                        <div className={styles.sectionGroup}>
                            <label className={styles.sectionLabel}>I want to support</label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.appealSelect}
                                    value={selectedCampaignId}
                                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                                    disabled={loading || isSubmitting}
                                >
                                    {loading ? (
                                        <option>Loading campaigns...</option>
                                    ) : (
                                        campaigns.map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.title}</option>
                                        ))
                                    )}
                                </select>
                                <ChevronDown className={styles.selectIcon} size={20} />
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className={styles.sectionGroup}>
                            <label className={styles.sectionLabel}>Personal Details</label>
                            <div className={styles.inputStack}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className={styles.textInput}
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className={styles.textInput}
                                    value={donorEmail}
                                    onChange={(e) => setDonorEmail(e.target.value)}
                                    required
                                />
                                {giftAid && (
                                    <textarea
                                        placeholder="Full Address (Mandatory for Gift Aid)"
                                        className={styles.textArea}
                                        value={donorAddress}
                                        onChange={(e) => setDonorAddress(e.target.value)}
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        {/* Amount Selection */}
                        <div className={styles.sectionGroup}>
                            <label className={styles.sectionLabel}>
                                Amount ({frequency === 'once' ? 'One-time' : 'Monthly'})
                            </label>
                            <div className={styles.amountGrid}>
                                {[10, 30, 50, 100].map((val) => (
                                    <button
                                        key={val}
                                        className={`${styles.amountBtn} ${amount === val ? styles.amountActive : ''}`}
                                        onClick={() => handleAmountClick(val as Amount)}
                                        disabled={isSubmitting}
                                    >
                                        £{val}
                                    </button>
                                ))}
                            </div>
                            <div className={`${styles.customAmountWrapper} ${amount === 'other' ? styles.customAmountActive : ''}`}>
                                <span className={styles.currencySymbol}>£</span>
                                <input
                                    type="number"
                                    className={styles.customAmountInput}
                                    placeholder="Other Amount"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setAmount('other');
                                        setCustomAmount(e.target.value);
                                    }}
                                    onClick={() => setAmount('other')}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className={styles.giftAidSection}>
                            <label className={styles.giftAidLabel}>
                                <input
                                    type="checkbox"
                                    checked={giftAid}
                                    onChange={(e) => setGiftAid(e.target.checked)}
                                    className={styles.giftAidCheckbox}
                                />
                                <span>Add Gift Aid to my donation</span>
                            </label>
                            <p className={styles.giftAidExplainer}>
                                Gift Aid is a UK government scheme that allows charities to claim back the basic rate of tax on your donation, increasing its value at no extra cost to you.
                            </p>
                        </div>

                        {/* Submit Action */}
                        <div className={styles.submitSection}>
                            {errorMsg && <p style={{ color: '#800000', fontSize: '0.875rem', marginBottom: '1rem' }}>{errorMsg}</p>}
                            <button className={styles.submitBtn} onClick={handleDonate} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Donate £{displayAmount} <ArrowRight size={20} /></>}
                            </button>
                        </div>

                    </div>
                </div>

                <div className={styles.infoColumn}>
                    <h1 className={styles.headline}>
                        Donate today, <span className={styles.highlight}>So we don’t need to exist tomorrow</span>
                    </h1>
                    <p className={styles.description}>
                        Our projects have been established to work towards a world where Human Care doesn’t need to exist for the most vulnerable in Bangladesh to live with freedom, justice, and dignity.
                    </p>

                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>UK registered charity</span>
                        </div>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>100% Donation Policy</span>
                        </div>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appeals Section */}
            {featuredAppeal && (
                <div className={styles.appealsWrapper}>
                    <h2 className={styles.appealsHeading}>
                        <span className={styles.highlight}>Urgent Appeal</span>
                    </h2>

                    <div className={styles.appealCard}>
                        <div className={styles.appealContent}>
                            <h3 className={styles.appealTitle}>{featuredAppeal.title}</h3>
                            <p className={styles.appealDesc}>
                                {featuredAppeal.description.substring(0, 200)}...
                            </p>

                            <div className={styles.progressStats}>
                                <span className={styles.raisedAmount}>£{featuredAppeal.raised.toLocaleString()}</span>
                                <span className={styles.targetAmount}>of £{featuredAppeal.goal.toLocaleString()}</span>
                            </div>

                            <div className={styles.progressBarBg}>
                                <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                            </div>

                            <div className={styles.appealActions}>
                                <button
                                    className={styles.appealDonateBtn}
                                    onClick={() => {
                                        setSelectedCampaignId(featuredAppeal.id);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <Heart size={16} /> Donate Now
                                </button>
                                <a href={`/appeals/${featuredAppeal.slug}`} className={styles.appealDetailsBtn}>
                                    Details <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                        <div className={styles.appealImageContainer}>
                            <img
                                src={featuredAppeal.image_url || "https://images.unsplash.com/photo-1593113565630-9b48b96d9ab1?auto=format&fit=crop&w=800&q=80"}
                                alt={featuredAppeal.title}
                                className={styles.appealImage}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DonatePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
            <DonateContent />
        </Suspense>
    );
}
