"use client";

import { useEffect, useRef, useState } from "react";

type AudioRig = {
  context: AudioContext;
  master: GainNode;
  nodes: AudioNode[];
  timers: number[];
};

function buildRig(): AudioRig {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  const nodes: AudioNode[] = [];
  const timers: number[] = [];

  const padFrequencies = [55, 110, 164.81, 220];
  for (const frequency of padFrequencies) {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    const gain = context.createGain();
    gain.gain.value = 0.045;
    const wobble = context.createOscillator();
    wobble.frequency.value = 0.07 + Math.random() * 0.08;
    const wobbleGain = context.createGain();
    wobbleGain.gain.value = 0.02;
    wobble.connect(wobbleGain);
    wobbleGain.connect(gain.gain);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    wobble.start();
    nodes.push(oscillator, wobble);
  }

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.connect(master);

  const scale = [220, 261.63, 293.66, 329.63, 392, 440];
  function playNote() {
    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = scale[Math.floor(Math.random() * scale.length)]! * 2;
    const gain = context.createGain();
    const now = context.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start(now);
    oscillator.stop(now + 1.8);
    timers.push(window.setTimeout(playNote, 1400 + Math.random() * 2600));
  }
  timers.push(window.setTimeout(playNote, 800));

  return { context, master, nodes, timers };
}

export function Soundtrack() {
  const rigRef = useRef<AudioRig | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      const rig = rigRef.current;
      if (!rig) return;
      rig.timers.forEach((timer) => window.clearTimeout(timer));
      void rig.context.close();
      rigRef.current = null;
    };
  }, []);

  async function toggle() {
    if (!rigRef.current) {
      rigRef.current = buildRig();
    }
    const rig = rigRef.current;
    await rig.context.resume();
    const now = rig.context.currentTime;
    rig.master.gain.cancelScheduledValues(now);
    if (playing) {
      rig.master.gain.linearRampToValueAtTime(0, now + 0.4);
    } else {
      rig.master.gain.linearRampToValueAtTime(0.5, now + 1.2);
    }
    setPlaying(!playing);
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={playing}
      className="group flex h-8 items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-950/40 px-3 font-mono text-xs uppercase tracking-widest text-cyan-300 transition hover:border-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,0.4)]"
    >
      <span className="flex h-3 items-end gap-0.5" aria-hidden>
        {[0, 1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={
              playing
                ? "h-3 w-0.5 origin-bottom animate-equalize bg-cyan-300"
                : "h-1 w-0.5 bg-cyan-700"
            }
            style={playing ? { animationDelay: `${bar * 0.15}s` } : undefined}
          />
        ))}
      </span>
      {playing ? "AUDIO ON" : "AUDIO OFF"}
    </button>
  );
}
