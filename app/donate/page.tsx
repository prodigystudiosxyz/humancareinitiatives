'use client';
import React, { useState } from 'react';
import { CheckCircle2, Lock, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import styles from './DonatePage.module.css';

type Frequency = 'once' | 'monthly';
type Amount = 10 | 30 | 50 | 100 | 'other';
type AuthMode = 'guest' | 'signin';

export default function DonatePage() {
    const [frequency, setFrequency] = useState<Frequency>('once');
    const [authMode, setAuthMode] = useState<AuthMode>('guest');
    const [appeal, setAppeal] = useState<string>('Select an appeal');
    const [amount, setAmount] = useState<Amount>(30);
    const [customAmount, setCustomAmount] = useState<string>('');

    const displayAmount = amount === 'other' ? (customAmount || '0') : amount;

    const handleAmountClick = (value: Amount) => {
        setAmount(value);
        if (value !== 'other') {
            setCustomAmount('');
        }
    };

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
                                    value={appeal}
                                    onChange={(e) => setAppeal(e.target.value)}
                                >
                                    <option value="Select an appeal" disabled>Select an appeal</option>
                                    <option value="General Donation">Where Most Needed (General) </option>
                                    <option value="Zakat">Zakat</option>
                                    <option value="Sadaqah">Sadaqah</option>
                                    <option value="Ramadan 2026">Ramadan 2026</option>
                                    <option value="Water & Sanitation">Water & Sanitation</option>
                                    <option value="Emergency Relief">Emergency Relief</option>
                                </select>
                                <ChevronDown className={styles.selectIcon} size={20} />
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
                                />
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className={styles.submitSection}>
                            <button className={styles.submitBtn}>
                                Donate £{displayAmount} <ArrowRight size={20} />
                            </button>
                            <div className={styles.secureText}>
                                <Lock size={12} /> Secure 256-bit encrypted payment
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.infoColumn}>
                    <h1 className={styles.headline}>
                        Small Acts, <span className={styles.highlight}>Consistent Impact.</span>
                    </h1>
                    <p className={styles.description}>
                        The most beloved deeds to Allah are those that are consistent, even if they are small. Set up a daily or monthly donation and ensure your legacy of giving never stops.
                    </p>

                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>100% Donation Policy</span>
                        </div>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>Cancel Anytime</span>
                        </div>
                        <div className={styles.benefitCard}>
                            <CheckCircle2 className={styles.checkIcon} size={20} />
                            <span>Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appeals Section */}
            <div className={styles.appealsWrapper}>
                <h2 className={styles.appealsHeading}>
                    <span className={styles.highlight}>Appeals</span>
                </h2>

                <div className={styles.appealCard}>
                    <div className={styles.appealContent}>
                        <h3 className={styles.appealTitle}>Ramadan 2026</h3>
                        <p className={styles.appealDesc}>
                            Human Care is focused on supporting the development of vulnerable communities.
                            Sadly, the true victims have been the people, who need your help this Ramadan.
                            Your contribution will provide food packs and essentials.
                        </p>

                        <div className={styles.progressStats}>
                            <span className={styles.raisedAmount}>£3,517</span>
                            <span className={styles.targetAmount}>of £50,000</span>
                        </div>

                        <div className={styles.progressBarBg}>
                            <div className={styles.progressBarFill} style={{ width: '7%' }}></div>
                        </div>

                        <div className={styles.appealActions}>
                            <button className={styles.appealDonateBtn}>
                                <Heart size={16} /> Donate
                            </button>
                            <button className={styles.appealDetailsBtn}>
                                Details <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.appealImageContainer}>
                        {/* Image representation */}
                        <img
                            src="https://images.unsplash.com/photo-1593113565630-9b48b96d9ab1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Ramadan Aid"
                            className={styles.appealImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
