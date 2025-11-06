import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
}

const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameId = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        const PARTICLE_COUNT = 75;
        const COLORS = ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"];

        const createParticle = (): Particle => {
            return {
                x: Math.random() * canvas.width / dpr,
                y: -20 - Math.random() * 20,
                vx: (Math.random() - 0.5) * 2, // horizontal drift
                vy: 1 + Math.random() * 2,    // downward speed
                width: 5 + Math.random() * 5,
                height: 10 + Math.random() * 10,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
            };
        };

        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(p => {
                // Update physics
                p.vy += 0.05; // Gravity
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Draw particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                ctx.restore();

                // Recycle particle if it's off-screen
                if (p.y > canvas.height / dpr + 20) {
                    Object.assign(p, createParticle(), { y: -20 });
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Confetti;
