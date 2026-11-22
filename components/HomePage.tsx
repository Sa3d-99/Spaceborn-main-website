'use client';
import { LazyVideo } from "./LazyVideo";

import { useState, useEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Brain, Code2, Cpu, Gauge, Globe2, Layers3, Network, Target, Workflow } from 'lucide-react';
import ResumeModal from './ResumeModal';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from './HomePage.module.css';

const SPRING = { type: 'spring', stiffness: 100, damping: 20 } as const;
const PRESS = { scale: 0.97 };

const CLD = 'https://res.cloudinary.com/kpa1wv3h';
const cldVideo = (path: string, width: number) =>
  `${CLD}/video/upload/f_auto,q_auto:good,w_${width},c_limit/${path}.mp4`;
const cldPoster = (path: string, width: number) =>
  `${CLD}/video/upload/so_1,f_auto,q_auto,w_${width},c_limit/${path}.jpg`;

const CLD_USER = 'https://res.cloudinary.com/jyr596tn';
const cldUserImg = (file: string) => `${CLD_USER}/image/upload/f_auto,q_auto:good/spaceborn_media/home/${file}`;
const cldUserVid = (file: string) => `${CLD_USER}/video/upload/f_auto,q_auto:good/spaceborn_media/home/${file}.mp4`;

type Tile = {
  id: string;
  name: string;
  desc: string;
  href: string;
  size: 'square' | 'wide' | 'tall';
  image: string;
  alt: string;
  video?: string;
  fit?: 'cover' | 'contain';
  position?: string;
};

const TILES: Tile[] = [
  {
    id: 'flight-controller',
    name: 'Flight Controller',
    desc: 'Flight control and onboard autonomy, powered by ANSA on ELARA hardware.',
    href: '/systems/flight-cont',
    size: 'wide',
    image: cldPoster('v1785868057/VideoProject_hzk4kg', 1600),
    video: cldVideo('v1785868057/VideoProject_hzk4kg', 1600),
    alt: 'ELARA flight controller mounted on a drone frame',
  },
  {
    id: 'elara',
    name: 'ELARA SB2',
    desc: 'High-performance STM32H7 flight controller.',
    href: '/systems/flight-cont',
    size: 'tall',
    image: `${CLD_USER}/image/upload/v1793623358/spaceborn_media/home/elara-sb2.webp`,
    video: `${CLD_USER}/video/upload/v1793631026/spaceborn_media/home/elara-sb2.mp4`,
    alt: 'ELARA SB2 flight controller on a dark surface',
  },
  {
    id: 'aria',
    name: 'ARIA 50A',
    desc: 'Precise motor control with live current feedback to the flight controller.',
    href: '/systems/Esc-sys',
    size: 'square',
    image: `${CLD}/image/upload/f_auto,q_auto,w_900,c_limit/v1783382813/spaceborn_assets/ESC%2050A.png`,
    alt: 'ARIA 50A electronic speed controller PCB',
    fit: 'contain',
  },
  {
    id: 'hpu',
    name: 'HPU',
    desc: 'Brings camera, LiDAR, radar, and GNSS data together for onboard AI.',
    href: '/systems/edgecompute',
    size: 'square',
    image: cldUserImg('hpu.webp'),
    alt: 'HPU edge compute board, 3D render',
    fit: 'contain',
  },
  {
    id: 'deryk',
    name: 'DERYK',
    desc: 'Turns operator intent into executable machine action.',
    href: 'https://spaceborn-web.vercel.app/',
    size: 'wide',
    image: cldPoster('v1785966524/womanAndDrone_xjbmqm', 1200),
    video: cldVideo('v1785966524/womanAndDrone_xjbmqm', 1200),
    alt: 'Operator collaborating with autonomous drone platform in the field',
  },
  {
    id: 'certanity',
    name: 'CERTANITY',
    desc: 'Test and validate autonomous systems in 24+ simulation domains before deployment.',
    href: 'https://certanity.com/',
    size: 'square',
    image: cldPoster('v1785781462/Quadcopter_drone_hovers_in_tunnel_202608030904_hvg4oj', 1200),
    video: cldVideo('v1785781462/Quadcopter_drone_hovers_in_tunnel_202608030904_hvg4oj', 1200),
    alt: 'Quadcopter holding position inside a concrete tunnel',
    position: '68% 50%',
  },
  {
    id: 'elio',
    name: 'SB ELIO',
    desc: 'Dual-MCU development board. ESP32-S3 and RP2350 on one platform.',
    href: '/systems/embedded-sdk',
    size: 'square',
    image: cldUserImg('sb-elio.webp'),
    alt: 'SB ELIO development board',
    fit: 'contain',
  },
  {
    id: 'gcs',
    name: 'GROUND CONTROL',
    desc: 'Monitor live attitude and telemetry through a 3D digital twin at 50 Hz.',
    href: '/platforms/missionstudio',
    size: 'wide',
    image: cldUserImg('gcs-twin.webp'),
    video: cldUserVid('gcs-twin'),
    alt: 'ANSA digital twin cockpit mirroring a hand-tilted IMU board on the attitude indicator and 3D drone model',
  },
];

