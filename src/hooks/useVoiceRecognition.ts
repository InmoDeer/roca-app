"use client";

import { useState, useRef, useCallback } from "react";

export function useVoiceRecognition(onResult: (transcript: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);

  const supported =
    typeof window !== "undefined" &&
    !!(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition as new () => ReturnType<typeof createSpeechRecognition> ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition as new () => ReturnType<typeof createSpeechRecognition>;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-PE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: unknown) => {
      const event = e as { results: [[{ transcript: string }]] };
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [supported, onResult]);

  return { listening, supported, startListening, stopListening };
}

function createSpeechRecognition() {
  // Type helper — not directly callable, exists for the ref type
  return {} as {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((e: unknown) => void) | null;
    onerror: ((e: unknown) => void) | null;
    onend: (() => void) | null;
  };
}
