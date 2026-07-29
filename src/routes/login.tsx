import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  Users,
  ArrowLeft,
  CheckCircle2,
  Info,
  Key,
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
    <div className="my-1.5 select-none login-hero-subheading leading-snug tracking-[-0.01em] font-bold text-[28px] space-y-1">
      {/* 1st Line */}
      <div className="flex flex-wrap items-center gap-x-2.5">
        <span className="text-primary inline-block animate-smooth-float-1">
          Automate,
        </span>
        <span className="text-success inline-block animate-smooth-float-2">
          Monitor,
        </span>
        <span className="text-info inline-block animate-smooth-float-3">
          and Govern
        </span>
      </div>

      {/* 2nd Line */}
      <div>
        <span className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent inline-block drop-shadow-[0_2px_10px_rgba(56,189,248,0.15)] animate-smooth-float-4">
          Enterprise Data Workflows
        </span>
      </div>
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [policyType, setPolicyType] = useState<"privacy" | "terms" | null>(null);
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

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password reset request submitted successfully!");
    setMode("signin");
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
                    className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-amber-400 shrink-0"
                  >
                    <span className="relative flex h-[clamp(6px,0.4vw,12px)] w-[clamp(6px,0.4vw,12px)]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/70" />
                      <span className="relative inline-flex h-full w-full rounded-full bg-amber-400" />
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
                className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted-foreground/85 login-hero-paragraph"
              >
                A secure command center for government-grade data workflows —
                <br className="hidden sm:inline" />
                orchestrating validation, transformation, metadata and quality
                <br className="hidden sm:inline" />
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
            <div className="w-full max-w-[clamp(380px,26vw,880px)] flex flex-col items-center gap-1.5">
              <AnimatePresence mode="wait">
                {mode === "signin" ? (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="relative w-full login-card-form"
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
                              Secure Sign In
                            </div>
                            <div className="mt-0.5 text-[clamp(11.5px,0.9vw,24px)] text-muted-foreground login-card-subtitle">
                              Enter your workspace credentials
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
                            <button
                              type="button"
                              onClick={() => setMode("reset")}
                              className="font-medium text-accent transition-colors hover:text-foreground login-forgot-link bg-transparent border-none p-0 outline-none cursor-pointer"
                            >
                              Forgot password?
                            </button>
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
                  </motion.form>
                ) : (
                  <motion.form
                    key="reset"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleResetSubmit}
                    className="relative w-full login-card-form"
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
                          <div className="relative flex h-[clamp(44px,3vw,80px)] w-[clamp(44px,3vw,80px)] items-center justify-center rounded-2xl bg-white shadow-soft shrink-0">
                            <Key className="h-[clamp(20px,1.5vw,40px)] w-[clamp(20px,1.5vw,40px)] text-blue-600" />
                          </div>
                          <div>
                            <div className="text-[clamp(15px,1.3vw,38px)] font-semibold tracking-tight text-foreground login-card-title">
                              Reset your password
                            </div>
                            <div className="mt-0.5 text-[clamp(11.5px,0.9vw,24px)] text-muted-foreground login-card-subtitle">
                              Enter your username to request a reset.
                            </div>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
                          <div className="flex flex-col gap-[clamp(4px,0.3vw,12px)]">
                            <label className="text-[clamp(10.5px,0.8vw,20px)] font-semibold tracking-wide text-muted-foreground/80 uppercase">
                              USERNAME
                            </label>
                            <div
                              className="group relative flex h-[clamp(42px,3.2vw,96px)] items-center gap-2.5 2xl:gap-3.5 overflow-hidden rounded-full border px-[clamp(1rem,1.2vw,2.5rem)] border-white/[0.10] bg-white/[0.04] hover:border-white/[0.18] transition-all duration-300"
                              style={{
                                boxShadow:
                                  "inset 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 0 rgba(255, 255, 255, 0.02), 0 8px 24px -12px rgba(0, 0, 0, 0.6)",
                                backgroundImage:
                                  "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 45%, rgba(255, 255, 255, 0.00) 100%)",
                              }}
                            >
                              <span className="relative text-muted-foreground">
                                <User className="h-4 w-4" />
                              </span>
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  required
                                  placeholder="Enter your username"
                                  className="peer relative h-full w-full bg-transparent py-0 text-[clamp(13px,0.95vw,26px)] text-foreground outline-none placeholder:text-muted-foreground/40"
                                />
                              </div>
                            </div>
                          </div>

                          {/* CTA */}
                          <motion.button
                            type="submit"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0, scale: 0.99 }}
                            className="group relative mt-2 sm:mt-3 2xl:mt-6 inline-flex h-[clamp(44px,3.3vw,100px)] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary text-[clamp(14px,1.1vw,30px)] font-semibold tracking-tight text-primary-foreground shadow-[0_12px_40px_-12px_rgba(59,130,246,0.55)] transition-all login-cta-button"
                          >
                            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 via-transparent to-transparent" />
                            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
                            <span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            Request reset
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </motion.button>

                          {/* Back Link */}
                          <div className="pt-1 text-left">
                            <button
                              type="button"
                              onClick={() => setMode("signin")}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
                            >
                              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Privacy Policy · Terms of Service · About Footer links under login box */}
              <div className="mt-5 flex items-center justify-center gap-3 text-xs font-semibold text-muted-foreground/60 select-none">
                <button
                  type="button"
                  onClick={() => setPolicyType("privacy")}
                  className="hover:text-foreground/90 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none font-semibold text-xs text-muted-foreground/60"
                >
                  Privacy Policy
                </button>
                <span className="text-muted-foreground/30">•</span>
                <button
                  type="button"
                  onClick={() => setPolicyType("terms")}
                  className="hover:text-foreground/90 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none font-semibold text-xs text-muted-foreground/60"
                >
                  Terms of Service
                </button>
                <span className="text-muted-foreground/30">•</span>
                <button
                  type="button"
                  onClick={() => setIsAboutOpen(true)}
                  className="inline-flex items-center gap-1 hover:text-foreground/90 transition-colors cursor-pointer text-xs font-semibold bg-transparent border-none p-0 outline-none"
                >
                  <Info className="h-3.5 w-3.5" /> About
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Platform Overlay Info Section */}
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Privacy Policy & Terms of Service Overlay Modal */}
      <PolicyOverlay isOpen={policyType !== null} type={policyType} onClose={() => setPolicyType(null)} />
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

