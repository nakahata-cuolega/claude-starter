# juice-up 部品集(実証済みコード)

実運用中の Next.js 16 / React 19 / Tailwind v4 アプリで検証済みのコードそのまま。
Tailwind前提。別スタックでは class を素のCSSに読み替える。

## 1. keyframes(グローバルCSSに追加)

```css
/*
 * Loading / delight animations (shared).
 * Everything is gated behind prefers-reduced-motion.
 */
@media (prefers-reduced-motion: no-preference) {
  @keyframes aurora-pan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer-pan {
    0% { background-position: 150% 0; }
    100% { background-position: -50% 0; }
  }
  @keyframes float-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop-reveal {
    0% { opacity: 0; transform: perspective(400px) rotateY(80deg) scale(0.7); }
    60% { opacity: 1; transform: perspective(400px) rotateY(-12deg) scale(1.06); }
    100% { opacity: 1; transform: perspective(400px) rotateY(0) scale(1); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.35); }
    50% { box-shadow: 0 0 16px 3px rgba(139, 92, 246, 0.45); }
  }
  @keyframes burst-fly {
    0% { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.2); }
  }
  @keyframes stamp-in {
    0% { opacity: 0; transform: scale(2.4) rotate(-24deg); }
    55% { opacity: 1; transform: scale(0.92) rotate(-10deg); }
    75% { transform: scale(1.06) rotate(-13deg); }
    100% { opacity: 1; transform: scale(1) rotate(-12deg); }
  }
  @keyframes star-pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.7) rotate(18deg); }
    100% { transform: scale(1) rotate(0); }
  }
  @keyframes toast-in {
    0% { opacity: 0; transform: translateY(18px) scale(0.9); }
    60% { opacity: 1; transform: translateY(-4px) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes confetti-fall {
    0% { opacity: 1; transform: translateY(-8vh) rotate(0) rotateY(0); }
    100% { opacity: 0.9; transform: translateY(105vh) rotate(var(--spin)) rotateY(720deg); }
  }

  .anim-aurora {
    background-image: linear-gradient(115deg, #7c3aed, #d946ef, #38bdf8, #7c3aed);
    background-size: 300% 300%;
    animation: aurora-pan 5s ease infinite;
  }
  .anim-shimmer {
    background-image: linear-gradient(
      110deg,
      var(--color-gray-100) 38%,
      var(--color-gray-200) 50%,
      var(--color-gray-100) 62%
    );
    background-size: 200% 100%;
    animation: shimmer-pan 1.6s linear infinite;
  }
  .anim-float-in { animation: float-in 0.45s ease both; }
  .anim-pop-reveal { animation: pop-reveal 0.7s cubic-bezier(0.22, 1.4, 0.36, 1) both; }
  .anim-glow { animation: glow-pulse 2.2s ease-in-out infinite; }
  .anim-burst-particle { animation: burst-fly 1s cubic-bezier(0.1, 0.8, 0.4, 1) both; }
  .anim-stamp-in { animation: stamp-in 0.4s cubic-bezier(0.3, 1.6, 0.4, 1) both; }
  .anim-star-pop { animation: star-pop 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) both; }
  .anim-toast-in { animation: toast-in 0.4s cubic-bezier(0.25, 1.4, 0.45, 1) both; }
  .anim-confetti {
    animation: confetti-fall var(--dur) cubic-bezier(0.3, 0.4, 0.6, 0.9) var(--delay) both;
  }

  /* staggered entrance: children cascade in top to bottom */
  .anim-stagger > * { animation: float-in 0.4s ease both; }
  .anim-stagger > :nth-child(1) { animation-delay: 0ms; }
  .anim-stagger > :nth-child(2) { animation-delay: 40ms; }
  .anim-stagger > :nth-child(3) { animation-delay: 80ms; }
  .anim-stagger > :nth-child(4) { animation-delay: 120ms; }
  .anim-stagger > :nth-child(5) { animation-delay: 160ms; }
  .anim-stagger > :nth-child(6) { animation-delay: 200ms; }
  .anim-stagger > :nth-child(7) { animation-delay: 240ms; }
  .anim-stagger > :nth-child(8) { animation-delay: 280ms; }
  .anim-stagger > :nth-child(9) { animation-delay: 320ms; }
  .anim-stagger > :nth-child(10) { animation-delay: 360ms; }
  .anim-stagger > :nth-child(n + 11) { animation-delay: 400ms; }

  /* tactile buttons, app-wide */
  button { transition: transform 0.08s ease; }
  button:active:not(:disabled) { transform: scale(0.95); }
}
```

## 2. AiThinking(オーロラオーブ+進行ステップ)+ AuroraBar

