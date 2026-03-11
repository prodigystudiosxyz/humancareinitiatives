'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import styles from './ContactPage.module.css';

export default function ContactUsPage() {
  const supabase = createClient();

  // Contact Form State
  const [conLoading, setConLoading] = useState(false);
  const [conSuccess, setConSuccess] = useState(false);
  const [conError, setConError] = useState('');

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConLoading(true);
    setConError('');
    setConSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('contactName'),
      email: formData.get('contactEmail'),
      subject: formData.get('contactSubject'),
      message: formData.get('contactMessage'),
    };

    const { error } = await supabase.from('contact_messages').insert([data]);

    if (error) {
      setConError(error.message);
    } else {
      setConSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    setConLoading(false);
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Contact Us</h1>
        <p>Send us a message and we&apos;ll get back to you as soon as possible.</p>
      </div>

      <div className={styles.container}>
        <article className={styles.formCard}>
          <h2>Send a Message</h2>

          {conSuccess && (
            <div className={styles.successMsg}>
              <CheckCircle2 size={20} />
              <span>Message sent successfully!</span>
            </div>
          )}

          {conError && (
            <div className={styles.errorMsg}>
              <AlertCircle size={20} />
              <span>{conError}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleContactSubmit}>
            <label>
              Name
              <input type="text" name="contactName" placeholder="Your name" required />
            </label>

            <label>
              Email
              <input type="email" name="contactEmail" placeholder="you@example.com" required />
            </label>

            <label>
              Subject
              <input type="text" name="contactSubject" placeholder="How can we help?" required />
            </label>

            <label>
              Message
              <textarea name="contactMessage" placeholder="Write your message" rows={6} required></textarea>
            </label>

            <button type="submit" className={styles.primaryBtn} disabled={conLoading}>
              {conLoading ? <Loader2 className={styles.spin} size={20} /> : 'Send Message'}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
