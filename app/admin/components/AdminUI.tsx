'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../AdminDashboard.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                style={maxWidth ? { maxWidth } : undefined}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AdminCard({ title, children, fullWidth, footer }: { title: string; children: React.ReactNode; fullWidth?: boolean; footer?: React.ReactNode }) {
    return (
        <article className={fullWidth ? styles.panelCardFull : styles.panelCard}>
            <div className={styles.titleRow}>
                <h3>{title}</h3>
            </div>
            {children}
            {footer && <div className={styles.buttonRow} style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>{footer}</div>}
        </article>
    );
}

export function AdminButton({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled,
    loading,
    className = '',
    title,
    form
}: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger' | 'link';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    title?: string;
    form?: string;
}) {
    const variantClass = {
        primary: styles.primaryBtn,
        secondary: styles.secondaryBtn,
        danger: styles.dangerBtn,
        link: styles.linkBtn
    }[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${variantClass} ${className}`}
            title={title}
            form={form}
        >
            {loading ? 'Processing...' : children}
        </button>
    );
}
