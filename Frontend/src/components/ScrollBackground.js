import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollBackground = ({ totalFrames = 180 }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useRef(window.innerWidth < 768);

  // ==========================================
  // LOAD FRAMES (FEWER ON MOBILE FOR PERFORMANCE)
  // ==========================================
  useEffect(() => {
    let cancelled = false;
    // On mobile, load every 3rd frame to reduce memory by ~66%
    const step = isMobile.current ? 3 : 1;

    const loadImages = async () => {
      const promises = [];

      for (let i = 1; i <= totalFrames; i += step) {
        promises.push(
          new Promise((resolve) => {
            const img = new Image();
            const src = `/frames/ezgif-frame-${String(i).padStart(3, "0")}.png`;

            img.onload = () => resolve(img);
            img.onerror = () => {
              console.warn(`Failed to load: ${src}`);
              resolve(null);
            };
            img.src = src;
          })
        );
      }

      const results = await Promise.all(promises);
      if (cancelled) return;

      const validImages = results.filter((img) => img && img.naturalWidth > 0);
      setImages(validImages);
      setLoaded(true);
    };

    loadImages();

    return () => { cancelled = true; };
  }, [totalFrames]);

  // ==========================================
  // CANVAS RENDERING + CONTINUOUS GSAP SCROLL
  // ==========================================
  useEffect(() => {
    if (!loaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize performance

    const renderFrame = (index) => {
      const image = images[index];
      if (!image || image.naturalWidth === 0) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const screenRatio = screenWidth / screenHeight;

      let drawWidth, drawHeight;

      if (imageRatio > screenRatio) {
        drawHeight = screenHeight;
        drawWidth = screenHeight * imageRatio;
      } else {
        drawWidth = screenWidth;
        drawHeight = screenWidth / imageRatio;
      }

      const x = (screenWidth - drawWidth) / 2;
      const y = (screenHeight - drawHeight) / 2;

      ctx.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      // Cap DPR to 1 on mobile to reduce GPU work (~75% fewer pixels)
      const dpr = isMobile.current ? 1 : (window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ScrollTrigger.refresh();
    };

    resizeCanvas();
    renderFrame(0);
    window.addEventListener("resize", resizeCanvas);

    const frameObj = { frame: 0 };
    
    let ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-background-section",
          start: "top top",
          end: "bottom bottom",
          scrub: true, // Let Lenis handle the smoothing natively
        }
      });

      tl.to(frameObj, {
        frame: images.length - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => renderFrame(frameObj.frame)
      });
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ctxGsap.revert();
    };
  }, [loaded, images]);



  return <canvas ref={canvasRef} className="scroll-background-canvas" />;
};

export default ScrollBackground;