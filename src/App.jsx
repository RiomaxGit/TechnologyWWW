import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

/* ─────────────────────────────────────────────
   THEME PALETTES
───────────────────────────────────────────── */
const THEME_PALETTES = {
  spring: {
    name: "Spring", glyph: "◉",
    pageBg: "#070908", heroRadial: "#182018", sectionGlow: "#1a2818",
    cardBg: "#080a08", border: "#1e2a1e", ring: "#2a3a2a",
    primary: "#a8c090", secondary: "#c4d8a8", muted: "#6a8858", faint: "#3a5a2a",
    textBright: "#e8e4d8", textBody: "#7a8a70", textDim: "#4a5a44", textGhost: "#2a3a2a",
    cursorDot: "#a8c090", cursorRing: "rgba(168,192,144,0.35)",
    footerBorder: "#1a2a1a", selection: "rgba(168,192,144,0.22)",
  },
  summer: {
    name: "Summer", glyph: "◎",
    pageBg: "#060808", heroRadial: "#0e1c10", sectionGlow: "#0e1e10",
    cardBg: "#070908", border: "#162216", ring: "#1a2e1a",
    primary: "#4caa5e", secondary: "#80cc88", muted: "#2a7a38", faint: "#1a4a22",
    textBright: "#ddeedd", textBody: "#5a7a5e", textDim: "#2e4a32", textGhost: "#1a2e1e",
    cursorDot: "#4caa5e", cursorRing: "rgba(76,170,94,0.32)",
    footerBorder: "#162216", selection: "rgba(76,170,94,0.2)",
  },
  fall: {
    name: "Fall", glyph: "◈",
    pageBg: "#090806", heroRadial: "#201408", sectionGlow: "#201808",
    cardBg: "#0a0806", border: "#2a1e10", ring: "#3a2010",
    primary: "#c87840", secondary: "#e0a060", muted: "#8a5020", faint: "#4a2c10",
    textBright: "#edddd0", textBody: "#8a7060", textDim: "#5a4030", textGhost: "#3a2818",
    cursorDot: "#c87840", cursorRing: "rgba(200,120,64,0.32)",
    footerBorder: "#2a1e10", selection: "rgba(200,120,64,0.2)",
  },
  winter: {
    name: "Winter", glyph: "◇",
    pageBg: "#060708", heroRadial: "#101418", sectionGlow: "#101418",
    cardBg: "#07080a", border: "#1a1e24", ring: "#20262e",
    primary: "#8aabcc", secondary: "#a8c4e0", muted: "#506a88", faint: "#283848",
    textBright: "#d8e0e8", textBody: "#6a7a8a", textDim: "#3a4858", textGhost: "#202830",
    cursorDot: "#8aabcc", cursorRing: "rgba(138,171,204,0.32)",
    footerBorder: "#1a1e24", selection: "rgba(138,171,204,0.2)",
  },
};

const ThemeContext = createContext(THEME_PALETTES.spring);
const useTheme = () => useContext(ThemeContext);

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const up = () => setW(window.innerWidth);
    window.addEventListener("resize", up);
    return () => window.removeEventListener("resize", up);
  }, []);
  return w;
}

/* ─────────────────────────────────────────────
   SEASONS (for emblem leaf)
───────────────────────────────────────────── */
const SEASONS = [
  { name:"Spring", leafFill:"#6dbf3e", leafFill2:"#9edd60", leafEdge:"#3a7a18", veinColor:"#1e5010", veinColor2:"#c8f080", veinOpacity:0.55, stemColor:"#4a7828", stemHighlight:"#a8e060", texture2:"#b8f070", ringColor:"#8ecc60" },
  { name:"Summer", leafFill:"#1e6e22", leafFill2:"#2a8830", leafEdge:"#0e4414", veinColor:"#d8f8b0", veinColor2:"#a0e080", veinOpacity:0.45, stemColor:"#2a5018", stemHighlight:"#50a840", texture2:"#40a848", ringColor:"#3a9840" },
  { name:"Fall",   leafFill:"#c84818", leafFill2:"#e86820", leafEdge:"#7a1808", veinColor:"#fce090", veinColor2:"#f8b840", veinOpacity:0.58, stemColor:"#703010", stemHighlight:"#e89040", texture2:"#f09040", ringColor:"#d86828" },
  { name:"Winter", leafFill:"#6a4e30", leafFill2:"#7e6040", leafEdge:"#3e2818", veinColor:"#c0a880", veinColor2:"#a08868", veinOpacity:0.42, stemColor:"#3e2e1c", stemHighlight:"#907050", texture2:"#8a6848", ringColor:"#7a5e3a" },
];

function getMapleLeafPath() {
  return `M 0,-85 C 3,-76 12,-68 8,-58 L 24,-66 C 20,-54 11,-46 16,-38 L 40,-50 C 36,-34 20,-22 26,-12 L 56,-22 C 52,-10 36,0 40,10 L 68,2 C 62,16 44,22 42,32 L 62,44 C 52,50 36,48 34,58 L 44,68 C 32,68 16,62 10,68 L 14,80 C 6,76 2,70 0,66 C -2,70 -6,76 -14,80 L -10,68 C -16,62 -32,68 -44,68 L -34,58 C -36,48 -52,50 -62,44 L -42,32 C -44,22 -62,16 -68,2 L -40,10 C -36,0 -52,-10 -56,-22 L -26,-12 C -20,-22 -36,-34 -40,-50 L -16,-38 C -11,-46 -20,-54 -24,-66 L -8,-58 C -12,-68 -3,-76 0,-85 Z`;
}

