import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false for performance
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if(e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    
    const handlePointerOut = () => {
       mouse.active = false;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseout', handlePointerOut);
    window.addEventListener('touchend', handlePointerOut);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 0.5;
        // Calm cyan and violet hues
        const hue = Math.random() > 0.5 ? 190 + Math.random()*30 : 260 + Math.random()*40;
        this.color = `hsla(${hue}, 80%, 65%, 0.9)`;
      }

      update() {
        // Subtle attraction to mouse
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 350) {
            const force = (350 - dist) / 350;
            this.vx += (dx / dist) * force * 0.4;
            this.vy += (dy / dist) * force * 0.4;
          }
        }

        // Friction
        this.vx *= 0.96;
        this.vy *= 0.96;

        // Keep moving slightly (brownian motion)
        this.vx += (Math.random() - 0.5) * 0.2;
        this.vy += (Math.random() - 0.5) * 0.2;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 4000), 400); // Scale by screensize
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const render = () => {
      // Trail effect: instead of clearing canvas, draw semi-transparent black
      // We use #020617 (slate-950 equivalent)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; 
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseout', handlePointerOut);
      window.removeEventListener('touchend', handlePointerOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block touch-none"
    />
  );
}