```tsx
"use client";

import { useEffect, useState } from "react";

interface Props {
  /** Progress messages cycled every ~2.2s (purely presentational). */
  steps: string[];
  /** Compact = inline row (job lists); default = centered block. */
  compact?: boolean;
}

export default function AiThinking({ steps, compact = false }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (steps.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % steps.length), 2200);
    return () => clearInterval(t);
  }, [steps.length]);

  const orb = (
    <span className="relative inline-flex h-4 w-4 shrink-0">
      <span className="anim-aurora absolute inset-0 rounded-full opacity-40 blur-[3px]" />
      <span className="anim-aurora relative inline-flex h-4 w-4 rounded-full" />
    </span>
  );

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 text-[11px] text-violet-600">
        {orb}
        <span key={idx} className="anim-float-in">{steps[idx % steps.length]}</span>
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <span className="relative inline-flex h-10 w-10">
        <span className="anim-aurora absolute inset-0 rounded-full opacity-40 blur-md" />
        <span className="anim-aurora relative inline-flex h-10 w-10 rounded-full" />
      </span>
      <p key={idx} className="anim-float-in text-xs font-semibold text-violet-600">
        {steps[idx % steps.length]}
      </p>
      <AuroraBar className="w-48" />
    </div>
  );
}

/** Indeterminate aurora progress bar. */
export function AuroraBar({ className = "" }: { className?: string }) {
  return (
    <span className={`block h-1.5 overflow-hidden rounded-full bg-gray-100 ${className}`}>
      <span className="anim-aurora block h-full w-full rounded-full" />
    </span>
  );
}
```

## 3. CountUp(数字ロールアップ)

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  format?: (n: number) => string;
  durationMs?: number;
}

/** Rolls a number up from 0 with an ease-out curve when it first appears. */
export default function CountUp({ value, format, durationMs = 900 }: Props) {
  const [shown, setShown] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, durationMs]);

  const n = Math.round(shown);
  return <>{format ? format(n) : n.toLocaleString()}</>;
}
```

## 4. SparkleBurst(単発完了のパーティクル)

```tsx
"use client";

import { useEffect, useState } from "react";

const COLORS = ["#a78bfa", "#f0abfc", "#38bdf8", "#fbbf24", "#34d399"];
const COUNT = 12;

/** One-shot burst; mount inside a `relative` parent, cleans itself up. */
export default function SparkleBurst() {
  const [gone, setGone] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 28 + Math.random() * 36;
      return {
        dx: `${Math.cos(angle) * dist}px`,
        dy: `${Math.sin(angle) * dist}px`,
        color: COLORS[i % COLORS.length],
        size: 4 + Math.random() * 4,
      };
    }),
  );

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {particles.map((p, i) => (
        <span
          key={i}
          className="anim-burst-particle absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            ["--dx" as string]: p.dx,
            ["--dy" as string]: p.dy,
          }}
        />
      ))}
    </span>
  );
}
```

## 5. ConfettiRain(全件完了の紙吹雪)

```tsx
"use client";

import { useEffect, useState } from "react";

const COLORS = ["#8b5cf6", "#e879f9", "#38bdf8", "#fbbf24", "#34d399", "#fb7185"];
const COUNT = 44;

/** Full-screen one-shot confetti rain for big moments. */
export default function ConfettiRain() {
  const [gone, setGone] = useState(false);
  const [pieces] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      width: 6 + Math.random() * 6,
      height: 8 + Math.random() * 8,
      color: COLORS[i % COLORS.length],
      round: Math.random() < 0.3,
      dur: `${2 + Math.random() * 1.4}s`,
      delay: `${Math.random() * 0.6}s`,
      spin: `${(Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540)}deg`,
    })),
  );

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 4200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`anim-confetti absolute top-0 ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{
            left: p.left,
            width: p.width,
            height: p.round ? p.width : p.height,
            backgroundColor: p.color,
            ["--dur" as string]: p.dur,
            ["--delay" as string]: p.delay,
            ["--spin" as string]: p.spin,
          }}
        />
      ))}
    </div>
  );
}
```

## 6. 使い方の断片

```tsx
// ハンコスタンプ(画像カードの上に重ねる。押した瞬間だけ anim-stamp-in)
{sel?.status && STAMP[sel.status] && (
  <span className={`pointer-events-none absolute right-2 top-2 flex h-14 w-14 -rotate-12
    items-center justify-center rounded-full border-4 bg-white/55 text-sm font-black
    backdrop-blur-[1px] ${STAMP[sel.status].cls} ${justStamped === id ? "anim-stamp-in" : ""}`}>
    {STAMP[sel.status].label}
  </span>
)}

// running→done を検知して一度だけ祝う(justDone方式)
const finished = list.filter(
  (j) => j.status === "done" && prevStatuses.current.get(j.id) === "running",
);
if (finished.length) {
  setJustDone((s) => new Set([...s, ...finished.map((j) => j.id)]));
  setTimeout(() => setJustDone(/* 外す */), 1600);
}
prevStatuses.current = new Map(list.map((j) => [j.id, j.status]));

// 全件完了: 紙吹雪 + OS通知(許可はボタン押下時に requestPermission 済み)
if (n > 0) {
  setCelebrate((c) => c + 1);          // {celebrate > 0 && <ConfettiRain key={celebrate} />}
  toast(`🎉 ${n}枚完成しました!`);
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("アプリ名", { body: `${n}件の処理が完了しました` });
  }
}

// ストリーミング中の明滅カーソル
{loading && text && (
  <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse rounded-sm bg-indigo-400" />
)}
```
