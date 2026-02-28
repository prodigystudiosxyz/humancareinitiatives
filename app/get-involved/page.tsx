import styles from './GetInvolvedPage.module.css';

export default function GetInvolvedPage() {
  return (
    <section className={styles.page}>
      <div className={styles.headerBlock}>
        <h1>Get Involved</h1>
        <p>Volunteer with us or send a message.</p>
      </div>

      <div className={styles.grid}>
        <article className={styles.formCard}>
          <h2>Volunteer Signup</h2>

          <form className={styles.form}>
            <label>
              Full Name
              <input type="text" name="volunteerName" placeholder="Your full name" />
            </label>

            <label>
              Email
              <input type="email" name="volunteerEmail" placeholder="you@example.com" />
            </label>

            <label>
              Phone
              <input type="tel" name="volunteerPhone" placeholder="+880..." />
            </label>

            <label>
              Area of Interest
              <select name="volunteerInterest" defaultValue="">
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
              <input type="text" name="volunteerAvailability" placeholder="Weekends / Evenings" />
            </label>

            <button type="submit" className={styles.primaryBtn}>
              Submit
            </button>
          </form>
        </article>

        <article className={styles.formCard}>
          <h2>Contact Form</h2>

          <form className={styles.form}>
            <label>
              Name
              <input type="text" name="contactName" placeholder="Your name" />
            </label>

            <label>
              Email
              <input type="email" name="contactEmail" placeholder="you@example.com" />
            </label>

            <label>
              Subject
              <input type="text" name="contactSubject" placeholder="How can we help?" />
            </label>

            <label>
              Message
              <textarea name="contactMessage" placeholder="Write your message" rows={5}></textarea>
            </label>

            <button type="submit" className={styles.primaryBtn}>
              Send Message
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
