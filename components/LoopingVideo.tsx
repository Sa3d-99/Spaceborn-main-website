'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

type LoopingVideoProps = Omit<
  ComponentPropsWithoutRef<'video'>,
  'autoPlay' | 'controls' | 'loop' | 'muted' | 'playsInline' | 'preload'
>;

export default function LoopingVideo(props: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden && !reducedMotion.matches) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.05;
      syncPlayback();
    }, { threshold: 0.05 });

    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  return <video {...props} ref={videoRef} muted loop playsInline preload="none" />;
}
