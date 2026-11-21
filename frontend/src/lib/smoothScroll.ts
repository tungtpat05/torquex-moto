import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export const initSmoothScroll = (): Lenis => {
  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.info('[Motion] prefers-reduced-motion detected: smooth scroll bypassed');
    return null as unknown as Lenis;
  }

  // Reuse existing instance if present
  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential deceleration
    smoothWheel: true,
    wheelMultiplier: 0.55, // Deliberate, weighted cinematic scroll pace
    touchMultiplier: 0.8,
  });

  lenisInstance = lenis;

  // Synchronize Lenis scroll event with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis through GSAP's internal requestAnimationFrame ticker
  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);

  // Eliminate erratic jumps after tab resume or heavy GC pass
  gsap.ticker.lagSmoothing(0);

  return lenis;
};

export const destroySmoothScroll = () => {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

export const getLenis = () => lenisInstance;

export { gsap, ScrollTrigger };
