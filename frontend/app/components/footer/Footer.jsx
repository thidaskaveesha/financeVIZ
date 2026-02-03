"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import { gsap } from "gsap";

const Footer = () => {
    const footerRef = useRef(null);
    const bubblesRef = useRef([]);
    const [bubbles, setBubbles] = useState([]);
    const bubblePositions = useRef([]);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const footerElement = footerRef.current;
        if (!footerElement) return;

        const rect = footerElement.getBoundingClientRect();
        const containerWidth = rect.width || 800;
        const containerHeight = rect.height || 400;

        // Create initial bubbles
        const initialBubbles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * containerWidth,
            y: Math.random() * containerHeight,
            size: Math.random() * 40 + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        }));
        setBubbles(initialBubbles);
        bubblePositions.current = initialBubbles.map(b => ({ x: b.x, y: b.y }));

        // Continuous animation loop
        const animate = () => {
            bubblesRef.current.forEach((bubble, index) => {
                if (!bubble || !bubblePositions.current[index]) return;
                
                const pos = bubblePositions.current[index];
                const bubbleData = initialBubbles[index];
                
                // Random movement
                pos.x += bubbleData.vx;
                pos.y += bubbleData.vy;

                // Boundary check with bounce
                const maxX = containerWidth;
                const maxY = containerHeight;
                
                if (pos.x < 0 || pos.x > maxX) {
                    bubbleData.vx *= -1;
                    pos.x = Math.max(0, Math.min(maxX, pos.x));
                }
                if (pos.y < 0 || pos.y > maxY) {
                    bubbleData.vy *= -1;
                    pos.y = Math.max(0, Math.min(maxY, pos.y));
                }

                // Update bubble position
                gsap.set(bubble, {
                    left: pos.x,
                    top: pos.y
                });
            });

            // Update state to re-render SVG mask
            setBubbles(prev => prev.map((b, i) => ({
                ...b,
                x: bubblePositions.current[i].x,
                y: bubblePositions.current[i].y
            })));

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return(
        <footer className={styles.footerContainer} ref={footerRef}>
            <div className={styles.textGroup}>
                <div className={styles.leftText}>
                     &copy; FinanceVIZ 2026. All rights reserved.
                </div>
                <div className={styles.rightText}>
                    <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
                </div>
            </div>
            <div className={styles.BigText}>
                <div className={styles.logoContainer}>
                    <Image
                        className={styles.logo}
                        src="/FVimge-removebg.png"
                        alt="FinanceVIZ"
                        width={100}
                        height={90}
                        priority
                    />
                </div>
                <div className={styles.horizontalLine}></div>
                <div className={styles.textWrapper}>
                    <h1 className={styles.textWhite}>Finance VIZ</h1>
                    <h1 className={styles.textBlack}>Finance VIZ</h1>
                </div>
            </div>
            <svg className={styles.bubbleMask}>
                <defs>
                    <mask id="bubbleMask">
                        <rect x="0" y="0" width="100%" height="100%" fill="black" />
                        {bubbles.map((bubble) => (
                            <circle
                                key={`mask-${bubble.id}`}
                                cx={bubble.x}
                                cy={bubble.y}
                                r={bubble.size}
                                fill="white"
                            />
                        ))}
                    </mask>
                </defs>
            </svg>
            <div className={styles.bubblesContainer}>
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        ref={(el) => (bubblesRef.current[bubble.id] = el)}
                        className={styles.visibleBubble}
                        style={{
                            left: bubble.x,
                            top: bubble.y,
                            width: bubble.size * 2,
                            height: bubble.size * 2
                        }}
                    />
                ))}
            </div>
        </footer>
    );
};
export default Footer;