function MapleLeaf({ season, growPhase }) {
  const s = SEASONS[season];
  const sid = `tleaf${season}`;
  const P = getMapleLeafPath();
  const veins = [
    { d:"M 0,60 L 0,-70", w:1.8, len:132 },
    { d:"M 0,30 C -12,14 -28,2 -44,8", w:1.2, len:60 },
    { d:"M 0,30 C 12,14 28,2 44,8", w:1.2, len:60 },
    { d:"M -4,4 C -18,-10 -32,-20 -44,-16", w:0.9, len:52 },
    { d:"M 4,4 C 18,-10 32,-20 44,-16", w:0.9, len:52 },
    { d:"M -2,-16 C -12,-28 -20,-38 -22,-50", w:0.75, len:44 },
    { d:"M 2,-16 C 12,-28 20,-38 22,-50", w:0.75, len:44 },
  ];
  return (
    <g>
      <defs>
        <radialGradient id={`lg${sid}`} cx="38%" cy="22%" r="75%">
          <stop offset="0%" stopColor={s.texture2} />
          <stop offset="30%" stopColor={s.leafFill2} />
          <stop offset="70%" stopColor={s.leafFill} />
          <stop offset="100%" stopColor={s.leafEdge} />
        </radialGradient>
        <linearGradient id={`sg${sid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={s.leafEdge} stopOpacity="0.8" />
          <stop offset="40%" stopColor={s.stemColor} />
          <stop offset="100%" stopColor={s.stemHighlight} stopOpacity="0.6" />
        </linearGradient>
        <filter id={`sh${sid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor={s.leafEdge} floodOpacity="0.55" />
        </filter>
      </defs>
      <path d={P} fill={`url(#lg${sid})`} filter={`url(#sh${sid})`}
        style={{ opacity: growPhase >= 2 ? 1 : 0, transform: growPhase >= 2 ? "scale(1)" : "scale(0.04)", transformOrigin: "0px -85px", transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.6s cubic-bezier(0.16,1,0.3,1)" }} />
      {veins.map((v, i) => (
        <path key={i} d={v.d} stroke={i < 3 ? s.veinColor : s.veinColor2} strokeWidth={v.w} strokeLinecap="round" fill="none" strokeDasharray={v.len}
          style={{ strokeDashoffset: growPhase >= 4 ? 0 : v.len, opacity: s.veinOpacity, transition: `stroke-dashoffset ${0.55+i*0.055}s cubic-bezier(0.16,1,0.3,1) ${0.04*i}s` }} />
      ))}
      <path d={`M 0,66 C -1,74 -1.5,82 -1,89 C -0.5,94 0.5,94 1,89 C 1.5,82 1,74 0,66 Z`} fill={`url(#sg${sid})`}
        style={{ opacity: growPhase >= 2 ? 0.95 : 0, transform: growPhase >= 2 ? "scaleY(1)" : "scaleY(0)", transformOrigin: "0px 66px", transition: "opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)" }} />
    </g>
  );
}

function WildwoodsEmblem({ size = 140, animate = false, mini = false }) {
  const [growPhase, setGrowPhase] = useState(0);
  const [season, setSeason] = useState(1);
  const leafRef = useRef(null);
  const rafRef = useRef(null);
  const degRef = useRef(0);
  const firedRef = useRef(false);
  const s = SEASONS[season];
  const id = mini ? "tmi" : "thd";

  useEffect(() => {
    if (!animate) return;
    const ts = [
      setTimeout(() => setGrowPhase(1), 100),
      setTimeout(() => setGrowPhase(2), 300),
      setTimeout(() => setGrowPhase(3), 700),
      setTimeout(() => setGrowPhase(4), 1000),
      setTimeout(() => setGrowPhase(5), 1400),
      setTimeout(() => setGrowPhase(6), 1800),
      setTimeout(() => setGrowPhase(7), 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, [animate]);

  useEffect(() => {
    if (!animate || growPhase < 7) return;
    const tick = () => {
      degRef.current = (degRef.current + 0.5) % 360;
      const scaleX = Math.cos((degRef.current * Math.PI) / 180);
      if (leafRef.current) leafRef.current.style.transform = `scaleX(${scaleX})`;
      const nearEdge = Math.abs(scaleX) < 0.08;
      if (nearEdge && !firedRef.current) { firedRef.current = true; setSeason(p => (p + 1) % 4); }
      if (!nearEdge) firedRef.current = false;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, growPhase]);

  return (
    <svg width={size} height={size} viewBox="-130 -130 260 260" fill="none"
      style={{ overflow: "hidden", userSelect: "none", flexShrink: 0 }}>
      <defs>
        <radialGradient id={`bg${id}`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#1a2218" />
          <stop offset="55%" stopColor="#0d1210" />
          <stop offset="100%" stopColor="#070908" />
        </radialGradient>
        <linearGradient id={`rg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={s.ringColor} />
          <stop offset="50%" stopColor={s.texture2} />
          <stop offset="100%" stopColor={s.ringColor} />
        </linearGradient>
      </defs>
      <circle cx="0" cy="0" r="125" fill={`url(#bg${id})`} style={{ opacity: growPhase >= 1 ? 1 : 0, transition: "opacity 0.5s" }} />
      <circle cx="0" cy="0" r="122" stroke={`url(#rg${id})`} strokeWidth="0.7" strokeDasharray="2.5 8"
        style={{ opacity: growPhase >= 1 ? 0.5 : 0, transition: "opacity 0.6s" }} />
      <circle cx="0" cy="0" r="104" stroke={s.ringColor} strokeWidth="1"
        style={{ opacity: growPhase >= 1 ? 0.14 : 0, transition: "opacity 0.5s" }} />
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <circle key={i} cx={104*Math.cos(rad)} cy={104*Math.sin(rad)} r={2.8} fill={s.texture2}
          style={{ opacity: growPhase >= 1 ? 0.72 : 0, transition: `opacity 0.4s ${0.04*i}s ease` }} />;
      })}
      <g ref={leafRef} style={{ transformOrigin: "0px 0px", willChange: "transform" }}>
        <g transform="scale(0.85) translate(0, -9)">
          <MapleLeaf season={season} growPhase={growPhase} />
        </g>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const COMMUNITY_PROJECTS = [
  {
    id: "elementos", name: "Elementos", tagline: "The periodic table, reimagined",
    description: "A visual web application built for students to better study, explore, and understand all 118 elements. Rich atomic data, 3D Bohr models, electron configurations, and beautiful interactive visualisations — all free, always.",
    icon: "⬡", accent: "#7ec8a0",
    tags: ["Education", "Web App", "Open Source"],
    stat: { label: "Elements", value: "118" },
    links: { live: "#", github: "#" },
  },
  {
    id: "loadervault", name: "LoaderVault", tagline: "A universe of loading states",
    description: "A curated repository of 200+ advanced, production-ready loaders. Export in React, Vue, CSS, or SCSS in seconds. No sign-up, no paywall — just beautiful loading states for every project.",
    icon: "◎", accent: "#a0b8e8",
    tags: ["Developer Tools", "Component Library", "Multi-framework"],
    stat: { label: "Loaders", value: "200+" },
    links: { live: "#", github: "#" },
  },
  {
    id: "hushnotes", name: "HushNotes", tagline: "Your thoughts, fully offline",
    description: "An offline-first application to store confidential documents with exceptional design and full datatype support — rich text, code, tables, images, and encrypted at rest. No server. No cloud. No compromise.",
    icon: "◈", accent: "#c8a8d8",
    tags: ["Privacy", "Desktop App", "Electron"],
    stat: { label: "Storage", value: "Local" },
    links: { live: "#", github: "#" },
  },
  {
    id: "finboard", name: "FinBoard", tagline: "Clear finances, clear mind",
    description: "A personal financial dashboard to track income, expenses, savings targets, and net worth — visualised cleanly across time. Built for people who want clarity, not complexity.",
    icon: "◇", accent: "#e8c880",
    tags: ["Finance", "Dashboard", "Web App"],
    stat: { label: "Charts", value: "12+" },
    links: { live: "#", github: "#" },
  },
  {
    id: "pantone", name: "Pantone Mixer", tagline: "Colour science for the real world",
    description: "Built for Home Depot stores. A comprehensive tool with 5,000+ Pantone colours, mixing formulas, analytics dashboards, and paint estimators — helping staff and customers get the exact colour they need, every time.",
    icon: "□", accent: "#e88080",
    tags: ["Retail Tool", "Colour Science", "Analytics"],
    stat: { label: "Colours", value: "5,000+" },
    links: { live: "#", github: "#" },
  },
];

const PREMIUM_PRODUCTS = [
  {
    id: "testflow", name: "TestFlow", tagline: "AI-powered test management",
    description: "The complete QA command centre. TestFlow lets teams create, manage, execute, and report test scenarios with AI assistance — and automates the full test lifecycle from requirements to regression.",
    icon: "✦", accent: "#7ab8e8", badge: "Flagship",
    features: [
      "AI test scenario generation from requirements",
      "Visual test case builder & execution runner",
      "Real-time reporting dashboards & burndown charts",
      "One-click test automation pipeline integration",
      "Defect tracking with root cause analysis",
      "Role-based access for QA, dev & PM teams",
    ],
    stat: { label: "Test Cases Managed", value: "1M+" },
    cta: "Request Early Access", href: "#",
  },
];

const SERVICES = [
  { icon: "⬡", title: "AI Integration", description: "Embedding intelligence into your existing workflows — from LLM-powered features to autonomous agents that augment your team.", tags: ["LLM", "Agents", "API"] },
  { icon: "◈", title: "QA & Test Strategy", description: "End-to-end quality engineering: test architecture, automation frameworks, coverage audits, and CI/CD pipeline integration.", tags: ["Automation", "Strategy", "CI/CD"] },
  { icon: "◎", title: "Product Engineering", description: "Full-stack product builds from zero — scoped, designed, shipped. Specialising in tools, dashboards, and data-intensive applications.", tags: ["Full-Stack", "React", "Node"] },
  { icon: "◇", title: "Developer Tooling", description: "Custom internal tools, component libraries, and developer experience improvements that help your engineering team move faster.", tags: ["DX", "Components", "Internal Tools"] },
  { icon: "△", title: "Tech Consulting", description: "Architecture reviews, stack selection, build-vs-buy decisions, and technology roadmapping for startups and growth-stage companies.", tags: ["Advisory", "Architecture", "Roadmap"] },
  { icon: "□", title: "Community Builds", description: "Pro-bono technology projects for non-profits, local businesses, and community organisations that deserve exceptional software.", tags: ["Pro-bono", "Social Impact", "Community"] },
];

const PREMIUM_CLIENTS = [
  { name: "Home Depot", sector: "Retail", note: "Pantone Mixer · Colour analytics platform", initial: "HD" },
  { name: "Velocity OTT", sector: "Streaming", note: "QA infrastructure · Release automation", initial: "VO" },
  { name: "NexCart", sector: "E-Commerce", note: "Checkout QA · Performance testing", initial: "NC" },
  { name: "PulsePoint POS", sector: "Hospitality", note: "End-to-end POS test coverage", initial: "PP" },
  { name: "Meridian Edu", sector: "EdTech", note: "Platform QA · Accessibility audit", initial: "ME" },
  { name: "Ironwood Capital", sector: "Finance", note: "FinBoard · Custom dashboards", initial: "IC" },
];

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
function buildGlobalStyles(t) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${t.pageBg}; color: ${t.textBright}; -webkit-font-smoothing: antialiased; overflow-x: hidden; transition: background 0.8s ease, color 0.8s ease; }
  ::selection { background: ${t.selection}; color: ${t.textBright}; }
  @media (min-width: 768px) { html { cursor: none; } a, button { cursor: none; } }

  @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
  @keyframes pulseDot { 0%,100%{opacity:0.5;box-shadow:0 0 6px currentColor} 50%{opacity:1;box-shadow:0 0 14px currentColor} }
  @keyframes techFloat { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(6px,-22px) scale(0.65)} }
  @keyframes fadeInModal { from{opacity:0} to{opacity:1} }
  @keyframes slideUpModal { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  /* Hide scrollbar on rail */
  .community-rail::-webkit-scrollbar { display: none; }
  .community-rail { -ms-overflow-style: none; scrollbar-width: none; }
  `;
}

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
function Cursor() {
  const t = useTheme();
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.current.x - 15}px,${ringPos.current.y - 15}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,zIndex:9999,width:6,height:6,borderRadius:"50%",background:t.cursorDot,pointerEvents:"none",willChange:"transform",transition:"background 0.8s ease" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,zIndex:9998,width:30,height:30,borderRadius:"50%",border:`1px solid ${t.cursorRing}`,pointerEvents:"none",willChange:"transform",transition:"border-color 0.8s ease" }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
function TechParticles() {
  const t = useTheme();
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.6, speed: 16 + Math.random() * 26, delay: Math.random() * 12, opacity: 0.05 + Math.random() * 0.16,
    }))
  ).current;
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background: p.id % 3 === 0 ? "#7ab8e8" : p.id % 3 === 1 ? t.primary : t.secondary,
          opacity:p.opacity,
          animation:`techFloat ${p.speed}s ${p.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function NavBar({ themeName, onThemeChange }) {
  const t = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:7000,
      padding: isMobile ? "12px 16px" : "14px 32px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? `${t.pageBg}ee` : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
      transition:"all 0.4s ease",
    }}>
      <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <WildwoodsEmblem size={isMobile ? 28 : 34} mini animate />
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"0.78rem":"0.9rem", letterSpacing:"0.22em", fontWeight:500, color:t.primary, textTransform:"uppercase", transition:"color 0.6s ease" }}>WildWoodsWay</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.55rem", letterSpacing:"0.34em", color:t.muted, textTransform:"uppercase", lineHeight:1, transition:"color 0.6s ease" }}>Technology</div>
        </div>
      </a>
      {!isMobile && (
        <div style={{ display:"flex", alignItems:"center", gap:28 }}>
          {["Community","Products","Clients","Services"].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.28em", color:t.textDim, textTransform:"uppercase", textDecoration:"none", transition:"color 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.color = t.primary; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textDim; }}
            >{label}</a>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {Object.keys(THEME_PALETTES).map(key => {
          const p = THEME_PALETTES[key];
          return (
            <button key={key} onClick={() => onThemeChange(key)} title={p.name}
              style={{ width:10, height:10, borderRadius:"50%", background:p.primary, border:`1.5px solid ${themeName===key?p.primary:"transparent"}`, outline:themeName===key?`2px solid ${p.primary}44`:"none", cursor:"pointer", padding:0, transition:"all 0.3s ease", boxShadow:themeName===key?`0 0 8px ${p.primary}`:"none" }} />
          );
        })}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, sub, accent }) {
  const [ref, inView] = useInView(0.08);
  const t = useTheme();
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  return (
    <div ref={ref} style={{ textAlign:"center", marginBottom:isMobile?40:64, opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(24px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, letterSpacing:"0.44em", color:accent||t.primary, textTransform:"uppercase", marginBottom:14, opacity:0.8, transition:"color 0.8s ease" }}>{eyebrow}</p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"2rem":"clamp(2.2rem,5vw,3.6rem)", fontWeight:300, letterSpacing:"0.04em", color:t.textBright, margin:"0 0 16px", lineHeight:1.05, transition:"color 0.8s ease" }}>{title}</h2>
      {sub && <p style={{ fontFamily:"'EB Garamond',serif", fontSize:isMobile?"0.9rem":"1.02rem", color:t.textDim, maxWidth:460, margin:"0 auto 24px", lineHeight:1.8, fontStyle:"italic", padding:isMobile?"0 8px":0, transition:"color 0.8s ease" }}>{sub}</p>}
      <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center" }}>
        <div style={{ width:40, height:1, background:`linear-gradient(to right,transparent,${t.textDim}50)` }} />
        <span style={{ color:accent||t.ring, fontSize:8 }}>✦</span>
        <div style={{ width:40, height:1, background:`linear-gradient(to left,transparent,${t.textDim}50)` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function TechHero() {
  const t = useTheme();
  const [phase, setPhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const fade = Math.max(0, 1 - scrollY / 500);

  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"100px 20px 60px" }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 80% 60% at 50% 40%,${t.heroRadial} 0%,${t.pageBg} 70%)`, transition:"background 0.8s ease" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${t.primary}08 1px,transparent 1px),linear-gradient(90deg,${t.primary}08 1px,transparent 1px)`, backgroundSize:"60px 60px", maskImage:"radial-gradient(ellipse 80% 70% at 50% 50%,black 0%,transparent 100%)", WebkitMaskImage:"radial-gradient(ellipse 80% 70% at 50% 50%,black 0%,transparent 100%)", pointerEvents:"none" }} />
      <TechParticles />

      <div style={{ position:"relative", zIndex:2, textAlign:"center", opacity:fade, width:"100%", maxWidth:760 }}>
        {/* Emblem */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:isMobile?24:32, opacity:phase>=1?1:0, transform:phase>=1?"scale(1) translateY(0)":"scale(0.6) translateY(30px)", transition:"all 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
          <WildwoodsEmblem size={isMobile?110:140} animate={phase>=1} />
        </div>

        {/* Eyebrow label */}
        <div style={{ opacity:phase>=1?1:0, transform:phase>=1?"translateY(0)":"translateY(16px)", transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s", marginBottom:10 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"0.6rem":"0.72rem", letterSpacing:"0.48em", color:t.primary, textTransform:"uppercase", opacity:0.75, transition:"color 0.8s ease" }}>WildWoodsWay · Technology</span>
        </div>

        {/* Heading — NO gradient text, avoids the solid-block bug */}
        <h1 style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:isMobile?"clamp(2.4rem,8vw,3.2rem)":"clamp(3rem,7vw,5rem)",
          fontWeight:300, letterSpacing:"0.02em",
          color:t.textBright, margin:"0 0 16px", lineHeight:1.1,
          opacity:phase>=2?1:0,
          transform:phase>=2?"translateY(0)":"translateY(24px)",
          transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.15s, color 0.8s ease",
        }}>
          Building the tools<br />
          {/* Safe italic accent — no webkit gradient clip */}
          <em style={{ fontStyle:"italic", fontWeight:300, color:t.secondary, transition:"color 0.8s ease" }}>of tomorrow.</em>
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily:"'EB Garamond',serif", fontSize:isMobile?"0.95rem":"1.1rem",
          color:t.textDim, lineHeight:1.85, maxWidth:520, margin:"0 auto 32px",
          fontStyle:"italic", opacity:phase>=2?1:0,
          transform:phase>=2?"translateY(0)":"translateY(16px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s, color 0.8s ease",
        }}>
          From free community tools to enterprise-grade AI platforms — software built
          with the same quiet intention as the forest: deep roots, patient growth.
        </p>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center", opacity:phase>=3?1:0, transition:"opacity 0.8s ease 0.4s" }}>
          <div style={{ width:50, height:1, background:`linear-gradient(to right,transparent,${t.primary}44)` }} />
          <span style={{ color:t.secondary, fontSize:8, opacity:0.7 }}>✦</span>
          <div style={{ width:50, height:1, background:`linear-gradient(to left,transparent,${t.primary}44)` }} />
        </div>

        {/* Scroll cue */}
        <div style={{ marginTop:40, opacity:phase>=3?0.55:0, transition:"opacity 1s 0.6s", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.32em", color:t.textDim, textTransform:"uppercase" }}>Explore</span>
          <div style={{ width:1, height:28, background:`linear-gradient(to bottom,${t.textDim},transparent)`, animation:"scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMMUNITY CARD (used in rail & modal)
───────────────────────────────────────────── */
function CommunityCard({ project, isRail = false }) {
  const [hovered, setHovered] = useState(false);
  const t = useTheme();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative",
        width: isRail ? 320 : "100%",
        minWidth: isRail ? 320 : undefined,
        flexShrink: isRail ? 0 : undefined,
        borderRadius:18,
        padding:"28px 26px 30px",
        background:t.cardBg,
        border:`1px solid ${hovered ? project.accent+"55" : t.border}`,
        overflow:"hidden",
        cursor:"default",
        transition:"border-color 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
        transform:hovered?"translateY(-4px)":"translateY(0)",
        boxShadow:hovered?`0 24px 60px rgba(0,0,0,0.55),0 0 0 1px ${project.accent}18`:"0 2px 14px rgba(0,0,0,0.3)",
        display:"flex", flexDirection:"column",
        height: isRail ? "100%" : "auto",
      }}
    >
      {/* Ambient glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 50% at 20% 20%,${project.accent}10 0%,transparent 65%)`, opacity:hovered?1:0.4, transition:"opacity 0.5s ease", pointerEvents:"none" }} />

      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", color:project.accent, lineHeight:1, display:"block", transform:hovered?"scale(1.12) rotate(-5deg)":"scale(1)", transition:"transform 0.4s ease" }}>{project.icon}</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.55rem", letterSpacing:"0.3em", color:project.accent, textTransform:"uppercase", padding:"3px 10px", border:`1px solid ${project.accent}30`, borderRadius:20, background:`${project.accent}0a`, opacity:0.85 }}>Free · Open</span>
      </div>

      {/* Name + tagline */}
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:400, letterSpacing:"0.02em", color:t.textBright, margin:"0 0 3px", lineHeight:1.1, transition:"color 0.8s ease" }}>{project.name}</h3>
      <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.82rem", color:project.accent, fontStyle:"italic", margin:"0 0 14px", opacity:0.85, lineHeight:1.3 }}>{project.tagline}</p>

      <div style={{ height:1, background:`linear-gradient(to right,${project.accent}20,transparent)`, marginBottom:14 }} />

      {/* Description */}
      <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.92rem", color:t.textBody, lineHeight:1.75, margin:"0 0 18px", flexGrow:1, transition:"color 0.8s ease" }}>{project.description}</p>

      {/* Tags */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9.5, letterSpacing:"0.16em", textTransform:"uppercase", color:project.accent, opacity:0.7, border:`1px solid ${project.accent}22`, borderRadius:20, padding:"2px 10px", background:`${project.accent}08` }}>{tag}</span>
        ))}
      </div>

      {/* Stat */}
      <div style={{ display:"inline-flex", alignItems:"baseline", gap:7, padding:"8px 14px", borderRadius:10, border:`1px solid ${project.accent}18`, background:`${project.accent}07`, marginBottom:20 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", color:project.accent, lineHeight:1 }}>{project.stat.value}</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.2em", color:"#4a5a44", textTransform:"uppercase" }}>{project.stat.label}</span>
      </div>

      {/* Links */}
      <div style={{ display:"flex", gap:10 }}>
        <a href={project.links.live} target="_blank" rel="noopener noreferrer"
          style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 16px", borderRadius:12, border:`1px solid ${project.accent}`, background:`${project.accent}12`, color:project.accent, fontFamily:"'Cormorant Garamond',serif", fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.25s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background=project.accent; e.currentTarget.style.color="#060808"; }}
          onMouseLeave={e => { e.currentTarget.style.background=`${project.accent}12`; e.currentTarget.style.color=project.accent; }}
        >Live ↗</a>
        <a href={project.links.github} target="_blank" rel="noopener noreferrer"
          style={{ padding:"10px 16px", borderRadius:12, border:`1px solid ${t.border}`, background:"none", color:t.textDim, fontFamily:"'Cormorant Garamond',serif", fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.25s ease" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=t.muted; e.currentTarget.style.color=t.textBody; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.textDim; }}
        >GitHub</a>
      </div>

      {/* Bottom accent bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(to right,transparent,${project.accent},transparent)`, opacity:hovered?1:0, transform:hovered?"scaleX(1)":"scaleX(0.2)", transition:"opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIEW ALL MODAL
───────────────────────────────────────────── */
function ViewAllModal({ onClose }) {
  const t = useTheme();
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(10px)", display:"flex", flexDirection:"column", animation:"fadeInModal 0.25s ease" }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:isMobile?"16px 20px":"20px 40px", borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9.5, letterSpacing:"0.38em", color:t.primary, textTransform:"uppercase", marginBottom:4, opacity:0.75 }}>Community · Open Source</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"1.4rem":"2rem", fontWeight:300, color:t.textBright, letterSpacing:"0.03em" }}>All Projects</h2>
        </div>
        <button
          onClick={onClose}
          style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${t.border}`, background:"none", color:t.textDim, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=t.primary; e.currentTarget.style.color=t.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=t.border; e.currentTarget.style.color=t.textDim; }}
        >×</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:isMobile?"20px 16px":"32px 40px" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr" : winWidth < 1100 ? "repeat(2,1fr)" : "repeat(3,1fr)",
          gap:20,
          maxWidth:1200, margin:"0 auto",
        }}>
          {COMMUNITY_PROJECTS.map((p, i) => (
            <div key={p.id} style={{ animation:`slideUpModal 0.5s cubic-bezier(0.16,1,0.3,1) ${i*0.07}s both` }}>
              <CommunityCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMMUNITY SECTION — single horizontal rail
───────────────────────────────────────────── */
function CommunitySection() {
  const t = useTheme();
  const [headerRef, headerInView] = useInView(0.08);
  const [railRef, railInView] = useInView(0.05);
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  const CARD_W = isMobile ? 280 : 340;
  const GAP = 20;

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  const VISIBLE = COMMUNITY_PROJECTS.slice(0, 5);

  return (
    <section id="community" style={{ position:"relative", padding:isMobile?"80px 0 80px":"120px 0 110px", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:1, background:`linear-gradient(to right,transparent,${t.primary}28,transparent)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 65% 50% at 80% 30%,${t.sectionGlow} 0%,transparent 70%)`, transition:"background 0.8s ease" }} />

      <div style={{ maxWidth:1180, margin:"0 auto", position:"relative", padding:"0 20px" }}>

        {/* Header */}
        <div ref={headerRef} style={{ opacity:headerInView?1:0, transform:headerInView?"translateY(0)":"translateY(24px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
          <SectionHeader
            eyebrow="Community · Open Source"
            title="Built for the Community"
            sub="Free tools and applications crafted with care — available to anyone, forever."
          />
        </div>

        {/* Free badge */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:isMobile?32:48 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 22px", borderRadius:30, border:`1px solid ${t.primary}30`, background:`${t.primary}08` }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:t.primary, boxShadow:`0 0 8px ${t.primary}` }} />
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.28em", color:t.primary, textTransform:"uppercase", opacity:0.85 }}>All projects free · No sign-up required</span>
          </div>
        </div>

        {/* Rail wrapper */}
        <div ref={railRef} style={{ position:"relative", opacity:railInView?1:0, transform:railInView?"translateY(0)":"translateY(32px)", transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>

          {/* Left chevron */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{
              position:"absolute", left:isMobile?-4:-20, top:"50%", transform:"translateY(-50%)",
              zIndex:10, width:isMobile?38:46, height:isMobile?38:46, borderRadius:"50%",
              border:`1px solid ${canLeft ? t.primary+"66" : t.border}`,
              background: canLeft ? `${t.cardBg}f0` : `${t.cardBg}88`,
              backdropFilter:"blur(10px)",
              color: canLeft ? t.primary : t.textGhost,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor: canLeft ? "pointer" : "default",
              transition:"all 0.3s ease",
              opacity: canLeft ? 1 : 0.3,
              boxShadow: canLeft ? `0 0 20px ${t.pageBg}` : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Right chevron */}
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{
              position:"absolute", right:isMobile?-4:-20, top:"50%", transform:"translateY(-50%)",
              zIndex:10, width:isMobile?38:46, height:isMobile?38:46, borderRadius:"50%",
              border:`1px solid ${canRight ? t.primary+"66" : t.border}`,
              background: canRight ? `${t.cardBg}f0` : `${t.cardBg}88`,
              backdropFilter:"blur(10px)",
              color: canRight ? t.primary : t.textGhost,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor: canRight ? "pointer" : "default",
              transition:"all 0.3s ease",
              opacity: canRight ? 1 : 0.3,
              boxShadow: canRight ? `0 0 20px ${t.pageBg}` : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Fade edges */}
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:isMobile?24:40, zIndex:5, background:`linear-gradient(to right,${t.pageBg},transparent)`, pointerEvents:"none" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:isMobile?24:40, zIndex:5, background:`linear-gradient(to left,${t.pageBg},transparent)`, pointerEvents:"none" }} />

          {/* Scrollable rail */}
          <div
            ref={scrollRef}
            className="community-rail"
            style={{
              display:"flex",
              gap:GAP,
              overflowX:"auto",
              overflowY:"visible",
              padding:`10px ${isMobile?20:40}px 16px`,
              scrollSnapType:"x mandatory",
              WebkitOverflowScrolling:"touch",
            }}
          >
            {VISIBLE.map((project) => (
              <div key={project.id} style={{ scrollSnapAlign:"start", flexShrink:0, width:CARD_W }}>
                <CommunityCard project={project} isRail />
              </div>
            ))}

            {/* View All card — always last */}
            <div style={{ scrollSnapAlign:"start", flexShrink:0, width:CARD_W }}>
              <button
                onClick={() => setShowAll(true)}
                style={{
                  width:"100%", height:"100%", minHeight:360,
                  borderRadius:18,
                  border:`1px dashed ${t.primary}44`,
                  background:`${t.primary}06`,
                  cursor:"pointer",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  gap:16,
                  transition:"all 0.35s ease",
                  padding:"28px 24px",
                }}
                onMouseEnter={e => { e.currentTarget.style.background=`${t.primary}12`; e.currentTarget.style.borderColor=`${t.primary}88`; }}
                onMouseLeave={e => { e.currentTarget.style.background=`${t.primary}06`; e.currentTarget.style.borderColor=`${t.primary}44`; }}
              >
                <div style={{ width:52, height:52, borderRadius:"50%", border:`1px solid ${t.primary}44`, display:"flex", alignItems:"center", justifyContent:"center", color:t.primary }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1"/>
                    <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ textAlign:"center" }}>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:400, color:t.textBright, letterSpacing:"0.04em", margin:"0 0 6px" }}>View All Projects</p>
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.82rem", color:t.textDim, fontStyle:"italic", lineHeight:1.5, margin:"0 0 14px" }}>Browse the full collection — all {COMMUNITY_PROJECTS.length} free tools</p>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.28em", textTransform:"uppercase", color:t.primary, opacity:0.7 }}>Open Gallery →</span>
                </div>
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display:"flex", justifyContent:"center", gap:7, marginTop:22 }}>
            {[...VISIBLE, { id:"all" }].map((p, i) => (
              <div key={p.id || i} style={{
                width: i < VISIBLE.length ? 6 : 10,
                height:6, borderRadius: i < VISIBLE.length ? "50%" : 3,
                background:t.primary, opacity:0.3,
                transition:"all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        {/* Footer label */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:18, marginTop:isMobile?40:56, opacity:0.28 }}>
          <div style={{ width:60, height:1, background:`linear-gradient(to right,transparent,${t.textDim})` }} />
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.62rem", letterSpacing:"0.32em", color:t.textDim, textTransform:"uppercase" }}>{COMMUNITY_PROJECTS.length} open projects · always free</span>
          <div style={{ width:60, height:1, background:`linear-gradient(to left,transparent,${t.textDim})` }} />
        </div>
      </div>

      {showAll && <ViewAllModal onClose={() => setShowAll(false)} />}
    </section>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM PRODUCTS
───────────────────────────────────────────── */
function PremiumProducts() {
  const [ref, inView] = useInView(0.06);
  const [hovered, setHovered] = useState(false);
  const t = useTheme();
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  const product = PREMIUM_PRODUCTS[0];

  return (
    <section id="products" style={{ position:"relative", padding:isMobile?"80px 14px":"120px 20px", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 70% 55% at 20% 60%,${t.sectionGlow} 0%,transparent 70%)`, transition:"background 0.8s ease" }} />
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:1, background:`linear-gradient(to right,transparent,${t.primary}28,transparent)`, pointerEvents:"none" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
        <SectionHeader eyebrow="Premium Products" title="Enterprise-Grade Software" sub="Purpose-built tools for teams that need more than the off-the-shelf solution." accent={product.accent} />

        <div ref={ref} style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(40px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
          <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ position:"relative", borderRadius:24, overflow:"hidden", border:`1px solid ${hovered?product.accent+"55":product.accent+"20"}`, background:t.cardBg, transition:"border-color 0.4s ease, box-shadow 0.4s ease", boxShadow:hovered?`0 40px 100px rgba(0,0,0,0.7),0 0 0 1px ${product.accent}18`:"0 4px 30px rgba(0,0,0,0.4)" }}>
            <div style={{ height:3, background:`linear-gradient(to right,transparent,${product.accent},transparent)`, opacity:hovered?1:0.6, transition:"opacity 0.4s ease" }} />
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr" }}>
              {/* Left */}
              <div style={{ padding:isMobile?"32px 24px":"52px", borderRight:!isMobile?`1px solid ${t.border}`:"none", borderBottom:isMobile?`1px solid ${t.border}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.32em", textTransform:"uppercase", color:"#060808", background:product.accent, padding:"3px 12px", borderRadius:20, fontWeight:500 }}>{product.badge}</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:product.accent, opacity:0.6 }}>AI-Powered</span>
                </div>
                <div style={{ marginBottom:6, fontSize:"2rem", color:product.accent }}>{product.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"2rem":"clamp(2.4rem,4vw,3.2rem)", fontWeight:300, letterSpacing:"0.03em", color:t.textBright, margin:"0 0 6px", lineHeight:1.05, transition:"color 0.8s ease" }}>{product.name}</h3>
                <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.88rem", color:product.accent, fontStyle:"italic", margin:"0 0 24px", opacity:0.9 }}>{product.tagline}</p>
                <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.98rem", color:t.textBody, lineHeight:1.8, margin:"0 0 30px", transition:"color 0.8s ease" }}>{product.description}</p>
                <div style={{ display:"inline-flex", alignItems:"baseline", gap:8, padding:"10px 18px", borderRadius:12, border:`1px solid ${product.accent}22`, background:`${product.accent}08`, marginBottom:30 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:product.accent, lineHeight:1 }}>{product.stat.value}</span>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9.5, letterSpacing:"0.2em", color:t.textDim, textTransform:"uppercase" }}>{product.stat.label}</span>
                </div>
                <br/>
                <a href={product.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 26px", borderRadius:14, border:`1px solid ${product.accent}`, background:`${product.accent}14`, color:product.accent, fontFamily:"'Cormorant Garamond',serif", fontSize:"0.8rem", letterSpacing:"0.24em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background=product.accent; e.currentTarget.style.color="#060808"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=`${product.accent}14`; e.currentTarget.style.color=product.accent; }}
                >{product.cta} <span style={{ fontSize:14 }}>↗</span></a>
              </div>
              {/* Right */}
              <div style={{ padding:isMobile?"28px 24px 36px":"52px 48px" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9.5, letterSpacing:"0.38em", color:t.primary, textTransform:"uppercase", marginBottom:24, opacity:0.75, transition:"color 0.8s ease" }}>Core Capabilities</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {product.features.map((feat, i) => (
                    <div key={i}
                      style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"13px 16px", borderRadius:12, border:`1px solid ${t.border}`, background:`${product.accent}05`, transition:"border-color 0.3s ease, background 0.3s ease", cursor:"default" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=`${product.accent}35`; e.currentTarget.style.background=`${product.accent}0e`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=t.border; e.currentTarget.style.background=`${product.accent}05`; }}
                    >
                      <div style={{ width:6, height:6, borderRadius:"50%", background:product.accent, flexShrink:0, marginTop:5, boxShadow:`0 0 6px ${product.accent}66` }} />
                      <span style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.92rem", color:t.textBody, lineHeight:1.5, transition:"color 0.8s ease" }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:26, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:product.accent, animation:"pulseDot 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9.5, letterSpacing:"0.24em", color:t.textDim, textTransform:"uppercase", transition:"color 0.8s ease" }}>Beta access · Limited seats available</span>
                </div>
              </div>
            </div>
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 50% 40% at 80% 20%,${product.accent}08 0%,transparent 60%)`, opacity:hovered?1:0.5, transition:"opacity 0.5s ease" }} />
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:isMobile?36:52, opacity:0.42 }}>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.85rem", fontStyle:"italic", color:t.textDim, letterSpacing:"0.06em", transition:"color 0.8s ease" }}>More premium products in development — follow the path.</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CLIENTS
───────────────────────────────────────────── */
function ClientsSection() {
  const t = useTheme();
  const [sectionRef, sectionInView] = useInView(0.05);
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  const accents = [t.primary, t.secondary, "#7ab8e8", "#c8a8d8", "#e8c880", "#7ec8a0"];

  return (
    <section id="clients" style={{ position:"relative", padding:isMobile?"80px 14px":"120px 20px", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:1, background:`linear-gradient(to right,transparent,${t.primary}28,transparent)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 60% 50% at 50% 80%,${t.sectionGlow} 0%,transparent 70%)`, transition:"background 0.8s ease" }} />

      <div ref={sectionRef} style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
        <SectionHeader eyebrow="Premium Clients" title="Trusted by the Best" sub="Organisations across sectors who chose WildWoodsWay Technology for their critical systems." />

        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:isMobile?12:18 }}>
          {PREMIUM_CLIENTS.map((client, i) => {
            const [ref, inView] = useInView(0.06);
            const [hov, setHov] = useState(false);
            const accent = accents[i % accents.length];
            const delay = (i % 3) * 0.08 + Math.floor(i / 3) * 0.12;
            return (
              <div key={client.name} ref={ref} style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(36px)", transition:`opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
                <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{ padding:isMobile?"18px 14px":"28px 24px", borderRadius:16, border:`1px solid ${hov?accent+"44":t.border}`, background:t.cardBg, transition:"all 0.35s ease", cursor:"default", transform:hov?"translateY(-3px)":"translateY(0)", boxShadow:hov?`0 20px 50px rgba(0,0,0,0.5),0 0 0 1px ${accent}14`:"none", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 70% 60% at 10% 10%,${accent}0c 0%,transparent 65%)`, opacity:hov?1:0.4, transition:"opacity 0.4s ease" }} />
                  <div style={{ width:isMobile?38:50, height:isMobile?38:50, borderRadius:12, border:`1px solid ${hov?accent+"55":accent+"28"}`, background:hov?`${accent}18`:`${accent}0c`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"0.88rem":"1rem", fontWeight:500, letterSpacing:"0.04em", color:accent, transition:"all 0.35s ease" }}>{client.initial}</div>
                  <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"1rem":"1.25rem", fontWeight:400, color:t.textBright, margin:"0 0 4px", lineHeight:1.1, transition:"color 0.8s ease" }}>{client.name}</h4>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:accent, opacity:0.65, margin:"0 0 10px" }}>{client.sector}</p>
                  <div style={{ height:1, background:`linear-gradient(to right,${accent}20,transparent)`, marginBottom:10 }} />
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:isMobile?"0.78rem":"0.88rem", color:t.textDim, fontStyle:"italic", lineHeight:1.55, transition:"color 0.8s ease" }}>{client.note}</p>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(to right,transparent,${accent},transparent)`, opacity:hov?1:0, transform:hov?"scaleX(1)":"scaleX(0.2)", transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:18, marginTop:isMobile?40:56, opacity:0.28 }}>
          <div style={{ width:60, height:1, background:`linear-gradient(to right,transparent,${t.textDim})` }} />
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.62rem", letterSpacing:"0.32em", color:t.textDim, textTransform:"uppercase" }}>names anonymised for confidentiality</span>
          <div style={{ width:60, height:1, background:`linear-gradient(to left,transparent,${t.textDim})` }} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
function ServicesSection() {
  const t = useTheme();
  const winWidth = useWindowWidth();
  const isMobile = winWidth < 768;
  const serviceAccents = [t.primary, "#7ab8e8", "#7ec8a0", "#e8c880", "#c8a8d8", t.secondary];

  return (
    <section id="services" style={{ position:"relative", padding:isMobile?"80px 14px 100px":"120px 20px 140px", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:1, background:`linear-gradient(to right,transparent,${t.primary}28,transparent)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 65% 55% at 15% 50%,${t.sectionGlow} 0%,transparent 65%)`, transition:"background 0.8s ease" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
        <SectionHeader eyebrow="Services · Engagements" title="How We Help" sub="Consulting, engineering, and building — across the full technology stack." />

        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":winWidth<900?"repeat(2,1fr)":"repeat(3,1fr)", gap:isMobile?12:16 }}>
          {SERVICES.map((svc, i) => {
            const [ref, inView] = useInView(0.06);
            const [hov, setHov] = useState(false);
            const accent = serviceAccents[i];
            const delay = (i % 3) * 0.08 + Math.floor(i / 3) * 0.12;
            return (
              <div key={svc.title} ref={ref} style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(36px)", transition:`opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
                <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{ padding:isMobile?"22px 18px":"30px 26px", borderRadius:16, border:`1px solid ${hov?accent+"44":t.border}`, background:t.cardBg, height:"100%", transition:"all 0.35s ease", cursor:"default", transform:hov?"translateY(-4px)":"translateY(0)", boxShadow:hov?`0 22px 55px rgba(0,0,0,0.5),0 0 0 1px ${accent}12`:"none", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 60% 50% at 15% 15%,${accent}0d 0%,transparent 65%)`, opacity:hov?1:0.35, transition:"opacity 0.4s ease" }} />
                  <div style={{ fontSize:isMobile?"1.5rem":"1.8rem", color:accent, marginBottom:16, lineHeight:1, display:"block", transform:hov?"scale(1.1) rotate(-5deg)":"scale(1)", transition:"transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>{svc.icon}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"1.2rem":"1.5rem", fontWeight:400, color:t.textBright, margin:"0 0 10px", lineHeight:1.1, transition:"color 0.8s ease" }}>{svc.title}</h3>
                  <div style={{ height:1, background:`linear-gradient(to right,${accent}25,transparent)`, marginBottom:12 }} />
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.92rem", color:t.textBody, lineHeight:1.72, margin:"0 0 18px", transition:"color 0.8s ease" }}>{svc.description}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {svc.tags.map(tag => (
                      <span key={tag} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:accent, opacity:0.65, border:`1px solid ${accent}20`, borderRadius:20, padding:"2px 9px", background:`${accent}07` }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(to right,transparent,${accent},transparent)`, opacity:hov?1:0, transform:hov?"scaleX(1)":"scaleX(0.2)", transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA strip */}
        <div style={{ marginTop:isMobile?48:70, padding:isMobile?"28px 20px":"40px 48px", borderRadius:20, border:`1px solid ${t.primary}25`, background:`${t.primary}07`, textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 60% 80% at 50% 50%,${t.sectionGlow} 0%,transparent 70%)`, transition:"background 0.8s ease" }} />
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"1.4rem":"2rem", fontWeight:300, color:t.textBright, margin:"0 0 8px", lineHeight:1.2, transition:"color 0.8s ease" }}>Have a project in mind?</p>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.95rem", color:t.textDim, fontStyle:"italic", margin:"0 0 24px", lineHeight:1.7, transition:"color 0.8s ease" }}>Whether it's a free community build or an enterprise engagement — let's talk.</p>
          <a href="mailto:hello@wildwoodsway.com"
            style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:14, border:`1px solid ${t.primary}`, background:`${t.primary}12`, color:t.primary, fontFamily:"'Cormorant Garamond',serif", fontSize:"0.82rem", letterSpacing:"0.24em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.3s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background=t.primary; e.currentTarget.style.color=t.pageBg; }}
            onMouseLeave={e => { e.currentTarget.style.background=`${t.primary}12`; e.currentTarget.style.color=t.primary; }}
          >Start the Conversation ↗</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function TechFooter() {
  const [ref, inView] = useInView();
  const t = useTheme();
  return (
    <footer ref={ref} style={{ padding:"50px 20px", borderTop:`1px solid ${t.footerBorder}`, textAlign:"center", opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(20px)", transition:"all 0.8s ease" }}>
      <div style={{ marginBottom:14, display:"flex", justifyContent:"center" }}>
        <WildwoodsEmblem size={52} mini animate={inView} />
      </div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10.5, letterSpacing:"0.3em", color:t.textDim, textTransform:"uppercase", margin:"0 0 5px", transition:"color 0.8s ease" }}>wildwoodsway.com · Technology</p>
      <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"0.8rem", color:t.textGhost, margin:"0 0 8px", fontStyle:"italic", transition:"color 0.8s ease" }}>Built with intention · {new Date().getFullYear()}</p>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.72rem", letterSpacing:"0.14em", color:t.textGhost, margin:0, fontStyle:"italic", transition:"color 0.8s ease" }}>
        Architected by <span style={{ color:t.muted, fontStyle:"normal", transition:"color 0.8s ease" }}>Akhil Antony Joseph</span>
      </p>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function TechnologyPage() {
  const [themeName, setThemeName] = useState("spring");
  const t = THEME_PALETTES[themeName];
  return (
    <ThemeContext.Provider value={t}>
      <style>{buildGlobalStyles(t)}</style>
      <Cursor />
      <NavBar themeName={themeName} onThemeChange={setThemeName} />
      <div style={{ minHeight:"100vh", transition:"background 0.8s ease" }}>
        <TechHero />
        <CommunitySection />
        <PremiumProducts />
        <ClientsSection />
        <ServicesSection />
        <TechFooter />
      </div>
    </ThemeContext.Provider>
  );
}