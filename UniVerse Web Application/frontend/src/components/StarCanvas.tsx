import React, { useRef, useEffect, ReactNode } from "react";

interface StarCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const StarCanvas: React.FC<StarCanvasProps> = ({
  className,
  style,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    interface Star {
      x: number;
      y: number;
      opacity: number;
      fadeSpeed: number;
    }

    const stars: Star[] = [];
    const maxStars = 100;

    function createStar(): Star {
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        opacity: 0,
        fadeSpeed: Math.random() * 0.02 + 0.01,
      };
    }

    for (let i = 0; i < maxStars; i++) {
      stars.push(createStar());
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();

        star.opacity += star.fadeSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.fadeSpeed *= -1;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{ position: "relative", zIndex: 1 }}
        className={"w-screen h-screen flex justify-center items-center"}
      >
        {children}
      </div>
    </div>
  );
};

export default StarCanvas;
