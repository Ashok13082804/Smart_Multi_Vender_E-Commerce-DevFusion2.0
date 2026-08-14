"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("NEXORA Global Application Exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
            ⚠️
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Application Exception</h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              A critical server exception occurred. Please click below to refresh the marketplace interface.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-indigo-400 bg-slate-800 py-1 px-3 rounded-lg inline-block">
                Digest ID: {error.digest}
              </p>
            )}
          </div>

          <button
            onClick={() => reset()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Refresh NEXORA Platform
          </button>
        </div>
      </body>
    </html>
  );
}
