'use client';
import { LazyVideo } from "./LazyVideo";

import { useState, useEffect, useRef, type KeyboardEvent, type RefObject } from 'react';
import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Footer from './Footer';
import Navbar from './Navbar';
import Icon from './Icon';
import styles from './HomePage.module.css';

const SPRING = { type: 'spring', stiffness: 100, damping: 20 } as const;
const PRESS = { scale: 0.97 };

const CLD = 'https://res.cloudinary.com/kpa1wv3h';
const cldVideo = (path: string, width: number) =>
  `${CLD}/video/upload/f_auto,q_auto:good,w_${width},c_limit/${path}.mp4`;
const cldPoster = (path: string, width: number) =>
  `${CLD}/video/upload/so_1,f_auto,q_auto,w_${width},c_limit/${path}.jpg`;

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
    image: '/media/home/elara-sb2.webp',
    video: '/media/home/elara-sb2.mp4',
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
    image: '/media/home/hpu.webp',
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
    image: '/media/home/sb-elio.webp',
    alt: 'SB ELIO development board',
    fit: 'contain',
  },
  {
    id: 'gcs',
    name: 'GROUND CONTROL',
    desc: 'Monitor live attitude and telemetry through a 3D digital twin at 50 Hz.',
    href: '/platforms/missionstudio',
    size: 'wide',
    image: '/media/home/gcs-twin.webp',
    video: '/media/home/gcs-twin.mp4',
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
    image: { src: '/media/home/elara-sb0-wide.webp', alt: 'ELARA SB0 flight controller, top view', width: 1280, height: 960 },
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
    image: { src: '/media/home/elara-sb1.webp', alt: 'ELARA SB1 flight controller wired on the bench', width: 1190, height: 896 },
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
    image: { src: '/media/home/elara-sb2.webp', alt: 'ELARA SB2 flight controller', width: 1280, height: 720 },
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
      src: '/media/home/sim-factory.mp4',
      poster: '/media/home/sim-factory.webp',
    },
  },
];

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

function usePlayWhen(videoRef: RefObject<HTMLVideoElement | null>, shouldPlay: boolean) {
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
  }, [videoRef, shouldPlay]);
}

function SectionHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className={styles.sectionHead}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionLede}>{lede}</p>
    </header>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, 0.05);
  const reduceMotion = useReducedMotion();
  const [introFinished, setIntroFinished] = useState(false);
  usePlayWhen(videoRef, inView && !reduceMotion && !introFinished);

  return (
    <section ref={sectionRef} className={styles.hero} id="releases" aria-labelledby="home-title">
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted playsInline preload="metadata"
        poster="/media/home/hero-sb1.webp"
        aria-hidden="true"
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (video.currentTime >= 4.5) {
            video.pause();
            setIntroFinished(true);
          }
        }}
      >
        <source src="/media/home/hero-sb1-720.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/media/home/hero-sb1.mp4" type="video/mp4" />
      </video>
      <div className={styles.heroVignette} />
      <div className={`${styles.container} ${styles.heroContent}`}>
        <h1 className={styles.heroTitle} id="home-title">Build autonomous<br className={styles.heroBreak} /> machines.</h1>
        <p className={styles.heroSub}>Autonomy software, simulation, and flight hardware in one Spaceborn stack.</p>
        <a href="#platforms" className={`du-btn du-btn-primary ${styles.ctaButton} ${styles.ctaPrimary}`}>
          Explore the stack <Icon name="arrow-down" />
        </a>
      </div>
    </section>
  );
}

const ADVANTAGES = [
  { title: 'Build faster', icon: 'gauge-high', desc: 'Repeat tests in simulation to find and fix issues before a hardware trial.', image: '/media/home/sim-factory.webp', alt: 'Spaceborn industrial inspection simulation' },
  { title: 'Built for real machines', icon: 'microchip', desc: 'Ground Control mirrors live attitude and telemetry in a digital twin.', image: '/media/home/gcs-twin.webp', alt: 'Spaceborn Ground Control telemetry and digital twin' },
  { title: 'More accurate', icon: 'crosshairs', desc: 'Compare outcomes across repeatable tests as conditions change.' },
  { title: 'One connected stack', icon: 'diagram-project', desc: 'Test with Certanity, run ANSA on hardware, and turn intent into action with DERYK.' },
  { title: 'AI for operators', icon: 'brain', desc: 'Interpret operator intent and review what happened in a test before the next run.' },
  { title: 'Ready to scale', icon: 'globe', desc: 'Carry forward scenarios, software, and hardware experience as new machines come online.' },
];

