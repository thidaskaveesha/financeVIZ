import Link from "next/link";
import styles from "./login.module.css";
import { login } from "./actions";

export const metadata = {
  title: "Login | FinanceVIZ",
  description: "Secure login portal for FinanceVIZ.",
};

export default async function LoginPage({ searchParams }) {
  const error = (await searchParams)?.error;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <section className={styles.card} aria-label="Login form">
        <p className={styles.kicker}>FinanceVIZ</p>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to view your dashboard and latest insights.</p>

        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form className={styles.form} action={login}>
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

          <div className={styles.rowBetween}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <Link href="#" className={styles.inlineLink}>
              Forgot password?
            </Link>
          </div>
          <input
            className={styles.input}
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />

          <button className={styles.primaryBtn} type="submit">
            Login
          </button>
        </form>

        <p className={styles.footnote}>
          New to FinanceVIZ? <Link href="/sign-up">Create account</Link>
        </p>
      </section>
    </main>
  );
}
