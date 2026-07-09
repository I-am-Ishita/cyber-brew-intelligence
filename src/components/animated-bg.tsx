export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-brand/25 blur-3xl animate-float-slow" />
      <div className="absolute top-40 -right-40 h-[520px] w-[520px] rounded-full bg-cyan/20 blur-3xl animate-float-slow [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-violet-500/15 blur-3xl animate-float-slow [animation-delay:4s]" />
    </div>
  );
}