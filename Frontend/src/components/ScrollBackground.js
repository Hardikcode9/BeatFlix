import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollBackground = ({ totalFrames = 200 }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const imagesRef = useRef([]);
  const [initialFrameReady, setInitialFrameReady] = useState(false);

  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const availableImages = imagesRef.current;
    if (!availableImages || availableImages.length === 0) return;

    // Use requested frame or closest available
    const clampedIndex = Math.min(Math.max(0, frameIndex), availableImages.length - 1);
    let image = availableImages[clampedIndex];

    if (!image || image.naturalWidth === 0) {
      // Find nearest loaded frame
      for (let offset = 1; offset < availableImages.length; offset++) {
        if (clampedIndex - offset >= 0 && availableImages[clampedIndex - offset]?.naturalWidth > 0) {
          image = availableImages[clampedIndex - offset];
          break;
        }
        if (clampedIndex + offset < availableImages.length && availableImages[clampedIndex + offset]?.naturalWidth > 0) {
          image = availableImages[clampedIndex + offset];
          break;
        }
      }
    }

    if (!image || image.naturalWidth === 0) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const screenRatio = screenWidth / screenHeight;

    let drawWidth;
    let drawHeight;

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
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ScrollTrigger.refresh();
  }, []);

  // Progressive frame loading in prioritized chunks
  useEffect(() => {
    let cancelled = false;
    const loadedImages = new Array(totalFrames).fill(null);

    const loadSingleImage = (frameNum) =>
      new Promise((resolve) => {
        const img = new Image();
        const src = `/frames/ezgif-frame-${String(frameNum).padStart(3, "0")}.webp`;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const loadFramesProgressively = async () => {
      // 1. Load first frame immediately for instant first-paint
      const firstImg = await loadSingleImage(1);
      if (cancelled) return;

      if (firstImg) {
        loadedImages[0] = firstImg;
        imagesRef.current = [...loadedImages];
        setImages([...loadedImages]);
        setInitialFrameReady(true);
        resizeCanvas();
        renderFrame(0);
      }

      // 2. Load remaining frames in batches of 6 to avoid network saturation
      const remainingIndices = [];
      for (let i = 2; i <= totalFrames; i++) {
        remainingIndices.push(i);
      }

      const BATCH_SIZE = 6;
      for (let b = 0; b < remainingIndices.length; b += BATCH_SIZE) {
        if (cancelled) return;
        const batch = remainingIndices.slice(b, b + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map((frameNum) => loadSingleImage(frameNum)));

        batch.forEach((frameNum, idx) => {
          loadedImages[frameNum - 1] = batchResults[idx];
        });

        imagesRef.current = [...loadedImages];
      }

      if (!cancelled) {
        setImages([...loadedImages]);
      }
    };

    loadFramesProgressively();

    return () => {
      cancelled = true;
    };
  }, [totalFrames, renderFrame, resizeCanvas]);

  // GSAP scroll trigger animation
  useEffect(() => {
    if (!initialFrameReady) return;

    resizeCanvas();
    renderFrame(0);

    window.addEventListener("resize", resizeCanvas);

    const frameObj = { frame: 0 };
    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-background-section",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.to(frameObj, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => renderFrame(Math.round(frameObj.frame)),
      });
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ctxGsap.revert();
    };
  }, [initialFrameReady, totalFrames, renderFrame, resizeCanvas]);

  return <canvas ref={canvasRef} className="scroll-background-canvas" />;
};

export default ScrollBackground;