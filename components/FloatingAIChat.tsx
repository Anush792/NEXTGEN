"use client";

import React, { useEffect, useRef, useState } from "react";
import { logMessage } from "@/lib/firebase-client";

type Msg = { from: "user" | "bot"; text: string };

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi, I am NextGen. Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((p) => [...p, { from: "user", text }]);
    setInput("");
    setLoading(true);
    const makeRequest = async () => {
      const resp = await fetch('/api/nextgen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const j = await resp.json().catch(() => ({}));
      return { resp, json: j };
    };

    try {
      let attempt = 0;
      let result: { resp: Response; json: any } | null = null;
      while (attempt < 2) {
        try {
          result = await makeRequest();
          // for network-level failures, fetch would throw; here we got a response
          break;
        } catch (e) {
          attempt += 1;
          if (attempt >= 2) throw e;
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      if (!result) throw new Error('No response from server');

      const { resp, json } = result;
      if (!resp.ok) {
        const errMsg = json?.error || json?.message || `NextGen error: ${resp.status}`;
        setMessages((p) => [...p, { from: 'bot', text: `NextGen: ${errMsg}` }]);
        try { logMessage({ role: 'error', text: 'NextGen API error', extra: String(errMsg) }); } catch (_) {}
      } else {
        const reply = json?.reply ?? json?.answer ?? 'No response from NextGen.';
        setMessages((p) => [...p, { from: 'bot', text: reply }]);
        if (voiceOn) speak(reply);
        try { logMessage({ role: 'user', text }); logMessage({ role: 'bot', text: reply }); } catch (_) {}
      }
    } catch (err: any) {
      const message = (err && err.message) ? err.message : 'Error contacting NextGen.';
      setMessages((p) => [...p, { from: 'bot', text: `Error: ${message}` }]);
      try { logMessage({ role: 'error', text: 'Error contacting NextGen', extra: String(err) }); } catch (_) {}
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const preferred = pickFemaleVoice(voices);
    if (preferred) utter.voice = preferred;
    utter.lang = utter.voice?.lang || 'en-US';
    utter.pitch = 1.2;
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const pickFemaleVoice = (all: SpeechSynthesisVoice[]) => {
    if (!all || all.length === 0) return undefined;
    const priority = [
      /female/i,
      /google uk english female/i,
      /amy|sara|samantha|zira|kristen|alloy/i,
    ];
    for (const re of priority) {
      const v = all.find((vv) => re.test(vv.name));
      if (v) return v;
    }
    // fallback: choose voice with 'en' locale and not marked male in name
    const en = all.find((v) => /en/.test(v.lang));
    return en || all[0];
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const load = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;

    // setup speech recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = 'en-US';
      r.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        setInput(t);
        setRecognizing(false);
        // auto-send after recognition
        setTimeout(() => send(), 150);
      };
      r.onerror = () => setRecognizing(false);
      recognitionRef.current = r;
    }
  }, []);

  // When voice is enabled (unmuted), play a short friendly "cute girl" greeting
  useEffect(() => {
    if (!voiceOn) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const timer = setTimeout(() => {
      try {
        const all = voices;
        const utter = new SpeechSynthesisUtterance("Hi, I'm NextGen. I'm here to help you.");
        const preferred = pickFemaleVoice(all);
        if (preferred) utter.voice = preferred;
        utter.lang = utter.voice?.lang || 'en-US';
        utter.pitch = 1.4;
        utter.rate = 1.05;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }, 300);
    return () => clearTimeout(timer);
  }, [voiceOn, voices]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="w-80 md:w-96 bg-[#0b0f16] bg-gradient-to-b from-[#071021] to-[#0b1220] rounded-xl shadow-lg border border-slate-800 text-slate-100 font-mono overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-[#0f1724] to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-gradient-to-tr from-[#00f5a0] to-[#00e0ff] flex items-center justify-center text-black font-bold">N</div>
                <div>
                  <div className="text-sm font-semibold">NextGen</div>
                  <div className="text-xs text-slate-400">AI Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-sm">
                  Close
                </button>
              </div>
            </div>

            <div ref={containerRef} className="h-64 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
                  <div className={`inline-block max-w-full break-words px-3 py-2 rounded ${
                    m.from === "user" ? "bg-slate-700 text-white" : "bg-[#011627] text-slate-200"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3 py-2 flex gap-2 border-t border-slate-800 items-center">
              <button
                title="Toggle voice responses"
                onClick={() => setVoiceOn((v) => !v)}
                className={`px-2 py-1 rounded ${voiceOn ? 'bg-slate-200 text-black' : 'bg-transparent text-slate-400'}`}
              >
                {voiceOn ? '🔊' : '🔈'}
              </button>

              <button
                title="Hold to speak (start/stop)"
                onClick={() => {
                  const r = recognitionRef.current;
                  if (!r) return;
                  if (recognizing) {
                    r.stop();
                    setRecognizing(false);
                  } else {
                    try {
                      r.start();
                      setRecognizing(true);
                    } catch (_) {
                      setRecognizing(false);
                    }
                  }
                }}
                className={`px-2 py-1 rounded ${recognizing ? 'bg-red-500 text-white' : 'bg-transparent text-slate-400'}`}
              >
                {recognizing ? '🎙️...' : '🎤'}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                placeholder="Ask me anything..."
              />
              <button onClick={send} disabled={loading} className="bg-gradient-to-r from-[#00f5a0] to-[#00e0ff] text-black px-3 py-1 rounded disabled:opacity-50">
                {loading ? "..." : "Send"}
              </button>
            </div>

            <div className="px-3 py-2 text-xs text-slate-500">Tip: For contact/owner/manager questions, NextGen returns internal info.</div>
          </div>
        )}

        <button onClick={() => setOpen((o) => !o)} className="mt-3 h-12 w-12 rounded-full bg-gradient-to-tr from-[#00e0ff] to-[#00f5a0] shadow-lg flex items-center justify-center text-black font-bold">
          N
        </button>
      </div>
    </div>
  );
}

