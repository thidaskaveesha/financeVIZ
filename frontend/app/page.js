'use client';
import styles from "./page.module.css";
//import ThemeToggleButton from "./components/theme-toggle-btn";
import PageTopButton from "./components/page-top-btn";
import RootNavBar from "./components/root/RootNavBar";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import Footer from "./components/footer/Footer";

export default function Home() {
  return (
    <>
      <div className={styles.page}>
        <RootNavBar />
        
        {/* Hero section with video background and animated text */}
        <Hero />

        {/* Features section with scroll animations */}
        <Features />

        {/* Footer section */}
        <Footer />
        
        {/* Floating controls - theme toggle and scroll to top */}
        {/* <ThemeToggleButton /> */}
        <PageTopButton />
      </div>
    </>
  );
}
