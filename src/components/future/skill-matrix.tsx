"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeData } from "~/components/resume/types";

function RadialGauge({ name, rating }: { name: string; rating: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(Math.max(rating, 0), 10) / 10;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(34,211,238,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="url(#skill-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={armed ? circumference * (1 - ratio) : circumference}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          <defs>
            <linearGradient id="skill-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-cyan-200">
          {rating}
        </span>
      </div>
      <span className="max-w-20 text-center font-mono text-[10px] uppercase tracking-wider text-slate-300">
        {name}
      </span>
    </div>
  );
}

export function SkillMatrix({ groups }: { groups: ResumeData["skillGroups"] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-fuchsia-300/90">
            ▸ {group.name}
          </h3>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-6">
            {group.skills.map((skill) => (
              <RadialGauge key={skill.id} name={skill.name} rating={skill.rating} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
