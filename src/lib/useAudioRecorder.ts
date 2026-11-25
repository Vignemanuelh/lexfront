"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface UseAudioRecorderOptions {
  onAudioReady: (audioBlob: Blob) => void;
}

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  isRequestingMic: boolean;
  recordingSeconds: number;
  audioError: string | null;
  clearAudioError: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  formatTimer: (seconds: number) => string;
}

/**
 * Hook partagé d'enregistrement vocal via MediaRecorder (audio/webm).
 * Utilisé de façon identique par HeroSection, StickyBottomSearch et ChatInputBar.
 * N'injecte jamais de question simulée en cas de refus ou d'indisponibilité micro :
 * expose explicitement `audioError` pour informer l'usager.
 */
export function useAudioRecorder({
  onAudioReady,
}: UseAudioRecorderOptions): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onAudioReadyRef = useRef(onAudioReady);

  useEffect(() => {
    onAudioReadyRef.current = onAudioReady;
  }, [onAudioReady]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stopTimer]);

  const clearAudioError = useCallback(() => {
    setAudioError(null);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRequestingMic || isRecording) return;
    setAudioError(null);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setAudioError(
        "L'enregistrement vocal n'est pas supporté par ce navigateur. Vous pouvez saisir votre question par écrit."
      );
      return;
    }

    try {
      setIsRequestingMic(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (audioChunksRef.current.length > 0) {
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = [];
          onAudioReadyRef.current(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      stopTimer();
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : "";
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setAudioError(
          "Accès au microphone refusé. Autorisez le microphone dans votre navigateur ou saisissez votre question par écrit."
        );
      } else {
        setAudioError(
          "Aucun microphone disponible ou périphérique occupé. Vous pouvez saisir votre question par écrit."
        );
      }
    } finally {
      setIsRequestingMic(false);
    }
  }, [isRecording, isRequestingMic, stopTimer]);

  const stopRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, [stopTimer]);

  const cancelRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
    }
    audioChunksRef.current = [];
    setRecordingSeconds(0);
  }, [stopTimer]);

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  return {
    isRecording,
    isRequestingMic,
    recordingSeconds,
    audioError,
    clearAudioError,
    startRecording,
    stopRecording,
    cancelRecording,
    formatTimer,
  };
}
