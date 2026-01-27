import React, { useRef, useEffect } from 'react';

export function FireParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let fires: { x: number, y: number, intensity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      // We want to cover the full height of the hero section
      canvas.height = window.innerHeight;

      // Define multiple fire emitter locations across the bottom
      fires = [
        { x: canvas.width * 0.15, y: canvas.height + 20, intensity: 1.2 },
        { x: canvas.width * 0.35, y: canvas.height + 10, intensity: 0.8 },
        { x: canvas.width * 0.65, y: canvas.height + 30, intensity: 1.5 },
        { x: canvas.width * 0.85, y: canvas.height + 15, intensity: 1.0 },
      ];
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      color: string;
      fireIndex: number;

      constructor(fireIndex: number, startRandomY = false) {
        const fire = fires[fireIndex];
        this.fireIndex = fireIndex;
        // Spawn around the fire's x location, wider to cover more real estate
        this.x = fire.x + (Math.random() - 0.5) * 150;

        // Randomize Y aggressively to fill the screen initially
        this.y = startRandomY
          ? fire.y - Math.random() * canvas!.height * 1.0
          : fire.y + (Math.random() - 0.5) * 25;

        this.size = Math.random() * 3.5 + 1.5;
        this.speedX = (Math.random() - 0.5) * 2.5; // Drift
        this.speedY = -(Math.random() * 4 + 2) * fire.intensity; // Travel faster upwards
        this.maxLife = Math.random() * 600 + 100; // Live longer to reach the top
        this.life = this.maxLife;

        const colors = [
          'rgba(255, 69, 0, 1)',   // Red-Orange
          'rgba(255, 140, 0, 1)',  // Dark Orange
          'rgba(255, 30, 0, 1)',   // Deep Red
          'rgba(255, 215, 0, 1)'   // Gold
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.x += Math.sin(this.life * 0.05) * 0.5; // Natural flutter
        this.life--;
        this.size *= 0.985;
      }

      draw() {
        if (!ctx) return;
        // Smooth fade in and out for a more realistic ember feel
        const lifeRatio = this.life / this.maxLife;
        const opacity = Math.sin(lifeRatio * Math.PI);

        ctx.save();
        ctx.globalAlpha = Math.min(1, opacity * 0.9); // Moderate global opacity
        ctx.shadowBlur = this.size * 3; // Dynamic glow

        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // For realism, draw a slight streak based on vertical speed
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.speedY, this.speedX));
        ctx.beginPath();
        const stretch = Math.max(1, Math.abs(this.speedY) * 0.4);
        ctx.ellipse(0, 0, this.size * stretch, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 200; i++) {
        const fireIndex = Math.floor(Math.random() * fires.length);
        particles.push(new Particle(fireIndex, true));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0 || particles[i].size <= 0.2) {
          const fireIndex = Math.floor(Math.random() * fires.length);
          particles[i] = new Particle(fireIndex, false);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
