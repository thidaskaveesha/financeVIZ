import { useState, useEffect } from 'react';
import { FaLightbulb, FaMoon } from 'react-icons/fa';
import styles from './theme-toggle-btn.module.css';

// Floating theme switcher that persists preference in localStorage.
const ThemeToggleButton = () => {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemPreference;
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    if (!mounted) return null;

    return (
        <button className={styles.themeToggleBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaLightbulb />}
        </button>
    );
};

export default ThemeToggleButton;