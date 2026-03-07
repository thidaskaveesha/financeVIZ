import Link from "next/link";
import styles from "./signup.module.css";
import { signup } from "@/app/login/actions";

export const metadata = {
  title: "Sign Up | FinanceVIZ",
  description: "Create your FinanceVIZ account.",
};

export default async function SignupPage({ searchParams }) {
  const error = (await searchParams)?.error;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <section className={styles.card} aria-label="Sign up form">
        <p className={styles.kicker}>Start free</p>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Build smarter money habits with visual insights.</p>

        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form className={styles.form} action={signup}>
          <label className={styles.label} htmlFor="fullName">
            Full name
          </label>
          <input
            className={styles.input}
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
          />

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button className={styles.primaryBtn} type="submit">
            Create Account
          </button>
        </form>

        <p className={styles.footnote}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