function WhySpaceborn() {
  return (
    <section className={styles.section} id="why-spaceborn">
      <div className={styles.container}>
        <SectionHead title="Why Spaceborn?" lede="Find problems earlier and carry what you learn in simulation into hardware testing and deployment." />
        <div className={styles.advantages}>
          {ADVANTAGES.map(({ title, icon, desc, image, alt }) => (
            <article key={title} className={`du-card du-card-border ${styles.advantage} ${image ? styles.advantageFeatured : ''}`}>
              <div className={`du-card-body ${styles.advantageBody}`}>
                <span className={styles.advantageIcon}><Icon name={icon} /></span>
                <h3 className="du-card-title">{title}</h3>
                <p>{desc}</p>
              </div>
              {image && <img src={image} alt={alt} loading="lazy" decoding="async" className={styles.advantageImage} />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTile({ tile }: { tile: Tile }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState(false);
  const [playing, setPlaying] = useState(false);
  const inView = useInView(tileRef, 0.05);
  const reduceMotion = useReducedMotion();
  usePlayWhen(videoRef, preview && inView && !reduceMotion);
  const props = {
    className: `du-card du-card-border ${styles.tile}`,
    onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType === 'mouse') setPreview(true); },
    onPointerLeave: () => setPreview(false),
    onFocus: () => setPreview(true),
    onBlur: () => setPreview(false),
  };
  const position = tile.position ? { objectPosition: tile.position } : undefined;
  const body = (
    <>
      <div className={styles.tileMedia}>
        <img
          className={tile.fit === 'contain' ? styles.tileImageContain : styles.tileImage}
          src={tile.image} alt={tile.alt} loading="lazy" decoding="async" style={position}
        />
        {tile.video && (
          <LazyVideo ref={videoRef} className={`${styles.tileVideo} ${playing ? styles.tileVideoOn : ''}`}
            style={position} muted loop playsInline preload="none" aria-hidden="true"
            onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}>
            <source src={tile.video} type="video/mp4" />
          </LazyVideo>
        )}
      </div>
      <div className={`du-card-body ${styles.tileText}`}>
        <h3 className="du-card-title">{tile.name}</h3>
        <p>{tile.desc}</p>
      </div>
      <Icon name="circle-arrow-right" className={styles.tileArrow} />
    </>
  );

  return (
    <div ref={tileRef} className={`${styles.tileCell} ${styles[tile.size]}`} data-tile={tile.id}>
      {tile.href.startsWith('http') ? (
        <a href={tile.href} target="_blank" rel="noopener noreferrer" {...props}>{body}</a>
      ) : (
        <Link href={tile.href} {...props}>{body}</Link>
      )}
    </div>
  );
}

function ProductGrid() {
  return (
    <section className={styles.section} id="platforms">
      <div className={styles.container}>
        <SectionHead
          title="One stack, from software to silicon"
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

function selectTab(
  event: KeyboardEvent<HTMLDivElement>, active: number, length: number,
  tabs: (HTMLButtonElement | null)[], onSelect: (next: number) => void,
) {
  let next = active;
  if (event.key === 'ArrowRight') next = (active + 1) % length;
  else if (event.key === 'ArrowLeft') next = (active + length - 1) % length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = length - 1;
  else return;
  event.preventDefault();
  onSelect(next);
  tabs[next]?.focus();
}

function HardwareLab() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const board = BOARDS[active];

  return (
    <section className={styles.section} id="systems">
      <div className={styles.container}>
        <SectionHead
          title="Flight control, up close"
          lede="Flight controllers run the control software, and electronic speed controllers drive the motors. Compare the ELARA boards that run ANSA and the ARIA 50A speed controller that feeds live current readings back to the flight controller. Open the specifications to see what fits your build."
        />

        <div>
        <div className={`du-tabs du-tabs-box ${styles.tabs} ${styles.hardwareTabs}`} role="tablist" aria-label="Hardware" onKeyDown={(event) => selectTab(event, active, BOARDS.length, tabRefs.current, setActive)}>
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
                className={styles.labImage}
                src={board.image.src}
                alt={board.image.alt}
                width={board.image.width}
                height={board.image.height}
                decoding="async"
                loading="lazy"
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
                <Icon name="circle-arrow-right" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  );
}

function RealityEngine() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = SCENARIOS[active];

  return (
    <section className={styles.section} id="simulation">
      <div className={styles.container}>
        <SectionHead title="Prove it before deployment" lede="Explore three of Certanity’s 24+ simulation domains with Spaceborn’s existing demonstration footage." />
        <div className={`du-tabs du-tabs-box ${styles.tabs} ${styles.scenarioTabs}`} role="tablist" aria-label="Simulation scenarios"
          onKeyDown={(event) => selectTab(event, active, SCENARIOS.length, tabs.current, setActive)}>
          {SCENARIOS.map((scene, i) => (
            <button key={scene.id} id={`sim-tab-${scene.id}`} type="button" role="tab"
              ref={(element) => { tabs.current[i] = element; }}
              className={`du-tab ${styles.tab} ${i === active ? 'du-tab-active' : ''}`}
              aria-selected={i === active} aria-controls="sim-panel" tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}>
              {['GPS-denied', 'Swarm', 'Industrial inspection'][i]}
            </button>
          ))}
        </div>
        <div className={`du-card du-card-border ${styles.engine}`} role="tabpanel" id="sim-panel" aria-labelledby={`sim-tab-${scenario.id}`}>
          <div className={styles.viewport}>
            <LazyVideo key={scenario.id} className={styles.viewportVideo} controls muted playsInline preload="none"
              poster={scenario.video.poster} aria-label={scenario.title}>
              <source src={scenario.video.src} type="video/mp4" />
            </LazyVideo>
          </div>
          <div className={`du-card-body ${styles.scenarioCopy}`}>
            <h3>{scenario.title}</h3>
            <p>{scenario.desc}</p>
            <dl className={styles.readouts}>
              {scenario.readouts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>
        </div>
        <ul className={styles.partners} aria-label="Key customers and partners">
          {PARTNERS.map((partner) => (
            <li key={partner.name}>
              {partner.logo ? <img src={partner.logo} alt={partner.name} width={partner.width} height={partner.height}
                loading="lazy" decoding="async" style={{ height: `${partner.em}em` }} /> : partner.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PLATFORM_LAYERS = [
  { name: 'AI', icon: 'brain', desc: 'Turn operator intent into actions the machine can execute.' },
  { name: 'Software', icon: 'code', desc: 'Run the control logic and process the data from onboard sensors.' },
  { name: 'Simulation', icon: 'layer-group', desc: 'Repeat the same scenario to see how a change affects performance.' },
  { name: 'Hardware', icon: 'microchip', desc: 'Connect controllers, onboard compute, and motors on the physical machine.' },
];

function TheProblem() {
  return (
    <section className={styles.section} aria-label="The problem Spaceborn solves">
      <div className={styles.container}>
        <SectionHead
          title="How the stack fits together"
          lede="A drone, a rover, and an industrial robot do different jobs, yet their teams face the same integration work. They have to connect sensors and controllers, adapt software to the machine, and set up tests to see how it behaves. When these pieces live in separate tools, each new machine can mean rebuilding much of the same stack."
        />
        <div className={styles.platformDiagram}>
          <ul className={styles.platformLayers}>
            {PLATFORM_LAYERS.map(({ name, icon, desc }) => (
              <li key={name} className={`du-card du-card-side du-card-border ${styles.platformLayer}`}>
                <span className={styles.platformIcon} aria-hidden="true">
                  <Icon name={icon} />
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
            <h3 className="du-card-title">One connected Spaceborn platform</h3>
            <p>Spaceborn brings those four layers into a single workflow. Test how the control software responds in a simulated environment, then carry that work forward as you validate it on real hardware. Your team can spend more time on what makes the machine unique.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={styles.closing} id="simulators-hub">
      <span id="thoth" />
      <div className={`${styles.container} ${styles.closingInner}`}>
        <div>
          <h2 className={styles.closingTitle}>Build with Spaceborn.</h2>
          <p className={`${styles.sectionLede} ${styles.closingLede}`}>
            Tell our engineering team what you’re building and where you need help, whether you’re choosing
            hardware, planning simulation tests, or preparing a prototype for field trials.
          </p>
        </div>
        <motion.a
          href="https://www.linkedin.com/in/adarsh-kumar-ab8111377?originalSubdomain=in"
          target="_blank"
          rel="noopener noreferrer"
          className={`du-btn du-btn-primary ${styles.ctaButton} ${styles.ctaPrimary}`}
          whileTap={PRESS}
          transition={SPRING}
        >
          Contact engineering <Icon name="arrow-right" />
        </motion.a>
      </div>
    </section>
  );
}

export default function HomePage({ fontClassName }: { fontClassName: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${styles.page} ${fontClassName}`}>
        <Navbar linkArrow={<Icon name="arrow-right" />} />

        <main data-theme="spaceborn">
          <Hero />
          <WhySpaceborn />
          <ProductGrid />
          <RealityEngine />
          <HardwareLab />
          <TheProblem />
          <Closing />
        </main>

        <Footer />
      </div>

    </MotionConfig>
  );
}
