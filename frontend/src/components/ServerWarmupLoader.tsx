import { useState, useEffect } from "react";
import {
  SkeletonHero,
  SkeletonExperienceCard,
  SkeletonEducationCard,
  SkeletonCertificationCard,
  SkeletonCard,
  SkeletonSocials,
} from "./Loader";

interface ServerWarmupLoaderProps {
  isLoading: boolean;
}

export default function ServerWarmupLoader({ isLoading }: ServerWarmupLoaderProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0e17] z-50 overflow-y-auto">
      {/* Hero Skeleton */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000000]">
        <div className="relative flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto py-40">
          <SkeletonHero />
        </div>
      </section>

      {/* About Skeleton */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0e17]">
        <div className="w-full max-w-5xl mx-auto px-6 py-20">
          <SkeletonHero />
        </div>
      </section>

      {/* Experience Skeleton */}
      <section className="relative min-h-screen overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <div className="relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-cyan-500/20 hidden md:block" />
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="relative">
                  <div className="hidden md:block absolute left-[20px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-500/90 border border-cyan-500/50 z-20" />
                  <div className="md:ml-32">
                    <SkeletonExperienceCard />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Skeleton */}
      <section className="relative overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Skeleton */}
      <section className="relative overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Education Skeleton */}
      <section className="relative overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <div className="relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-rose-400/20 hidden md:block" />
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="relative">
                  <div className="hidden md:block absolute left-[20px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-rose-400/90 border border-rose-400/50 z-20" />
                  <div className="md:ml-32">
                    <SkeletonEducationCard />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Skeleton */}
      <section className="relative overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCertificationCard key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Socials Skeleton */}
      <section className="relative overflow-hidden bg-[#0a0e17] py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center gap-3 justify-center mb-16">
            <div className="w-16 h-px bg-orange-500" />
            <div className="h-4 bg-white/10 rounded w-32" />
          </div>
          <SkeletonSocials />
        </div>
      </section>

      {/* Server warmup indicator at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
        <p className="text-xs text-gray-500 font-mono">
          Getting almost ready... {elapsedSeconds}s
        </p>
      </div>
    </div>
  );
}