/* ------------------------------------------------------------------ */
/* About Platform Overlay Component                                   */
/* ------------------------------------------------------------------ */

function AboutOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modulesList = [
    { name: "Entity Register", Icon: Layers, desc: "Onboard schemas and validate parameters" },
    { name: "Stakeholder Info", Icon: Users, desc: "Manage operational agencies & contacts" },
    { name: "Delivery Tracker", Icon: ArrowLeftRight, desc: "Monitor pipelines in real-time" },
    { name: "Workflow Monitor", Icon: Workflow, desc: "Trace status logs and automation alerts" },
    { name: "Rules & Enforcement", Icon: ShieldCheck, desc: "Spatial & attribute checks on save" },
    { name: "Data Layer Governance", Icon: Database, desc: "Control access level definitions" },
    { name: "Admin Control Room", Icon: Server, desc: "Orchestrate system tasks & logs" },
    { name: "Identity Management", Icon: User, desc: "SSO policies, roles & permissions" },
  ];

  const operationsCards = [
    {
      title: "Entity Onboarding",
      desc: "Request and track mappings for new data pipelines with automated schema extraction and feedback at every step.",
      Icon: Layers,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Stakeholder Management",
      desc: "Define department stakeholders, representatives, and their respective access controls to establish clear data ownership.",
      Icon: Users,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20"
    },
    {
      title: "Delivery Workflow Monitoring",
      desc: "Real-time dashboard tracking the progress of active deliveries — see status, identify bottlenecks, and resolve exceptions instantly.",
      Icon: ArrowLeftRight,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    },
    {
      title: "Data Quality Validation",
      desc: "Configure rules to run validation checks on attributes, types, geometries, and topological integrity.",
      Icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Data Layer Governance",
      desc: "Register, organize, and secure spatial layers. Control access levels, sensitivity parameters, and schema details.",
      Icon: Database,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Identity & User Administration",
      desc: "Audit logs, secure API keys, SSO authentication, and custom role assignments for absolute control over permissions.",
      Icon: Fingerprint,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    }
  ];

  const flowSteps = [
    { step: 1, label: "Entity Onboarding", Icon: Database },
    { step: 2, label: "Stakeholder Alignment", Icon: Users },
    { step: 3, label: "Validation Enforcement", Icon: ShieldCheck },
    { step: 4, label: "Quality Assurance", Icon: CheckCircle2 },
    { step: 5, label: "Data Delivery", Icon: ArrowLeftRight },
    { step: 6, label: "Workflow History", Icon: FileText },
  ];

  const leftComplianceItems = [
    { title: "Role-based Access Control (RBAC)", desc: "Granular user-level permissions.", Icon: ShieldCheck },
    { title: "SSL & MFA Integration", desc: "SAML, OAuth, and hardware key support.", Icon: Lock },
    { title: "Audit Logging", desc: "Immutable event trailing across all actions.", Icon: FileText },
    { title: "Notification & Alert Management", desc: "Real-time slack, email, and webhook alerts.", Icon: Activity },
  ];

  const rightBenefits = [
    "Reduce manual data pipelines and handoffs by up to 85% through intelligent automation",
    "Active end-to-end data lineage & visibility across operational layers",
    "Enforce data quality at every stage — no more silent data corruption",
    "Centralized governance with enterprise-grade RBAC and audit trails",
    "Automated reports, metrics, and compliance checks",
    "TLS encrypted connections with active vulnerability scanning"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#030611] text-foreground scrollbar-thin select-none"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-50 w-full bg-[#030611]/85 backdrop-blur-md border-b border-white/[0.06] h-[64px] px-6 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/85 hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </button>
            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" /> Data Automation Studio
            </div>
            <button
              onClick={onClose}
              className="h-8.5 px-4 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-soft transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-16 space-y-24 pb-32">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                // ENTERPRISE DATA PLATFORM
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Data Automation<br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Studio</span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-[15px] leading-relaxed text-slate-300 font-medium">
                A comprehensive enterprise platform to automate, monitor and govern your official data workflows — from entity onboarding through delivery, with full quality and compliance checks built-in.
              </p>
              <div className="flex flex-col items-center gap-4 pt-2">
                <button
                  onClick={onClose}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-6 text-sm font-bold text-white shadow-[0_12px_36px_-12px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-0.5 cursor-pointer animate-pulse"
                >
                  Access the Studio <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80">
                  <span>• SDE Connectors</span>
                  <span>• GDPR Ready</span>
                  <span>• 256-bit TLS</span>
                </div>
              </div>
            </div>

            {/* What is Data Automation Studio Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-start border-t border-white/[0.06] pt-16">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">// PLATFORM OVERVIEW</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">What is Data Automation Studio?</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                  Data Automation Studio (DAS) is an enterprise-grade onboarding platform designed to eliminate manual office processes for spatial features — from initial entry, data mapping, to final delivery and validation.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                  Built for data engineering, operations, and governance teams, DAS provides a unified control plane where data schemas are structured, quality rules are enforced, and historical deliveries are fully traceable. Whether you're managing hundreds of data feeds or thousands of delivery cycles, DAS is optimized to make operations fully secure, compliant, and observable.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {modulesList.map((m) => (
                  <div
                    key={m.name}
                    className="group flex flex-col p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shrink-0">
                      <m.Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs font-bold text-white mt-3 block">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground font-semibold mt-1 leading-normal">{m.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Everything Your Data Operations Need */}
            <div className="space-y-12 border-t border-white/[0.06] pt-16">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">// SYSTEM FEATURES</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Everything Your Data Operations Need</h2>
                <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-semibold">
                  From ingestion to delivery, DAS provides rigorous controls to safeguard your enterprise data lifecycle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {operationsCards.map((c) => (
                  <div
                    key={c.title}
                    className="group flex flex-col justify-between p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-blue-500/20 hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${c.color} shrink-0`}>
                        <c.Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-blue-400 group-hover:text-blue-300 cursor-pointer">
                      Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* End-to-End Pipeline Orchestration */}
            <div className="space-y-12 border-t border-white/[0.06] pt-16">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">// PIPELINE WORKFLOW</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">End-to-End Pipeline Orchestration</h2>
                <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-semibold">
                  Data workflows route automatically through logical staging, validation gates, and delivery receipts.
                </p>
              </div>

              <div className="relative py-8">
                {/* Horizontal progress track line */}
                <div className="absolute top-[48px] left-[5%] right-[5%] h-0.5 bg-white/[0.08]" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4 relative">
                  {flowSteps.map((s) => (
                    <div key={s.step} className="flex flex-col items-center text-center space-y-3 group cursor-default">
                      <div className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full bg-slate-950 border border-white/[0.12] text-slate-400 font-mono text-[10px] font-extrabold group-hover:border-blue-500 group-hover:text-blue-400 transition-all duration-300 shadow-sm">
                        {s.step}
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shrink-0">
                        <s.Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-white px-2 leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise Control at Every Level */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start border-t border-white/[0.06] pt-16">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">// COMPLIANCE & SECURITY</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Enterprise Control at Every Level</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {leftComplianceItems.map((item) => (
                    <div key={item.title} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-2 cursor-default">
                      <div className="flex items-center gap-2">
                        <item.Icon className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-bold text-white">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-semibold leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">// OPERATIONAL BENEFITS</h3>
                <ul className="space-y-3 text-xs text-slate-300 font-semibold">
                  {rightBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 via-slate-950 to-indigo-950/20 p-8 sm:p-12 text-center overflow-hidden w-full">
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
              
              <div className="relative max-w-lg mx-auto space-y-6 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 animate-pulse">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                    Sign in to your Data Automation Studio workspace and take control of your enterprise data operations today.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-soft transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Privacy Policy & Terms of Service Overlay Component                 */
/* ------------------------------------------------------------------ */

function PolicyOverlay({
  isOpen,
  type,
  onClose,
}: {
  isOpen: boolean;
  type: "privacy" | "terms" | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const subtitle = isPrivacy
    ? "Last updated: July 2026 • Data Protection & Security Guidelines"
    : "Last updated: July 2026 • Platform Agreement & Compliance Rules";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/[0.08] bg-[#0c1424] text-foreground shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 font-medium leading-relaxed scrollbar-thin">
            {isPrivacy ? (
              <>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">1. Introduction & Overview</h3>
                  <p>
                    Data Automation Studio (DAS) is committed to protecting your privacy and ensuring the security of all credentials, metadata, and operational workflows stored in the platform. This policy outlines our data collection, storage, and protection practices.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">2. Information We Collect</h3>
                  <p>
                    We collect user account identifiers (usernames, email addresses), system action records (audit logs of onboarding requests, parameter configurations, and schema mapping changes), and network diagnostics (IP addresses, connection logs) to maintain security audit compliance.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">3. Purpose of Processing</h3>
                  <p>
                    Collected information is used exclusively to facilitate automated data delivery tasks, generate system quality reports, and enforce user access control policies (RBAC). We do not share telemetry or analytics data with third parties.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">4. Data Protection & Encryption</h3>
                  <p>
                    All databases, session caches, and connections are encrypted using industry-standard TLS 1.3/256-bit AES mechanisms. Granular permission rules ensure that only verified stakeholders can view sensitive layer mappings.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">5. User Audits & Retention</h3>
                  <p>
                    In accordance with government audit compliance, interaction trails are stored securely and remain immutable. If you require access log details, please contact your workspace administrator.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">1. Acceptance of Terms</h3>
                  <p>
                    By logging into the Data Automation Studio (DAS) workspace, you agree to follow the enterprise data governance guidelines and use this platform only for official department tasks.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">2. Authorized Access Only</h3>
                  <p>
                    DAS contains sensitive spatial features and department configurations. Only authorized users who have been granted explicit RBAC roles may enter. Unauthorized connection attempts will be logged and reported to security services.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">3. User Responsibilities</h3>
                  <p>
                    You are responsible for keeping your login credentials, API tokens, and access keys secure. Any action performed under your credentials is logged as your responsibility. Multi-factor authentication must be enabled if required by policy.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">4. System Logging & Service Level SLA</h3>
                  <p>
                    All automations, quality check execution rules, and file delivery steps are fully logged. The studio offers standard high-availability SLAs for scheduled runs but is not liable for upstream data delivery source failures.
                  </p>
                </section>
                <section className="space-y-2 text-left">
                  <h3 className="text-white font-bold text-sm">5. Termination & Suspension</h3>
                  <p>
                    We reserve the right to temporarily suspend user access to protect workspace data integrity if suspicious operations or unauthorized pipeline creations are detected.
                  </p>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#0a1220] border-t border-white/[0.06] flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors cursor-pointer border-none"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