type Board = {
  id: string;
  tab: string;
  name: string;
  kind: string;
  desc: string;
  specs: [string, string][];
  href: string;
  image: { src: string; alt: string; width: number; height: number; fit?: 'cover' | 'contain' };
};

const BOARDS: Board[] = [
  {
    id: 'sb0',
    tab: 'ELARA SB0',
    name: 'ELARA SB0',
    kind: 'Flight controller',
    desc: '4-layer STM32F7 flight controller for advanced autonomous drones and research platforms.',
    specs: [
      ['MCU family', 'STM32F7'],
      ['PCB stack-up', '4-LAYER'],
      ['Autonomy stack', 'ANSA VIA HAL'],
    ],
    href: '/systems/flight-cont',
    image: { src: cldUserImg('elara-sb0-wide.webp'), alt: 'ELARA SB0 flight controller, top view', width: 1280, height: 960 },
  },
  {
    id: 'sb1',
    tab: 'ELARA SB1',
    name: 'ELARA SB1',
    kind: 'Flight controller',
    desc: '6-layer STM32F7 flight controller. Two additional copper layers over SB0 for power and signal routing.',
    specs: [
      ['MCU family', 'STM32F7'],
      ['PCB stack-up', '6-LAYER'],
      ['Autonomy stack', 'ANSA VIA HAL'],
    ],
    href: '/systems/flight-cont',
    image: { src: cldUserImg('elara-sb1.webp'), alt: 'ELARA SB1 flight controller wired on the bench', width: 1190, height: 896 },
  },
  {
    id: 'sb2',
    tab: 'ELARA SB2',
    name: 'ELARA SB2',
    kind: 'Flight controller',
    desc: 'High-performance STM32H7 controller with increased processing headroom, expanded connectivity, and support for complex AI workloads.',
    specs: [
      ['MCU family', 'STM32H7'],
      ['Class', 'HIGH-PERFORMANCE'],
      ['Autonomy stack', 'ANSA VIA HAL'],
    ],
    href: '/systems/flight-cont',
    image: { src: `${CLD_USER}/image/upload/v1793623358/spaceborn_media/home/elara-sb2.webp`, alt: 'ELARA SB2 flight controller', width: 1280, height: 720 },
  },
  {
    id: 'aria',
    tab: 'ARIA 50A',
    name: 'ARIA 50A',
    kind: 'Electronic speed controller',
    desc: 'Electronic speed controller with live current telemetry streamed back to the flight controller.',
    specs: [
      ['Continuous current', '50 A'],
      ['Firmware', 'AM32'],
      ['Input voltage', '3S – 6S LIPO'],
      ['Telemetry', 'LIVE CURRENT'],
      ['Board dimensions', '37 × 42.5 MM'],
    ],
    href: '/systems/Esc-sys',
    image: {
      src: `${CLD}/image/upload/f_auto,q_auto,w_900,c_limit/v1783382813/spaceborn_assets/ESC%2050A.png`,
      alt: 'ARIA 50A electronic speed controller PCB',
      width: 900,
      height: 900,
    },
  },
];

type Scenario = {
  id: string;
  title: string;
  desc: string;
  readouts: [string, string][];
  video: { src: string; poster: string; fit?: 'cover' | 'contain' };
};

