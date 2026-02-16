import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of katakana, latin, and numbers
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*(){}[]|;:<>?/\\~`+-=_';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops = Array(columns).fill(1);

    // Random speeds for each column
    const speeds = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.5);

    // Draw function
    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Vary the brightness - brighter at the head
        const brightness = Math.random();
        if (brightness > 0.98) {
          ctx.fillStyle = '#ffffff'; // White flash
        } else if (brightness > 0.9) {
          ctx.fillStyle = '#00ff41'; // Bright green
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.3 + brightness * 0.4})`; // Varying green
        }

        ctx.fillText(char, x, y);

        // Reset drop when it goes off screen or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i] += speeds[i];
      }
    };

    // Animation loop
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="matrix-bg">
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="matrix-glow" />
    </div>
  );
};

export default MatrixBackground;
