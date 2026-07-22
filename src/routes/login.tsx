import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  Database,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
  FileText,
  Code2,
  ArrowLeftRight,
  Share2,
  Workflow,
  Layers,
  LineChart,
  Shield,
  Server,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Data Automation Studio" },
      {
        name: "description",
        content:
          "Secure enterprise sign-in to the Data Automation Studio — government-grade data automation, quality and governance.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function AnimatedLogo() {
  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 w-[clamp(48px,3.2vw,120px)] h-[clamp(48px,3.2vw,120px)] drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="neon-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradients */}
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Main D shape outline */}
      <motion.path
        d="M 38 18 L 62 18 A 32 32 0 0 1 62 82 L 38 82 A 7 7 0 0 1 38 68 L 58 68 A 18 18 0 0 0 58 32 L 38 32 A 7 7 0 0 1 38 18 Z"
        fill="url(#logo-grad)"
        filter="url(#neon-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Circuit Trace lines inside the D loop - Base paths */}
      <path
        d="M 16 38 L 28 38 L 38 48 L 52 48"
        stroke="#38bdf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M 10 50 L 52 50"
        stroke="#60a5fa"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M 16 62 L 28 62 L 38 52 L 52 52"
        stroke="#818cf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Circuit Trace lines inside the D loop - Pulsing flow overlay paths */}
      {/* Top Trace Pulse */}
      <motion.path
        d="M 16 38 L 28 38 L 38 48 L 52 48"
        stroke="#38bdf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#neon-glow)"
        strokeDasharray="10 30"
        animate={{ strokeDashoffset: [0, -40] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {/* Top Node */}
      <motion.circle
        cx="16"
        cy="38"
        r="4"
        fill="#38bdf8"
        filter="url(#neon-glow)"
        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Middle Trace Pulse */}
      <motion.path
        d="M 10 50 L 52 50"
        stroke="#60a5fa"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#neon-glow)"
        strokeDasharray="12 30"
        animate={{ strokeDashoffset: [0, -42] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle Node */}
      <motion.circle
        cx="10"
        cy="50"
        r="5.5"
        fill="#60a5fa"
        filter="url(#neon-glow)"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Bottom Trace Pulse */}
      <motion.path
        d="M 16 62 L 28 62 L 38 52 L 52 52"
        stroke="#818cf8"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#neon-glow)"
        strokeDasharray="10 30"
        animate={{ strokeDashoffset: [0, -40] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.2 }}
      />
      {/* Bottom Node */}
      <motion.circle
        cx="16"
        cy="62"
        r="4"
        fill="#818cf8"
        filter="url(#neon-glow)"
        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </motion.svg>
  );
}

function FloatingKeywords() {
  return (
    <div className="my-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 select-none login-hero-subheading leading-snug tracking-[-0.01em] font-bold text-[28px]">
      <span className="text-primary inline-block animate-smooth-float-1">
        Automate,
      </span>

      <span className="text-success inline-block animate-smooth-float-2">
        Monitor,
      </span>

      <span className="text-info inline-block animate-smooth-float-3">
        and Governance
      </span>

      <span className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent inline-block drop-shadow-[0_2px_10px_rgba(56,189,248,0.15)] pl-0.5 animate-smooth-float-4">
        Enterprise Data Workflows
      </span>
    </div>
  );
}



const HUB_NODES = [
  { Icon: Server, angle: -90, label: "Data Sources" },
  { Icon: FileText, angle: -30, label: "Metadata" },
  { Icon: ShieldCheck, angle: 30, label: "Data Quality" },
  { Icon: Workflow, angle: 90, label: "Orchestration" },
  { Icon: ArrowLeftRight, angle: 150, label: "ETL" },
  { Icon: Shield, angle: 210, label: "Governance" },
];

