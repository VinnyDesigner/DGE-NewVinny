export function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep charcoal / light slate base */}
      <div className="absolute inset-0 bg-[var(--orb-base)]" />

      {/* Directional ambient lighting — cool blue top-left, teal bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 45% at 8% 5%, var(--orb-blue-1) 0%, transparent 60%),
                       radial-gradient(55% 45% at 95% 100%, var(--orb-teal-1) 0%, transparent 65%)`,
        }}
      />

      {/* Soft blue spotlight — top-left */}
      <div className="absolute -top-40 -left-32 h-[620px] w-[620px] rounded-full bg-primary/18 blur-[200px]" />

      {/* Soft teal spotlight — bottom-right */}
      <div className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-cyan-500/12 blur-[200px]" />

      {/* Very subtle purple accent — far top-right, minimal */}
      <div className="absolute top-[10%] right-[15%] h-[360px] w-[360px] rounded-full bg-violet-500/6 blur-[180px]" />

      {/* Center pool so cards float */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(55% 45% at 50% 55%, var(--orb-center) 0%, transparent 70%)`,
        }}
      />

      {/* Fine grid noise */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--orb-grid) 1px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 50%, transparent 45%, var(--orb-vignette-mid) 88%, var(--orb-vignette) 100%)`,
        }}
      />
    </div>
  );
}
