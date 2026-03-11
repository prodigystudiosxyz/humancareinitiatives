'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import styles from '../login/Auth.module.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authCard}>
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className={styles.authTitle}>Check your email</h2>
                        <p className={styles.authSubtitle}>
                            We've sent a confirmation link to <strong>{email}</strong>.
                            Please check your inbox to activate your account.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link href="/login" className={styles.submitBtn}>
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Join Human Care</h1>
                    <p className={styles.authSubtitle}>
                        Start your journey with us and track your contributions to those in need.
                    </p>
                </div>

                <form className={styles.authForm} onSubmit={handleSignup}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Full Name</label>
                        <input
                            type="text"
                            required
                            className={styles.inputField}
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Email Address</label>
                        <input
                            type="email"
                            required
                            className={styles.inputField}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Password</label>
                        <input
                            type="password"
                            required
                            className={styles.inputField}
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account?
                    <Link href="/login" className={styles.footerLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
