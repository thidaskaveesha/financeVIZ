import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
    return(
        <footer className={styles.footerContainer}>
            <div className={styles.textGroup}>
                <div className={styles.leftText}>
                     &copy; FinanceVIZ 2026. All rights reserved.
                </div>
                <div className={styles.rightText}>
                    <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
                </div>
            </div>
            <div className={styles.BigText}>
                <h1>Finance VIZ</h1>
                <Image
                    className={styles.logo}
                    src="/FVimge-removebg.png"
                    alt="FinanceVIZ"
                    width={100}
                    height={90}
                    priority
                />
            </div>
            <Image
                    className={styles.footerImage}
                    src="/footer/footer-image.png"
                    alt="FinanceVIZ"
                    width={100}
                    height={90}
                    priority
            />
        </footer>
    );
};
export default Footer;