"use client";

import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (n: number) => void
) {
  const start = performance.now();
  const run = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    onUpdate(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function formatStat(value: number, type: "currency" | "number" | "percent"): string {
  if (type === "currency") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  }
  if (type === "percent") return `${value}%`;
  return `${value}+`;
}

export function StatsBar() {
  const [data, setData] = useState<{
    totalScholarships: number;
    collegeAcceptances: number;
    fullRides: number;
    graduationRate: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState({
    totalScholarships: 0,
    collegeAcceptances: 0,
    fullRides: 0,
    graduationRate: 0,
  });

  useEffect(() => {
    fetch("/api/public/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() =>
        setData({
          totalScholarships: 0,
          collegeAcceptances: 0,
          fullRides: 0,
          graduationRate: 0,
        })
      );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !data) return;
    const duration = 1200;
    animateValue(0, data.totalScholarships, duration, (n) =>
      setDisplay((d) => ({ ...d, totalScholarships: n }))
    );
    animateValue(0, data.collegeAcceptances, duration, (n) =>
      setDisplay((d) => ({ ...d, collegeAcceptances: n }))
    );
    animateValue(0, data.fullRides, duration, (n) =>
      setDisplay((d) => ({ ...d, fullRides: n }))
    );
    animateValue(0, data.graduationRate, duration, (n) =>
      setDisplay((d) => ({ ...d, graduationRate: n }))
    );
  }, [visible, data]);

  if (data === null) {
    return (
      <section className="bg-navy-800 py-12" aria-label="Statistics">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton variant="text" className="mx-auto h-10 w-24 bg-navy-700" />
                <Skeleton variant="text" className="mx-auto mt-2 h-5 w-32 bg-navy-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Total Scholarships", value: display.totalScholarships, type: "currency" as const },
    { label: "College Acceptances", value: display.collegeAcceptances, type: "number" as const },
    { label: "Full-Ride Scholarships", value: display.fullRides, type: "number" as const },
    { label: "Graduation Rate", value: display.graduationRate, type: "percent" as const },
  ];

  return (
    <section ref={ref} className="bg-navy-800 py-12" aria-label="Statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-gold-500 lg:text-4xl">
                {formatStat(s.value, s.type)}
              </p>
              <p className="mt-2 text-sm text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