function CircularHub() {
  const size = 380;
  const radius = 128;
  const center = size / 2;

  return (
    <div
      className="relative w-full h-full aspect-square pointer-events-auto transition-transform duration-300 login-workflow-hub"
    >
      {/* Concentric mesh rings */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="0.35" />
            <stop offset="60%" stopColor="var(--primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r={radius * 1.35} fill="url(#hub-glow)" />
        {[0.5, 0.75, 1, 1.25].map((k, i) => (
          <motion.circle
            key={i}
            cx={center}
            cy={center}
            r={radius * k}
            fill="none"
            stroke="var(--info)"
            strokeOpacity={0.35}
            strokeDasharray="3 5"
            animate={{
              strokeDashoffset: i % 2 === 0 ? [0, 80] : [0, -80]
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        {/* Spokes with flowing animation */}
        {HUB_NODES.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = center + Math.cos(rad) * radius;
          const y = center + Math.sin(rad) * radius;
          return (
            <motion.line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--info)"
              strokeOpacity={0.38}
              strokeDasharray="4 4"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}
      </svg>

      {/* Center Database Hub */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 35px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
            "0 0 50px rgba(6,182,212,0.65), inset 0 1px 0 rgba(255,255,255,0.15)",
            "0 0 35px rgba(6,182,212,0.45), inset 0 1px 0 rgba(255,255,255,0.1)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full border border-info/50 bg-background/90 text-info shadow-[0_0_35px_rgba(6,182,212,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] w-[14%] h-[14%]"
      >
        {/* Pulsing outer ring */}
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-2 border-info/35"
        />
        <Database className="h-1/2 w-1/2 animate-pulse" />
      </motion.div>

      {/* Center Hub Label */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
        style={{
          top: "61%",
        }}
      >
        <span className="text-[clamp(7.5px,0.65vw,9.5px)] font-semibold tracking-wider uppercase text-info bg-info/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-info/20 shadow-[0_0_12px_rgba(6,182,212,0.15)] whitespace-nowrap">
          Enterprise Database
        </span>
      </div>

      {/* Nodes with gentle floating orbits */}
      {HUB_NODES.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = center + Math.cos(rad) * radius;
        const y = center + Math.sin(rad) * radius;
        return (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(x / size) * 100}%`,
              top: `${(y / size) * 100}%`,
              width: "12.5%",
              height: "12.5%",
            }}
            animate={{
              y: [0, -4, 0],
              x: [0, i % 2 === 0 ? 1.5 : -1.5, 0]
            }}
            transition={{
              duration: 4.5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* The Icon Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.15, borderColor: "var(--info)", boxShadow: "0 0 32px -4px var(--info), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
              className="absolute inset-0 grid place-items-center rounded-full border border-info/30 bg-background/90 text-info backdrop-blur-md hover:text-white transition-colors cursor-pointer"
              style={{
                boxShadow: "0 0 24px -6px var(--info), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Rocking/pulsing inner icon */}
              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 0.95, 1]
                }}
                transition={{
                  duration: 3.5 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center w-full h-full"
              >
                <n.Icon className="h-1/2 w-1/2" />
              </motion.div>
            </motion.div>

            {/* The Text Label */}
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              className="absolute top-[105%] left-1/2 -translate-x-1/2 text-[clamp(7.5px,0.65vw,9.5px)] font-semibold tracking-wider uppercase text-info/95 text-center bg-info/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-info/20 shadow-[0_0_12px_rgba(6,182,212,0.15)] whitespace-nowrap"
            >
              {n.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Login() {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [loading, setLoading] = useState<"idle" | "loading" | "success">("idle");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("loading");
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("das-theme", "light");
      } catch (err) {
        console.error(err);
      }
    }
    setTimeout(() => {
      setLoading("success");
      setTimeout(() => navigate({ to: "/dashboard" }), 500);
    }, 900);
  };

  return (
    <div className="relative h-dvh max-h-dvh w-full overflow-hidden bg-background text-foreground flex flex-col justify-between select-none">
      <AmbientBackdrop />

      {/* Main layout wrapper */}
      <div className="relative z-10 mx-auto flex flex-1 h-full w-full max-w-full flex-col justify-between px-4 sm:px-8 xl:px-12 2xl:px-16 3xl:px-20 py-2 sm:py-3 2xl:py-4 overflow-hidden login-container-strict">

        {/* Top logo bar */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between gap-4 pb-1 shrink-0"
        >
          <img
            src="/DGE White.png"
            alt="Department of Government Enablement"
            className="h-[clamp(28px,2.5vw,90px)] w-auto shrink-0 object-contain opacity-95"
          />
          <img
            src="/SDI White.png"
            alt="Abu Dhabi Spatial Data"
            className="h-[clamp(36px,3.2vw,120px)] w-auto shrink-0 object-contain opacity-90"
          />
        </motion.header>

        {/* Body Grid: 2-column layout on desktop, top-aligned below logos */}
        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.25fr_0.75fr] gap-4 xl:gap-8 2xl:gap-14 3xl:gap-20 items-stretch justify-items-stretch mt-0.5 sm:mt-1 lg:mt-1.5 py-0 overflow-hidden login-body-grid">

          {/* -------------------- HERO SECTION (Hero Copy + Illustrations) -------------------- */}
          <div className="flex flex-col justify-between flex-1 min-h-0 gap-2 sm:gap-3 xl:gap-4 w-full login-hero-section overflow-hidden">

            {/* Hero Copy */}
            <div className="relative flex flex-col items-start text-left w-full login-hero-wrapper shrink-0">
              <div className="relative w-full flex items-center gap-3 sm:gap-4 login-logo-title-group">
                <AnimatedLogo />

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    whileHover={{
                      scale: 1.01,
                      x: 3,
                      filter: "drop-shadow(0 4px 20px rgba(56,189,248,0.4))"
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 18,
                      x: { duration: 0.3 }
                    }}
                    className="relative text-[42px] font-bold leading-tight tracking-[-0.01em] bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(56,189,248,0.25)] login-hero-heading cursor-default select-none"
                  >
                    <span className="whitespace-nowrap">Data Automation Studio</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-success shrink-0"
                  >
                    <span className="relative flex h-[clamp(6px,0.4vw,12px)] w-[clamp(6px,0.4vw,12px)]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                      <span className="relative inline-flex h-full w-full rounded-full bg-success" />
                    </span>
                    Live Enterprise Data Platform
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="w-full mt-1.5"
              >
                <FloatingKeywords />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-2 max-w-[550px] text-[15px] leading-relaxed text-muted-foreground/85 login-hero-paragraph"
              >
                A secure command center for government-grade data workflows —
                orchestrating validation, transformation, metadata and quality
                across every layer of the pipeline.
              </motion.p>
            </div>

            {/* Illustrations Row */}
            <div className="grid flex-1 min-h-0 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full items-center justify-items-center sm:justify-items-stretch login-illustrations-row pt-1 sm:pt-2 overflow-hidden">

              {/* Blended Image */}
              <div className="flex items-center justify-center lg:justify-start w-full h-full min-h-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-full h-full max-w-[clamp(220px,32vw,800px)] max-h-[48vh] aspect-square pointer-events-none select-none overflow-visible"
                >
                  {/* Radial gradient mask to feather edges into 100% transparency */}
                  <div
                    className="relative w-full h-full opacity-85"
                    style={{
                      maskImage: "radial-gradient(circle at 50% 50%, black 0%, black 20%, rgba(0,0,0,0.6) 45%, transparent 65%)",
                      WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0%, black 20%, rgba(0,0,0,0.6) 45%, transparent 65%)",
                    }}
                  >
                    <img
                      src="/data_hub_isometric.png"
                      alt=""
                      className="w-full h-full object-cover mix-blend-lighten"
                    />

                    {/* Radial Gradient overlay matching exact #030611 page background */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle at 50% 50%, transparent 15%, #030611 65%)"
                      }}
                    />

                    {/* Grid overlay specifically on top of the image */}
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "linear-gradient(var(--muted-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--muted-foreground) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                        maskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
                        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 80%)",
                      }}
                    />
                  </div>

                  {/* Glowing isometric circuit pulses overlay */}
                  <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-85" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="line-glow-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--info)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--info)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="line-glow-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--info)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--info)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <motion.path
                      d="M 20 40 L 45 52 L 80 70"
                      fill="none"
                      stroke="url(#line-glow-blue)"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeDasharray="15 45"
                      animate={{ strokeDashoffset: [60, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.path
                      d="M 15 65 L 42 51 L 75 35"
                      fill="none"
                      stroke="url(#line-glow-cyan)"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeDasharray="12 38"
                      animate={{ strokeDashoffset: [50, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                    />

                    <motion.path
                      d="M 50 18 L 50 48 L 50 82"
                      fill="none"
                      stroke="url(#line-glow-blue)"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeDasharray="10 30"
                      animate={{ strokeDashoffset: [40, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.path
                      d="M 30 50 A 20 20 0 1 0 70 50 A 20 20 0 1 0 30 50"
                      fill="none"
                      stroke="var(--info)"
                      strokeWidth="0.4"
                      strokeLinecap="round"
                      strokeDasharray="8 40"
                      animate={{ strokeDashoffset: [48, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      opacity="0.6"
                    />
                  </svg>

                  {/* Rotating ambient blue highlight glow behind artwork */}
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      opacity: [0.65, 0.85, 0.65],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -inset-14 bg-[radial-gradient(circle,rgba(6,182,212,0.22)_0%,rgba(37,99,235,0.12)_50%,transparent_100%)] blur-3xl rounded-full pointer-events-none z-[-1]"
                  />
                </motion.div>
              </div>

              {/* Circular Hub Diagram */}
              <div className="flex items-center justify-center w-full h-full min-h-0">
                <div className="w-full h-full max-w-[clamp(220px,32vw,800px)] max-h-[46vh] aspect-square overflow-visible">
                  <CircularHub />
                </div>
              </div>

            </div>

          </div>

          {/* -------------------- RIGHT COLUMN / Auth card -------------------- */}
          <div className="flex flex-col items-center justify-center lg:items-end w-full login-card-wrapper my-auto self-center shrink-0">

            <motion.form
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="relative w-full max-w-[clamp(380px,26vw,880px)] login-card-form"
            >
              {/* Card Container */}
              <div
                className="relative overflow-hidden rounded-[clamp(20px,2vw,48px)] p-[clamp(1.25rem,2.2vw,4rem)] login-card-container border border-white/[0.08]"
                style={{
                  backgroundColor: "rgba(14, 24, 40, 0.55)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 24px 64px -12px rgba(0, 0, 0, 0.7), 0 0 50px -10px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.08] to-transparent" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-info/10 blur-3xl" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center gap-3.5 2xl:gap-5">
                    <AnimatedShield />
                    <div>
                      <div className="text-[clamp(15px,1.3vw,38px)] font-semibold tracking-tight text-foreground login-card-title">
                        Secure Workspace
                      </div>
                      <div className="mt-0.5 text-[clamp(11.5px,0.9vw,24px)] text-muted-foreground login-card-subtitle">
                        Access your enterprise automation platform
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
                    <FloatingField
                      label="Username"
                      icon={<User className="h-4 w-4" />}
                      defaultValue="DAPortalAdmin"
                      autoComplete="username"
                    />
                    <FloatingField
                      label="Password"
                      icon={<Lock className="h-4 w-4" />}
                      type={show ? "text" : "password"}
                      defaultValue="EnterpriseSecure2026"
                      autoComplete="current-password"
                      onKeyUp={(e) =>
                        setCaps(e.getModifierState && e.getModifierState("CapsLock"))
                      }
                      trailing={
                        <button
                          type="button"
                          aria-label={show ? "Hide password" : "Show password"}
                          onClick={() => setShow((s) => !s)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />

                    {caps && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-1.5 text-[11.5px] text-warning"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Caps Lock is on
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between pt-0.5 text-[clamp(11.5px,0.85vw,13px)]">
                      <label className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground login-checkbox-label">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                        Remember me
                      </label>
                      <a
                        href="#"
                        className="font-medium text-accent transition-colors hover:text-foreground login-forgot-link"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* CTA */}
                    <motion.button
                      type="submit"
                      disabled={loading !== "idle"}
                      whileHover={loading === "idle" ? { y: -1 } : undefined}
                      whileTap={loading === "idle" ? { y: 0, scale: 0.99 } : undefined}
                      className="group relative mt-2 sm:mt-3 2xl:mt-6 inline-flex h-[clamp(44px,3.3vw,100px)] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary text-[clamp(14px,1.1vw,30px)] font-semibold tracking-tight text-primary-foreground shadow-[0_12px_40px_-12px_rgba(59,130,246,0.55)] transition-all disabled:opacity-95 login-cta-button"
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-transparent" />
                      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {loading === "idle" && (
                        <>
                          Sign In to Workspace
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                      {loading === "loading" && (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing In...
                        </>
                      )}
                      {loading === "success" && (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Welcome back
                        </motion.span>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Under card meta - Always visible & part of natural card flow */}
              <div className="mt-3 2xl:mt-4 flex items-center justify-between px-2 text-[clamp(11px,0.85vw,22px)] text-muted-foreground login-under-card-meta">
                <span className="inline-flex items-center gap-1.5">
                  <Fingerprint className="h-[clamp(14px,1vw,28px)] w-[clamp(14px,1vw,28px)] text-success shrink-0" />
                  End-to-end encrypted session
                </span>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Need help?
                </Link>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Circular hub visualization                                          */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/* Animated shield                                                     */
/* ------------------------------------------------------------------ */

function AnimatedShield() {
  return (
    <div className="relative flex h-[clamp(44px,3vw,80px)] w-[clamp(44px,3vw,80px)] items-center justify-center rounded-2xl bg-[var(--gradient-primary)] shadow-[0_14px_36px_-12px_var(--primary)] shrink-0">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-2xl bg-accent blur-md"
      />
      <ShieldCheck className="relative h-[clamp(20px,1.5vw,40px)] w-[clamp(20px,1.5vw,40px)] text-primary-foreground" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient backdrop — subtle mesh + orbs, using project tokens        */
/* ------------------------------------------------------------------ */

function AmbientBackdrop() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Default initial spotlight lens to center of window
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setIsLoaded(true);

    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Fluid linear interpolation (lerp) for smooth Apple-style cursor motion tracking
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const particles = [
    { id: 1, left: "8%", top: "15%", size: 3, duration: 18, delay: 0 },
    { id: 2, left: "25%", top: "45%", size: 2, duration: 22, delay: 1.5 },
    { id: 3, left: "42%", top: "12%", size: 4, duration: 16, delay: 3 },
    { id: 4, left: "15%", top: "75%", size: 3, duration: 20, delay: 0.8 },
    { id: 5, left: "65%", top: "28%", size: 2, duration: 24, delay: 2.2 },
    { id: 6, left: "82%", top: "18%", size: 3, duration: 19, delay: 1.1 },
    { id: 7, left: "55%", top: "68%", size: 4, duration: 21, delay: 4 },
    { id: 8, left: "73%", top: "82%", size: 2, duration: 25, delay: 0.5 },
    { id: 9, left: "88%", top: "62%", size: 3, duration: 17, delay: 2.7 },
    { id: 10, left: "33%", top: "88%", size: 2, duration: 23, delay: 1.9 },
    { id: 11, left: "48%", top: "40%", size: 3, duration: 20, delay: 3.2 },
    { id: 12, left: "92%", top: "48%", size: 2, duration: 26, delay: 0.2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030611] select-none">
      {/* 1. Dark Wash Base */}
      <div className="absolute inset-0 bg-[#030611]" />

      {/* 2. Soft Blurred Base Technology Illustration Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/tech_bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.52] blur-[9px] brightness-[0.88] contrast-[1.15]"
        />
      </div>

      {/* 3. Sharp Interactive Focus Lens Reveal (Dynamic Radial Mask) */}
      {isLoaded && (
        <div
          className="absolute inset-0 overflow-hidden transition-opacity duration-700 pointer-events-none"
          style={{
            maskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)`,
          }}
        >
          <img
            src="/tech_bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90 blur-0 brightness-[1.15] contrast-[1.25]"
          />
        </div>
      )}

      {/* 5. Ambient Vignette Wash */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, transparent 40%, #02040a 95%)"
        }}
      />

      {/* 6. Soft Light Spots */}
      <motion.div
        animate={{
          opacity: [0.18, 0.28, 0.18],
          scale: [1, 1.05, 1],
          x: [0, 15, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] bottom-[8%] h-[550px] w-[550px] rounded-full bg-cyan-500/12 blur-[150px]"
      />

      <motion.div
        animate={{
          opacity: [0.12, 0.20, 0.12],
          y: [0, 15, 0],
          x: [0, -10, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-[-5%] top-[-5%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]"
      />

      <motion.div
        animate={{
          opacity: [0.10, 0.18, 0.10],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-8%] bottom-[-8%] h-[580px] w-[580px] rounded-full bg-cyan-600/8 blur-[160px]"
      />

      {/* 7. Subtle Technical Grid (Full Body) */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--muted-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--muted-foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* 8. Ambient Drifting Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 10px rgba(34,211,238,0.6)",
          }}
          animate={{
            y: [-18, 18, -18],
            x: [-12, 12, -12],
            opacity: [0.12, 0.35, 0.12],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

function FloatingField({
  label,
  icon,
  type = "text",
  defaultValue,
  trailing,
  autoComplete,
  onKeyUp,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  defaultValue?: string;
  trailing?: React.ReactNode;
  autoComplete?: string;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-[clamp(4px,0.3vw,12px)]">
      <label className="text-[clamp(10.5px,0.8vw,20px)] font-semibold tracking-wide text-muted-foreground/80 login-field-label">
        {label}
      </label>
      <div
        className={`group relative flex h-[clamp(42px,3.2vw,96px)] items-center gap-2.5 2xl:gap-3.5 overflow-hidden rounded-full border px-[clamp(1rem,1.2vw,2.5rem)] transition-all duration-300 login-input-field ${focused
          ? "border-primary/60 bg-white/[0.07]"
          : "border-white/[0.10] bg-white/[0.04] hover:border-white/[0.18]"
          }`}
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.02), 0 8px 24px -12px rgba(0,0,0,0.6)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 45%, rgba(255,255,255,0.00) 100%)",
        }}
      >
        <span
          className={`relative transition-colors ${focused ? "text-accent" : "text-muted-foreground"}`}
        >
          {icon}
        </span>
        <div className="relative flex-1">
          <input
            type={type}
            value={value}
            autoComplete={autoComplete}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyUp={onKeyUp}
            className="peer relative h-full w-full bg-transparent py-0 text-[clamp(13px,0.95vw,26px)] text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        <span className="relative">{trailing}</span>
      </div>
    </div>
  );
}
