'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

// Hero section with autoplay video and animated text overlay
const Hero = () => {
    const textRef = useRef(null);
    const buttonRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={styles.heroContainer}>
            {/* Black background that scrolls up */}
            <div className={styles.heroBlackBg}></div>

            {/* Video element - autoplays and repeats */}
            <video
                className={styles.heroVideo}
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay content - text and button */}
            <div className={styles.heroContent}>
                <div className={`${styles.textWrapper} ${isVisible ? styles.textVisible : ''}`}>
                    <h1 className={styles.heroTitle}>
                        Visualize Your Money, <br />
                        Decide Your Future.
                    </h1>
                    <button className={`${styles.learnMoreBtn} ${isVisible ? styles.btnVisible : ''}`}>
                        Learn More
                    </button>
                </div>
            </div>

            {/* Gradient overlay for text readability */}
            <div className={styles.gradientOverlay}></div>
        </section>
    );
};

export default Hero;
