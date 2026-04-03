export function Spinner() {
  return (
    <div className="flex items-center justify-center w-full py-24">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border border-amber-400/20 rounded-full" />
        <div className="absolute inset-0 border-t border-amber-400 rounded-full animate-spin" />
        <div className="absolute inset-2 border-t border-amber-400/40 rounded-full animate-spin [animation-direction:reverse] [animation-duration:0.6s]" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white/5 border border-white/5 p-6 space-y-4">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-5/6" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-white/10 rounded-full w-16" />
        <div className="h-6 bg-white/10 rounded-full w-20" />
        <div className="h-6 bg-white/10 rounded-full w-14" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="animate-pulse space-y-6 max-w-2xl">
      <div className="h-3 bg-white/10 rounded w-32" />
      <div className="space-y-3">
        <div className="h-14 bg-white/10 rounded w-full" />
        <div className="h-14 bg-white/10 rounded w-4/5" />
      </div>
      <div className="h-4 bg-white/10 rounded w-24" />
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-3 bg-white/10 rounded w-4/6" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-12 bg-white/10 rounded-lg w-36" />
        <div className="h-12 bg-white/10 rounded-lg w-36" />
      </div>
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm text-red-400/80 font-mono">{message}</p>
    </div>
  );
}