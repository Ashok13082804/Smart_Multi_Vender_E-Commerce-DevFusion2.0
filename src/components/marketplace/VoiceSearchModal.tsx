"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, X, Sparkles, ArrowRight } from "lucide-react";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (transcript: string) => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onSearch }: VoiceSearchModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript("");
      setError(null);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);
      };

      recognition.onerror = (event: any) => {
        setError(`Voice search error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        recognition.abort();
      };
    } catch (e: any) {
      setError("Failed to start microphone.");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmSearch = () => {
    if (transcript.trim()) {
      onSearch(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 text-center animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nexora Voice Intelligence</h3>
        </div>

        {/* Listening Ripple Animation */}
        <div className="relative flex items-center justify-center my-8">
          {isListening && (
            <div className="absolute w-24 h-24 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full animate-ping" />
          )}
          <div
            className={`relative z-10 w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg transition-transform ${
              isListening ? "bg-gradient-to-r from-blue-600 to-indigo-600 scale-110" : "bg-gray-400"
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10" />}
          </div>
        </div>

        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
          {isListening ? "Listening... Speak your query naturally" : "Speech processing complete"}
        </p>

        {/* Display Transcript */}
        <div className="min-h-[60px] bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 flex items-center justify-center text-gray-800 dark:text-gray-200 font-medium text-base border border-gray-100 dark:border-gray-700/50 mb-6">
          {transcript ? (
            `"${transcript}"`
          ) : (
            <span className="text-gray-400 text-sm italic">
              Try saying: "Show me running shoes under 3000 rupees"
            </span>
          )}
        </div>

        {error && <p className="text-xs text-rose-500 mb-4">{error}</p>}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setTranscript("");
              setIsListening(true);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleConfirmSearch}
            disabled={!transcript.trim()}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg flex items-center gap-2 transition-colors"
          >
            Search Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
