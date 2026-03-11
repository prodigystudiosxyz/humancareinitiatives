'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Mail, LogOut, Send } from 'lucide-react';
import Link from 'next/link';
import styles from '../login/Auth.module.css';

export default function VerifyEmailPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResend = async () => {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            setError("No user found. Please try logging in again.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setResent(true);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.successState}>
                    <div className={styles.successIcon} style={{ background: '#f0fdf4', color: '#22c55e' }}>
                        <Mail size={32} />
                    </div>
                    <h1 className={styles.authTitle}>Verify your email</h1>
                    <p className={styles.authSubtitle}>
                        Thanks for joining us! Please confirm your email address to access your account and start tracking your impact.
                    </p>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {resent ? (
                            <div className={styles.errorBox} style={{ background: '#f0fdf4', color: '#166534', borderColor: '#22c55e' }}>
                                Verification email resent successfully!
                            </div>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className={styles.submitBtn}
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                    <>
                                        <Send size={18} style={{ marginRight: '0.5rem' }} />
                                        Resend Verification Email
                                    </>
                                )}
                            </button>
                        )}

                        {error && <div className={styles.errorBox}>{error}</div>}

                        <button
                            onClick={handleLogout}
                            className={styles.googleBtn}
                            style={{ marginTop: '0.5rem' }}
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </div>

                <p className={styles.footerText}>
                    Need help? <Link href="/contact-us" className={styles.footerLink}>Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
