import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './page-top-btn.module.css';

// Shows a scroll-to-top button after the user scrolls down.
const PageTopButton = () => {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <button 
            className={`${styles.pageTopBtn} ${visible ? styles.visible : ''}`} 
            onClick={scrollToTop}
            title="Scroll to top"
        >
            <FaArrowUp />
        </button>
    );
};

export default PageTopButton;