const SCENARIOS: Scenario[] = [
  {
    id: 'tunnel-drone',
    title: 'GPS-denied tunnel navigation',
    desc: 'When satellites disappear, autonomy takes over. Optical flow and LiDAR point clouds hold trajectory through unmapped subterranean corridors.',
    readouts: [['GNSS', 'DENIED'], ['HOLD', 'OPTICAL FLOW'], ['TRAJECTORY', 'LOCKED']],
    video: {
      src: cldVideo('v1785966759/tunnelDrone_nhqulg', 1600),
      poster: cldPoster('v1785966759/tunnelDrone_nhqulg', 1600),
    },
  },
  {
    id: 'drone-swarm',
    title: '128-unit swarm coordination',
    desc: 'Distributed consensus and decentralized collision avoidance. Autonomous agents negotiate airspace and execute synchronized group missions.',
    readouts: [['AGENTS', '128'], ['CONSENSUS', 'SYNCED'], ['LINK', 'MESH 5.8GHZ']],
    video: {
      src: cldVideo('v1786023546/swarmFleet_x4tlds', 1600),
      poster: cldPoster('v1786023546/swarmFleet_x4tlds', 1600),
    },
  },
  {
    id: 'factory',
    title: 'Industrial inspection cell',
    desc: 'Four robot stations, a conveyor, and an inspection line in a simulated factory, proven before any arm moves on the floor.',
    readouts: [['STATIONS', '4'], ['LINE', 'INSPECTION'], ['DOMAIN', 'INDUSTRIAL']],
    video: {
      src: `${CLD_USER}/video/upload/v1793615952/spaceborn_media/home/sim-factory.mp4`,
      poster: `${CLD_USER}/image/upload/v1793615954/spaceborn_media/home/sim-factory.webp`,
    },
  },
];

const CYCLE_MS = 9000;

/* Logo heights are set by eye in em, so each mark carries the same visual weight.
   Companies without a verified official logo stay as text. */
const PARTNERS: { name: string; logo?: string; width?: number; height?: number; em?: number }[] = [
  { name: 'Tata Electronics', logo: '/images/partners/tata-electronics.svg', width: 228, height: 20, em: 0.85 },
  { name: 'Weebit Nano', logo: '/images/partners/weebit-nano.svg', width: 190, height: 40, em: 1.5 },
  { name: 'JLCPCB', logo: '/images/partners/jlcpcb.png', width: 316, height: 70, em: 1.3 },
  { name: 'NVIDIA', logo: '/images/partners/nvidia.svg', width: 656, height: 120, em: 1.3 },
];

function useInView(ref: RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

function usePlayWhen(videoRef: RefObject<HTMLVideoElement | null>, shouldPlay: boolean, key?: unknown) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldPlay) {
      video.pause();
      return;
    }
    const play = () => {
      video.play().catch(() => {});
    };
    play();
    video.addEventListener('loadeddata', play);
    return () => video.removeEventListener('loadeddata', play);
  }, [videoRef, shouldPlay, key]);
}

/* One shared observer, so everything entering view together (a refresh, a restored
   scroll position) is sorted and staggered top to bottom. The motion itself is CSS,
   which stays smooth while the page is still busy loading. */
const LOAD_STAGGER_MS = 80;
const LOAD_MAX_DELAY_MS = 640;
const loadCallbacks = new Map<Element, (delayMs: number) => void>();
let loadObserver: IntersectionObserver | null = null;
let nextLoadSlot = 0;

