"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Play, Pause, Mic } from "lucide-react";

export interface VoiceNotePlayerProps {
  src: string;
  label?: string;
}

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * VoiceNotePlayer — Lecteur audio sobre conforme à DESIGN.md permettant à l'usager
 * de réécouter sa propre note vocale dans sa bulle de chat.
 */
export default function VoiceNotePlayer({
  src,
  label = "Note vocale",
}: VoiceNotePlayerProps) {
  const rangeId = useId();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(e.target.value);
    setCurrentTime(nextTime);
    if (audio && Number.isFinite(nextTime)) {
      audio.currentTime = nextTime;
    }
  };

  const progressMax = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const progressValue = Math.min(currentTime, progressMax);

  return (
    <div
      data-testid="voice-note-player"
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 min-w-[210px] sm:min-w-[250px]"
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onDurationChange={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setIsPlaying(false);
        }}
        className="hidden"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Mettre en pause la note vocale" : "Lire la note vocale"}
        title={isPlaying ? "Mettre en pause" : "Écouter votre note vocale"}
        className="w-9 h-9 rounded-full bg-[#0F2942] hover:bg-[#001428] dark:bg-[#0066C5] dark:hover:bg-[#1A75D0] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#0A0D14] dark:text-white/90">
          <span className="inline-flex items-center gap-1 truncate">
            <Mic className="w-3 h-3 text-[#0F2942] dark:text-[#58A6FF] shrink-0" />
            <span className="truncate">{label}</span>
          </span>
          <span className="font-mono text-[10px] text-[#525866] dark:text-white/60 shrink-0">
            {formatAudioTime(currentTime)}
            {duration > 0 ? ` / ${formatAudioTime(duration)}` : ""}
          </span>
        </div>

        <input
          id={rangeId}
          name="voice_note_progress"
          type="range"
          min={0}
          max={progressMax}
          step={0.1}
          value={progressValue}
          onChange={handleSeek}
          aria-label="Progression de la note vocale"
          className="w-full h-1.5 accent-[#0F2942] dark:accent-[#0066C5] cursor-pointer"
        />
      </div>
    </div>
  );
}
