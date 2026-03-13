'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './AppealDetailPage.module.css';

const presetAmounts = [25, 50, 100, 250, 500, 1000];

export default function DonationPanel({ appealId }: { appealId: string }) {
  const [mode, setMode] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [giftAid, setGiftAid] = useState(false);

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

          <div className={styles.checkboxWrap}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={giftAid}
                onChange={(e) => setGiftAid(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Add Gift Aid to my donation</span>
            </label>
            <p className={styles.giftAidExplainer}>
              Gift Aid is a UK government scheme that allows charities to claim back the basic rate of tax on your donation, increasing its value at no extra cost to you.
            </p>
          </div>

          <Link href={`/donate?campaign=${appealId}&amount=${amount}&mode=${mode}&giftAid=${giftAid}`} className={styles.donateBtn}>
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
