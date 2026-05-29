import { NextResponse } from 'next/server';

// This is a simple proxy API endpoint that returns deterministic answers
// for specific user intents (contact, owner/ceo, manager). For other
// questions it will call a free AI API (example: Hugging Face inference)
// NOTE: Replace HF_API_TOKEN with your real token in environment variables

const HF_API_TOKEN = process.env.HF_API_TOKEN || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';

function applyBusinessRules(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('mobile') || lower.includes('number')) {
    return '9821539140';
  }
  if (lower.includes('owner') || lower.includes('ceo') || lower.includes('founder')) {
    return 'Anush Giri';
  }
  if (lower.includes('manager')) {
    return 'Kusum Nepali';
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = (body.question || '').toString();

    const rule = applyBusinessRules(question);
    if (rule) {
      return NextResponse.json({ answer: rule });
    }

    if (!HF_API_TOKEN) {
      // Fallback deterministic answer when no HF token is provided
      return NextResponse.json({ answer: `Sorry, AI backend not configured. Ask: ${question}` });
    }

    const resp = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: question }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ answer: `AI error: ${text}` }, { status: 500 });
    }

    const data = await resp.json();
    // HuggingFace returns an array for gpt2; adapt as needed for model
    const answer = Array.isArray(data) ? (data[0]?.generated_text || JSON.stringify(data)) : JSON.stringify(data);

    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ answer: 'Server error' }, { status: 500 });
  }
}
