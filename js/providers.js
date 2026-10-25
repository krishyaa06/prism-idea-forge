/* ==========================================================
   Prism Idea Forge · AI providers (OpenAI-compatible APIs)
   ========================================================== */
window.PROVIDERS = {
    gemini: {
        label: 'Google Gemini (free tier)',
        url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        model: 'gemini-2.5-flash',
        note: 'Free key at aistudio.google.com/apikey',
        keyUrl: 'https://aistudio.google.com/apikey'
    },
    groq: {
        label: 'Groq (free tier, very fast)',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',
        note: 'Free key at console.groq.com/keys',
        keyUrl: 'https://console.groq.com/keys'
    },
    openrouter: {
        label: 'OpenRouter',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        note: 'Many free models at openrouter.ai/keys',
        keyUrl: 'https://openrouter.ai/keys'
    },
    openai: {
        label: 'OpenAI',
        url: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
        note: 'Key at platform.openai.com/api-keys',
        keyUrl: 'https://platform.openai.com/api-keys'
    },
    custom: {
        label: 'Custom (OpenAI-compatible)',
        url: '',
        model: '',
        note: 'Any /chat/completions endpoint, e.g. a local LM Studio or Ollama server'
    }
};

/**
 * Calls an OpenAI-compatible chat endpoint and returns the text reply.
 */
window.callChat = async function callChat({ url, model, key, messages, signal }) {
    const headers = { 'Content-Type': 'application/json' };
    if (key) headers.Authorization = `Bearer ${key}`;
    if (url.includes('openrouter.ai')) {
        headers['HTTP-Referer'] = location.origin;
        headers['X-Title'] = 'Prism Idea Forge';
    }

    const res = await fetch(url, {
        method: 'POST',
        headers,
        signal,
        body: JSON.stringify({ model, messages, temperature: 0.9 })
    });

    if (!res.ok) {
        let detail = '';
        try {
            const body = await res.json();
            detail = body.error?.message || body.message || JSON.stringify(body).slice(0, 200);
        } catch { /* ignore */ }
        const hints = {
            400: 'Bad request. Check the model name.',
            401: 'Invalid API key.',
            403: 'This key does not have access to that model.',
            404: 'Endpoint or model not found.',
            429: 'Rate limit or quota reached. Wait a moment and retry.'
        };
        throw new Error(`${hints[res.status] || `Provider error (HTTP ${res.status}).`}${detail ? ` · ${detail}` : ''}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('The model returned an empty response.');
    return text;
};

/**
 * Pulls a JSON object out of an LLM reply (handles ```json fences and chatter).
 */
window.extractJson = function extractJson(text) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : text;
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end <= start) throw new Error('Could not find JSON in the AI response.');
    return JSON.parse(candidate.slice(start, end + 1));
};
