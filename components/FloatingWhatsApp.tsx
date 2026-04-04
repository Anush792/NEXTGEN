'use client';

import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20your%20courses"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:bg-emerald-700 hover:scale-110"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}