function getLoadObserver() {
  loadObserver ??= new IntersectionObserver(
    (entries) => {
      const now = performance.now();
      entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left,
        )
        .forEach((entry) => {
          const start = Math.max(now, nextLoadSlot);
          nextLoadSlot = start + LOAD_STAGGER_MS;
          loadObserver?.unobserve(entry.target);
          loadCallbacks.get(entry.target)?.(Math.min(start - now, LOAD_MAX_DELAY_MS));
          loadCallbacks.delete(entry.target);
        });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  return loadObserver;
}

/* Returns null until the element enters view, then its delay in ms. */
function useLoadIn(ref: RefObject<Element | null>) {
  const [delayMs, setDelayMs] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = getLoadObserver();
    loadCallbacks.set(el, setDelayMs);
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      loadCallbacks.delete(el);
    };
  }, [ref]);
  return delayMs;
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const delayMs = useLoadIn(ref);
  const shown = delayMs !== null;

  return (
    <div
      ref={ref}
      className={`${styles.loadIn} ${shown ? styles.loadInShown : ''} ${className ?? ''}`}
      style={shown ? { transitionDelay: `${delayMs + delay * 1000}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function SectionHead({ title, lede }: { title: string; lede: string }) {
  return (
    <Reveal className={styles.sectionHead}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionLede}>{lede}</p>
    </Reveal>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return <i className={`fa-solid fa-circle-arrow-right ${className}`} aria-hidden="true" />;
}

const WAVE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]_';

const HERO_LINES: string[][] = [
  ['BUILD', 'AUTONOMOUS', 'MACHINES.'],
  ['WITHOUT', 'REBUILDING', 'THE', 'STACK.'],
];

const HERO_TITLE = HERO_LINES.map((words) => words.join(' ')).join(' ');

function HeroTitleCodeDecode({ inView }: { inView: boolean }) {
  const reduceMotion = Boolean(useReducedMotion());
  const [triggered, setTriggered] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (inView && !triggered) {
      setTriggered(true);
    }
  }, [inView, triggered]);

  useEffect(() => {
    if (reduceMotion) {
      setIsCompleted(true);
      return;
    }
    if (!triggered) return;

    let animId: number;
    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const diff = now - start;
      setElapsed(diff);

      if (diff >= 2200) {
        setIsCompleted(true);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [triggered, reduceMotion]);

  let globalNonSpace = 0;

  return (
    <>
      <span className={styles.srOnly}>{HERO_TITLE}</span>
      <span className={styles.decodeBoard} aria-hidden="true">
        {HERO_LINES.map((words, lineIdx) => {
          const renderedWords = words.map((word, wordIdx) => {
            const chars = word.split('').map((targetChar) => {
              const k = globalNonSpace++;
              const lineDelay = lineIdx === 0 ? 180 : 280;
              const charStart = lineDelay + k * 52;
              const charLock = charStart + 300;

              const isResolved = isCompleted || elapsed >= charLock;
              const isWave = !isResolved && elapsed >= charStart;
              const isHidden = !isResolved && !isWave;

              let charDisplay = targetChar;
              if (isWave) {
                const scrambleIdx =
                  (Math.floor(elapsed / 36) + k * 7) % WAVE_GLYPHS.length;
                charDisplay = WAVE_GLYPHS[scrambleIdx];
              }

              return (
                <span className={styles.charBox} key={targetChar + k}>
                  <span className={styles.charSizer} aria-hidden="true">
                    {targetChar}
                  </span>
                  <span
                    className={`${styles.decodeChar} ${
                      isResolved
                        ? styles.charResolved
                        : isWave
                        ? styles.charWave
                        : styles.charHidden
                    }`}
                  >
                    {isResolved ? targetChar : charDisplay}
                  </span>
                </span>
              );
            });

            return (
              <span key={wordIdx} className={styles.decodeWord}>
                {chars}
                {wordIdx < words.length - 1 && (
                  <span className={styles.decodeSpace}>&nbsp;</span>
                )}
              </span>
            );
          });

          return (
            <span key={lineIdx} className={styles.decodeRow}>
              {renderedWords}
            </span>
          );
        })}
      </span>
    </>
  );
}

/* ───────────── 1. Hero ───────────── */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, 0.05);
  usePlayWhen(videoRef, inView);

  return (
    <section ref={sectionRef} className={styles.hero} id="releases">
      <div className={`du-hero ${styles.heroFrame}`}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={cldPoster('v1785962155/droneCircuitVid_p16yvl', 1920)}
          aria-hidden="true"
        >
          <source src={cldVideo('v1785962155/droneCircuitVid_p16yvl', 720)} type="video/mp4" media="(max-width: 720px)" />
          <source src={cldVideo('v1785962155/droneCircuitVid_p16yvl', 1920)} type="video/mp4" />
        </video>
        <div className={`du-hero-overlay ${styles.heroVignette}`} />

        <div className={`du-hero-content ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            <HeroTitleCodeDecode inView={inView} />
          </h1>
          <p className={styles.heroSub}>
            Spaceborn brings AI, software, simulation, and hardware into one connected
            platform. Build, test, and deploy autonomous machines with less repeated engineering.
          </p>
        </div>
      </div>
    </section>
  );
}

const PLATFORM_LAYERS = [
  { name: 'AI', icon: Brain, desc: 'Turn operator intent into actions the machine can execute.' },
  { name: 'Software', icon: Code2, desc: 'Run the control logic and process the data from onboard sensors.' },
  { name: 'Simulation', icon: Layers3, desc: 'Repeat the same scenario to see how a change affects performance.' },
  { name: 'Hardware', icon: Cpu, desc: 'Connect controllers, onboard compute, and motors on the physical machine.' },
];

function TheProblem() {
  return (
    <section className={styles.section} aria-label="The problem Spaceborn solves">
      <div className={styles.container}>
        <SectionHead
          title="AUTONOMY IS FRAGMENTED."
          lede="A drone, a rover, and an industrial robot do different jobs, yet their teams face the same integration work. They have to connect sensors and controllers, adapt software to the machine, and set up tests to see how it behaves. When these pieces live in separate tools, each new machine can mean rebuilding much of the same stack."
        />
        <Reveal className={styles.platformDiagram}>
          <ul className={styles.platformLayers}>
            {PLATFORM_LAYERS.map(({ name, icon: Icon, desc }) => (
              <li key={name} className={`du-card du-card-side du-card-border ${styles.platformLayer}`}>
                <span className={styles.platformIcon} aria-hidden="true">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <div className={`du-card-body ${styles.platformLayerBody}`}>
                  <h3 className={`du-card-title ${styles.platformLayerTitle}`}>{name}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.platformConnection} aria-hidden="true" />
          <div className={`du-card du-card-border du-card-body ${styles.platformSummary}`}>
            <h3 className="du-card-title">ONE CONNECTED SPACEBORN PLATFORM</h3>
            <p>Spaceborn brings those four layers into a single workflow. Test how the control software responds in a simulated environment, then carry that work forward as you validate it on real hardware. Your team can spend more time on what makes the machine unique.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const ADVANTAGES = [
  {
    title: 'Build faster', icon: Gauge,
    desc: 'Test changes in simulation before booking time on a physical prototype. Reproduce problems, rerun the same scenario after a fix, and use your time on the real machine to check the changes that matter most.',
  },
  {
    title: 'More accurate', icon: Target,
    desc: 'Test how a machine behaves when conditions change, such as when a drone loses satellite positioning. Use repeatable scenarios and telemetry to understand where the software performs as expected and where it needs more validation.',
  },
  {
    title: 'All-in-one platform', icon: Workflow,
    desc: 'Use Certanity to test scenarios, ANSA to run the machine, and DERYK to turn operator intent into action. Connecting these tools with Spaceborn hardware gives teams a workflow they can follow from an early simulation through real-world testing.',
  },
  {
    title: 'Built for real machines', icon: Cpu,
    desc: 'Work with the components a physical machine depends on, from flight controllers and motor controllers to onboard compute. Ground Control mirrors live attitude and telemetry in a digital twin, giving operators a view of what the machine is doing.',
  },
  {
    title: 'Powered by intelligence', icon: Network,
    desc: 'Use AI to interpret operator intent and analyze simulation results. When a test exposes a problem, the team can review what happened, adjust the software or mission, and repeat the scenario to see what changed.',
  },
  {
    title: "Ready for what's next", icon: Globe2,
    desc: 'Start with a research prototype or a single machine. As the project grows, bring forward the scenarios, control software, and hardware experience your team has already built, then adapt them for new machines and environments.',
  },
];

function WhySpaceborn() {
  return (
    <section className={styles.section} id="why-spaceborn">
      <div className={styles.container}>
        <SectionHead
          title="WHY SPACEBORN?"
          lede="Building an autonomous machine means coordinating simulation, software, and hardware at every stage. Teams choose Spaceborn to bring those stages into one workflow, find problems earlier, and carry what they learn in simulation into hardware testing and deployment."
        />
        <div className={styles.advantages}>
          {ADVANTAGES.map(({ title, icon: Icon, desc }) => (
            <Reveal key={title} className={`du-card du-card-border ${styles.advantage}`}>
              <div className={`du-card-body ${styles.advantageBody}`}>
                <span className={styles.advantageIcon} aria-hidden="true">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <h3 className="du-card-title">{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 2. Product grid ───────────── */

function ProductTile({ tile }: { tile: Tile }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [playing, setPlaying] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const reduceMotion = useReducedMotion();
  const loadDelayMs = useLoadIn(tileRef);
  const isAria = tile.id === 'aria';
  const isGcs = tile.id === 'gcs';

  // Continuous In-View Auto-Playback across ALL viewports (phone, tablet, laptop, desktop)
  useEffect(() => {
    if (!tile.video || reduceMotion) return;

    const el = tileRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          const promise = video.play();
          playPromiseRef.current = promise;
          if (promise) {
            promise
              .then(() => setPlaying(true))
              .catch(() => {});
          }
          // Never stop playing once the user scrolls to it (Anduril continuous playback)
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [tile.video, reduceMotion]);

  // Wait for a full decode so the image can never paint in strips as it fades in.
  const revealImage = () => {
    const image = imageRef.current;
    if (!image) return;
    image.decode().catch(() => {}).finally(() => setImageReady(true));
  };

  // A cached image can finish before hydration, so its load event never reaches React.
  useEffect(() => {
    if (imageRef.current?.complete) revealImage();
  }, []);

  const start = () => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  const body = (
    <>
      <div className={styles.tileMedia}>
        <img
          ref={imageRef}
          className={`${tile.fit === 'contain' ? styles.tileImageContain : styles.tileImage} ${isAria ? styles.tileImageAria : ''} ${imageReady ? '' : styles.tileImagePending}`}
          src={tile.image}
          alt={tile.alt}
          decoding="async"
          onLoad={revealImage}
          onError={() => setImageReady(true)}
          style={tile.position ? { objectPosition: tile.position } : undefined}
        />
        {tile.video && (
          <video
            ref={videoRef}
            className={`${styles.tileVideo} ${playing ? styles.tileVideoOn : ''}`}
            style={tile.position ? { objectPosition: tile.position } : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onPlaying={() => {
              setPlaying(true);
            }}
          >
            <source src={tile.video} type="video/mp4" />
          </video>
        )}
      </div>
      <div className={styles.tileScrim} />
      <div className={`du-card-body ${styles.tileText}`}>
        <h3 className={`du-card-title ${styles.tileTitle}`}>{tile.name}</h3>
        <p className={styles.tileDesc}>{tile.desc}</p>
      </div>
      <ArrowIcon className={styles.tileArrow} />
    </>
  );

  const handlers = { onPointerEnter: start, onFocus: start };
  const className = `du-card du-card-border ${styles.tile} ${isGcs ? styles.tileGcs : ''}`;

  return (
    <div ref={tileRef} className={`${styles.tileCell} ${styles[tile.size]}`} data-tile={tile.id}>
      <div
        className={`${styles.tileClip} ${loadDelayMs !== null ? styles.tileClipShown : ''}`}
        style={loadDelayMs !== null ? { transitionDelay: `${loadDelayMs}ms` } : undefined}
      >
        {tile.href.startsWith('http') ? (
          <a
            href={tile.href}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            {...handlers}
          >
            {body}
          </a>
        ) : (
          <Link href={tile.href} className={className} {...handlers}>
            {body}
          </Link>
        )}
      </div>
    </div>
  );
}

function ProductGrid() {
  return (
    <section className={styles.section} id="platforms">
      <div className={styles.container}>
        <SectionHead
          title="ONE STACK FOR EVERY PHYSICAL MACHINE"
          lede="Each product has a role in getting the machine into the field. ANSA runs the control software, DERYK translates operator intent into machine actions, and Certanity lets engineers test those behaviors in simulation. Flight controllers, motor controllers, and onboard compute bring the workflow onto physical hardware."
        />
        <div className={styles.tiles}>
          {TILES.map((tile) => (
            <ProductTile key={tile.id} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 3. Hardware lab ───────────── */

function HardwareLab() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const board = BOARDS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + BOARDS.length) % BOARDS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={styles.section} id="systems">
      <div className={styles.container}>
        <SectionHead
          title="FLIGHT CONTROLLERS"
          lede="Flight controllers run the control software, and electronic speed controllers drive the motors. Compare the ELARA boards that run ANSA and the ARIA 50A speed controller that feeds live current readings back to the flight controller. Open the specifications to see what fits your build."
        />

        <Reveal>
        <div className={`du-tabs du-tabs-box ${styles.tabs} ${styles.hardwareTabs}`} role="tablist" aria-label="Hardware" onKeyDown={onKeyDown}>
          {BOARDS.map((b, i) => (
            <button
              key={b.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`hw-tab-${b.id}`}
              aria-selected={i === active}
              aria-controls="hw-panel"
              tabIndex={i === active ? 0 : -1}
              className={`du-tab ${styles.tab} ${i === active ? 'du-tab-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {b.tab}
            </button>
          ))}
        </div>

        <div className={`du-card du-card-border ${styles.lab}`} role="tabpanel" id="hw-panel" aria-labelledby={`hw-tab-${board.id}`}>
          <div className={styles.labMedia}>
            <AnimatePresence initial={false}>
              <motion.img
                key={board.id}
                className={`${board.image.fit === 'contain' ? styles.labImageContain : styles.labImage} ${board.id === 'aria' ? styles.labImageAria : ''}`}
                src={board.image.src}
                alt={board.image.alt}
                width={board.image.width}
                height={board.image.height}
                decoding="async"
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              />
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={board.id}
              className={`du-card-body ${styles.labBody}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <h3 className={`du-card-title ${styles.labTitle}`}>{board.name}</h3>
              <p className={styles.labKind}>{board.kind}</p>
              <p className={styles.labDesc}>{board.desc}</p>
              <table className={`du-table ${styles.specTable}`}>
                <thead>
                  <tr>
                    <th scope="col">Parameter</th>
                    <th scope="col">Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {board.specs.map(([param, spec]) => (
                    <tr key={param}>
                      <td>{param}</td>
                      <td>{spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href={board.href} className={`du-btn du-btn-link ${styles.labLink}`}>
                Full documentation
                <ArrowIcon className={styles.labLinkIcon} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── 4. Certanity reality engine ───────────── */

function RealityEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const inView = useInView(sectionRef);
  const scenario = SCENARIOS[active];

  usePlayWhen(videoRef, inView, active);

  return (
    <section ref={sectionRef} className={styles.section} id="simulation">
      <div className={styles.container}>
        <SectionHead
          title="PROVE IT BEFORE YOU DEPLOY IT"
          lede="Certanity offers 24+ simulation domains for testing the autonomy stack that runs on your hardware. The examples below show how teams can test navigation when GPS is unavailable, observe coordination across multiple machines, and verify an inspection workflow before moving it onto the factory floor."
        />

        <Reveal className={styles.engine}>
          <div
            className={`du-card du-card-border ${styles.viewport}`}
            role="tabpanel"
            id="sim-panel"
            aria-label={scenario.title}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={scenario.id}
                style={{ position: 'absolute', inset: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <LazyVideo
                  ref={videoRef}
                  className={scenario.video.fit === 'contain' ? styles.viewportVideoContain : styles.viewportVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={scenario.video.poster}
                  aria-label={scenario.title}
                >
                  <source src={scenario.video.src} type="video/mp4" />
                </LazyVideo>
              </motion.div>
            </AnimatePresence>
            <div className={styles.viewportShade} />

            {/* Preserved Line Progress directly on top of the video */}
            <div className={styles.simLineProgress}>
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={styles.simSegmentTrack}
                  onClick={() => setActive(i)}
                  aria-label={`Switch to ${s.title}`}
                >
                  <span
                    className={`${styles.simSegmentFill} ${
                      i < active ? styles.simSegmentDone : i === active ? styles.simSegmentActive : ''
                    } ${!inView || hovering ? styles.progressPaused : ''}`}
                    style={i === active ? { animationDuration: `${CYCLE_MS}ms` } : undefined}
                    onAnimationEnd={i === active ? () => setActive((a) => (a + 1) % SCENARIOS.length) : undefined}
                  />
                </button>
              ))}
            </div>

            <div className={styles.readouts}>
              {scenario.readouts.map(([k, v]) => (
                <span key={k}>
                  {k} <b>{v}</b>
                </span>
              ))}
            </div>
          </div>

          {/* Scenario Tabs OUTSIDE the video overlay for mobile view (styled exactly like Flight Controller tabs) */}
          <div className={`du-tabs du-tabs-box ${styles.tabs} ${styles.simMobileTabs}`} role="tablist" aria-label="Simulation scenarios">
            {SCENARIOS.map((s, i) => {
              const label = i === 0 ? 'GPS-DENIED' : i === 1 ? '128 SWARM' : 'INSPECTION';
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="sim-panel"
                  className={`du-tab ${styles.tab} ${i === active ? 'du-tab-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className={styles.simList} role="tablist" aria-label="Simulation scenarios" aria-orientation="vertical">
            {SCENARIOS.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="sim-panel"
                className={`du-card du-card-border du-card-body ${styles.simTab}`}
                onClick={() => setActive(i)}
                whileTap={PRESS}
                transition={SPRING}
              >
                <span className={styles.simTabTitle}>{s.title}</span>
                <span className={styles.simTabDesc}>{s.desc}</span>
                {i === active && (
                  <span
                    key={`progress-${active}`}
                    className={`${styles.progress} ${!inView || hovering ? styles.progressPaused : ''}`}
                    style={{ animationDuration: `${CYCLE_MS}ms` }}
                    onAnimationEnd={() => setActive((a) => (a + 1) % SCENARIOS.length)}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <PartnerMarquee />
      </Reveal>
    </section>
  );
}

/* Two identical groups, so translating the track by 50% loops without a jump.
   Each group repeats the names to stay wider than ultrawide screens. */
function PartnerMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0);

  return (
    <div ref={ref} className={styles.marquee}>
      <div className={`${styles.marqueeTrack} ${inView ? '' : styles.marqueePaused}`}>
        {[0, 1].map((group) => (
          <ul
            key={group}
            className={styles.marqueeGroup}
            aria-label={group === 0 ? 'Key customers and partners' : undefined}
            aria-hidden={group === 1 || undefined}
          >
            {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
              <li key={`${partner.name}-${i}`} aria-hidden={i >= PARTNERS.length || undefined}>
                {partner.logo ? (
                  <img
                    className={styles.marqueeLogo}
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    decoding="async"
                    draggable={false}
                    style={{ height: `${partner.em}em` }}
                  />
                ) : (
                  partner.name
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Closing ───────────── */

function Closing({ onResume }: { onResume: () => void }) {
  return (
    <section className={styles.closing} id="simulators-hub">
      <span id="thoth" />
      <div className={`${styles.container} ${styles.closingInner}`}>
        <Reveal>
          <h2 className={styles.closingTitle}>BUILD THE AUTONOMOUS MACHINE FUTURE WITH US</h2>
          <p className={`${styles.sectionLede} ${styles.closingLede}`}>
            Tell our engineering team what you’re building and where you need help, whether you’re choosing
            hardware, planning simulation tests, or preparing a prototype for field trials.
          </p>
        </Reveal>
        <Reveal className={styles.ctaRow} delay={0.06}>
          <motion.div whileTap={PRESS} transition={SPRING}>
            <a
              href="https://www.linkedin.com/in/adarsh-kumar-ab8111377?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className={`du-btn du-btn-primary ${styles.ctaButton} ${styles.ctaPrimary}`}
            >
              Contact engineering
            </a>
          </motion.div>
          <motion.button type="button" className={`du-btn du-btn-outline ${styles.ctaButton}`} onClick={onResume} whileTap={PRESS} transition={SPRING}>
            Share your resume
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <Navbar linkArrow={<i className="fa-solid fa-arrow-right" />} />

      <main className={styles.page} data-theme="spaceborn">
        <Hero />
        <TheProblem />
        <ProductGrid />
        <WhySpaceborn />
        <HardwareLab />
        <RealityEngine />
        <Closing onResume={() => setIsResumeModalOpen(true)} />
      </main>

      <Footer />

      {isResumeModalOpen && (
        <ResumeModal onClose={() => setIsResumeModalOpen(false)} />
      )}
    </MotionConfig>
  );
}
