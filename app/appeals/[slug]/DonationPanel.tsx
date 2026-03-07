'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './AppealDetailPage.module.css';

const presetAmounts = [25, 50, 100, 250, 500, 1000];

export default function DonationPanel({ appealId }: { appealId: string }) {
  const [mode, setMode] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');

  const amount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  return (
    <div className={styles.stickyWrap}>
      <div className={styles.donateCard}>
        <div className={styles.donateCardHeader}>
          <div className={styles.secureLabel}>Secure donation</div>
          <div className={styles.modeToggle}>
            <button
              type="button"
              onClick={() => setMode('one-time')}
              className={`${styles.modeBtn} ${mode === 'one-time' ? styles.modeBtnActive : ''}`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setMode('monthly')}
              className={`${styles.modeBtn} ${mode === 'monthly' ? styles.modeBtnActive : ''}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className={styles.donateCardBody}>
          <div className={styles.amountGrid}>
            {presetAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSelectedAmount(value);
                  setCustomAmount('');
                }}
                className={`${styles.amountBtn} ${selectedAmount === value && !customAmount ? styles.amountBtnActive : ''}`}
              >
                £{value >= 1000 ? `${value / 1000}K` : value}
              </button>
            ))}
          </div>

          <div className={styles.customAmountWrap}>
            <span className={styles.currency}>£</span>
            <input
              type="number"
              placeholder="Other amount"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              className={styles.customAmountInput}
            />
          </div>

          <Link href={`/donate?campaign=${appealId}&amount=${amount}&mode=${mode}`} className={styles.donateBtn}>
            Donate
          </Link>
          <p className={styles.secureNote}>Is my donation secure? · Tax deductible</p>
        </div>
      </div>
    </div>
  );
}
