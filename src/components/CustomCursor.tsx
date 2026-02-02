import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        if (!cursor || !dot) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, []);

    useEffect(() => {
        if (cursorRef.current) {
            gsap.to(cursorRef.current, {
                scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
                opacity: isHovering ? 0.5 : 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [isHovering, isClicking]);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed w-10 h-10 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block mix-blend-difference"
                style={{ left: 0, top: 0 }}
            >
                <div className={`w-full h-full rounded-full border-2 border-white transition-colors duration-300 ${isHovering ? 'bg-white/20' : ''}`}></div>
            </div>
            <div
                ref={cursorDotRef}
                className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
                style={{ left: 0, top: 0 }}
            ></div>
        </>
    );
}
