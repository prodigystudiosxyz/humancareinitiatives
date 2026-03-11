'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import styles from './GetInvolvedPage.module.css';

export default function GetInvolvedPage() {
  const supabase = createClient();

  // Volunteer Form State
  const [volLoading, setVolLoading] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);
  const [volError, setVolError] = useState('');

  const handleVolunteerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVolLoading(true);
    setVolError('');
    setVolSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get('volunteerName'),
      email: formData.get('volunteerEmail'),
      phone: formData.get('volunteerPhone'),
      interest: formData.get('volunteerInterest'),
      availability: formData.get('volunteerAvailability'),
    };

    const { error } = await supabase.from('volunteer_applications').insert([data]);

    if (error) {
      setVolError(error.message);
    } else {
      setVolSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    setVolLoading(false);
  };

  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Become a Volunteer</h1>
        <p>Join our network of hundreds of volunteers across Bangladesh.</p>
      </div>

      <div className={styles.container}>
        <article className={styles.formCard}>
          <h2>Volunteer Signup</h2>

          {volSuccess && (
            <div className={styles.successMsg}>
              <CheckCircle2 size={20} />
              <span>Application submitted successfully!</span>
            </div>
          )}

          {volError && (
            <div className={styles.errorMsg}>
              <AlertCircle size={20} />
              <span>{volError}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleVolunteerSubmit}>
            <label>
              Full Name
              <input type="text" name="volunteerName" placeholder="Your full name" required />
            </label>

            <label>
              Email
              <input type="email" name="volunteerEmail" placeholder="you@example.com" required />
            </label>

            <label>
              Phone
              <input type="tel" name="volunteerPhone" placeholder="+880..." required />
            </label>

            <label>
              Area of Interest
              <select name="volunteerInterest" defaultValue="" required>
                <option value="" disabled>
                  Select an area
                </option>
                <option value="emergency">Emergency Relief</option>
                <option value="education">Education</option>
                <option value="water">Water &amp; Sanitation</option>
                <option value="livelihood">Livelihood</option>
              </select>
            </label>

            <label>
              Availability
              <input type="text" name="volunteerAvailability" placeholder="Weekends / Evenings" required />
            </label>

            <button type="submit" className={styles.primaryBtn} disabled={volLoading}>
              {volLoading ? <Loader2 className={styles.spin} size={20} /> : 'Submit Application'}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
