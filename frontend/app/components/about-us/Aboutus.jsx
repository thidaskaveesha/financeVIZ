'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './aboutus.module.css';

// About Us section with advanced scroll animations
const Aboutus = () => {
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const observerRef = useRef(null);

    // Memoize sections array so it doesn't change on every render
    const sections = useMemo(() => [
        {
            title: 'Our Story',
            icon: '/about-us/our-story.png',
            content: 'FinanceViz is developed by Mozo Technology, a technology company with experience across a wide range of industries, including higher education. One of our notable achievements is a student navigation system developed for the Open University of Sri Lanka (OUSL), Nawala branch, which became a winning product at a competition. This success reflects our focus on building practical, impact-driven solutions.',
        },
        {
            title: 'Our Vision',
            icon: '/about-us/our-vision.png',
            content: 'FinanceViz was created with a clear vision: to help individuals and businesses better understand their spending, plan for the future, and make smarter financial decisions through powerful data visualization.',
        },
        {
            title: 'Built for Developers',
            icon: '/about-us/built-for-developers.png',
            content: 'The platform is designed with developers in mind. FinanceViz handles all visualization, insights, and alerting, allowing users and developers to focus solely on data extraction and collection. With easy integration support, developers can plug in their data sources effortlessly while FinanceViz takes care of the rest.',
        },
        {
            title: 'The Future',
            icon: '/about-us/our-future.png',
            content: 'We are also working on an upcoming AI-assisted data extraction product, which will further simplify financial data collection and analysis.',
        },
    ], []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px 50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = sectionRefs.current.indexOf(entry.target);
                    if (index !== -1) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [index]: true,
                        }));
                    }
                }
            });
        }, observerOptions);

        observerRef.current = observer;

        // Observe all card refs
        sectionRefs.current.forEach((ref, index) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        // Handle resize events with debouncing
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Trigger new observation pass
                sectionRefs.current.forEach((ref, index) => {
                    if (ref && observer) {
                        // Force re-check of visibility
                        const rect = ref.getBoundingClientRect();
                        const isVisible = (
                            rect.top < window.innerHeight && 
                            rect.bottom > 0
                        );
                        
                        if (isVisible) {
                            setVisibleSections((prev) => ({
                                ...prev,
                                [index]: true,
                            }));
                        }
                    }
                });
            }, 150);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <section className={styles.aboutContainer}>
            <div className={styles.aboutWrapper}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroGlow}></div>
                    <h2 className={styles.mainTitle}>About FinanceViz</h2>
                    <p className={styles.tagline}>
                        Great products start with small steps
                    </p>
                    <div className={styles.divider}></div>
                </div>

                {/* Story Cards */}
                <div className={styles.storyGrid}>
                    {sections.map((section, index) => (
                        <div
                            key={`${section.title}-${index}`}
                            ref={(el) => {
                                if (el) {
                                    sectionRefs.current[index] = el;
                                }
                            }}
                            className={`${styles.storyCard} ${
                                visibleSections[index] ? styles.cardVisible : ''
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={styles.cardGlow}></div>
                            <div className={styles.cardIcon}>
                                <img className={styles.iconEmoji} alt={section.title} src={section.icon} />
                            </div>
                            <h3 className={styles.cardTitle}>{section.title}</h3>
                            <p className={styles.cardContent}>{section.content}</p>
                            <div className={`${styles.cardBorder} ${hoveredCard === index ? styles.borderActive : ''}`}></div>
                        </div>
                    ))}
                </div>

                {/* Mission Statement */}
                <div 
                    ref={(el) => {
                        if (el) {
                            sectionRefs.current[sections.length] = el;
                        }
                    }}
                    className={`${styles.missionSection} ${
                        visibleSections[sections.length] ? styles.missionVisible : ''
                    }`}
                >
                    <div className={styles.missionCard}>
                        <div className={styles.missionGlow}></div>
                        <h3 className={styles.missionTitle}>Our Commitment</h3>
                        <p className={styles.missionText}>
                            At Mozo Technology, we believe great products start with small steps and FinanceViz is built to deliver exactly that.
                        </p>
                        <div className={styles.pulseCircle}></div>
                    </div>
                </div>

                {/* Floating Background Elements */}
                <div className={styles.floatingElements}>
                    <div className={styles.float1}></div>
                    <div className={styles.float2}></div>
                    <div className={styles.float3}></div>
                </div>
            </div>
        </section>
    );
};

export default Aboutus;
