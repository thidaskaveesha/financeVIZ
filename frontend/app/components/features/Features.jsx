'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './features.module.css';

// Features section with scroll animations
const Features = () => {
    const [visibleFeatures, setVisibleFeatures] = useState({});
    const featureRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = featureRefs.current.indexOf(entry.target);
                    setVisibleFeatures((prev) => ({
                        ...prev,
                        [index]: true,
                    }));
                }
            });
        }, observerOptions);

        featureRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            title: 'Real-time Analytics',
            description: 'Track your financial decisions with instant, actionable insights and comprehensive data visualization.',
        },
        {
            title: 'Smart Insights',
            description: 'AI-powered recommendations that help you make informed financial decisions faster and smarter.',
        },
        {
            title: 'Secure & Reliable',
            description: 'Bank-level security with encrypted data protection and 99.9% uptime guarantee.',
        },
    ];

    return (
        <section className={styles.featuresContainer}>
            <div className={styles.featuresWrapper}>
                <h2 className={styles.sectionTitle}>Our Features</h2>
                <p className={styles.sectionSubtitle}>
                    Everything you need to make smarter financial decisions
                </p>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                featureRefs.current[index] = el;
                            }}
                            className={`${styles.featureCard} ${
                                visibleFeatures[index] ? styles.featureVisible : ''
                            }`}
                        >
                            <div className={styles.featureIcon}>{index + 1}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
