import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./navBar.module.css";

const RootNavBar = () => {
    return (
        <nav className={styles.container}>
            <Link href="/" className={styles.brand} aria-label="Home">
                <Image
                    className={styles.logo}
                    src="/FVimge-removebg.png"
                    alt="FinanceVIZ"
                    width={96}
                    height={20}
                    priority
                />
            </Link>
            <div className={styles.actions}>
                <Link href="/login" className={styles.loginBtn}>Login</Link>
                <Link href="/sign-up" className={styles.signUpBtn}>Sign Up</Link>
            </div>
        </nav>
    );
};

export default RootNavBar;