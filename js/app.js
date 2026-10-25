/* ==========================================================
   Prism Idea Forge · App logic
   (c) 2026 Prism Protocol · MIT License
   ========================================================== */
(function () {
    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    const STORE = { settings: 'forge_settings', key: 'forge_key', history: 'forge_history' };
    const THEME_SUGGESTIONS = ['Climate action', 'Mental health for students', 'AI for farmers', 'Financial literacy for teens', 'Accessible cities', 'Open-source onboarding', 'Disaster response'];
    const HERO_WORDS = ['winning', 'AI-powered', 'world-changing', 'judge-pleasing', 'shippable'];

    const state = { count: 3, lastInput: null, lastIdeas: [], controller: null, sessionKey: '' };

    /* ---------------- settings ---------------- */
    function loadSettings() {
        const saved = JSON.parse(localStorage.getItem(STORE.settings) || '{}');
        return { provider: saved.provider || 'gemini', model: saved.model || '', baseUrl: saved.baseUrl || '' };
    }
    const getKey = () => localStorage.getItem(STORE.key) || state.sessionKey || '';

    function resolveProvider() {
        const s = loadSettings();
        const p = PROVIDERS[s.provider] || PROVIDERS.gemini;
        return { id: s.provider, url: s.baseUrl || p.url, model: s.model || p.model, key: getKey() };
    }

    function updateModePill() {
        const pill = $('#mode-pill');
        const { id, key } = resolveProvider();
        const live = Boolean(key) || (id === 'custom' && loadSettings().baseUrl);
        pill.textContent = live ? `${PROVIDERS[id].label.split(' (')[0]}` : 'Demo mode';
        pill.classList.toggle('live', live);
    }

    function fillSettingsForm() {
        const s = loadSettings();
        const sel = $('#provider');
        sel.innerHTML = Object.entries(PROVIDERS).map(([id, p]) => `<option value="${id}">${p.label}</option>`).join('');
        sel.value = s.provider;
        $('#model').value = s.model;
        $('#base-url').value = s.baseUrl;
        $('#api-key').value = getKey();
        onProviderChange();
    }

    function onProviderChange() {
        const p = PROVIDERS[$('#provider').value];
        $('#model').placeholder = p.model || 'model id';
        $('#base-url').placeholder = p.url || 'https://your-server/v1/chat/completions';
        $('#provider-note').innerHTML = p.keyUrl ? `${p.note.split(' at ')[0]} at <a href="${p.keyUrl}" target="_blank" rel="noopener">${new URL(p.keyUrl).host}</a>` : p.note;
        const custom = $('#provider').value === 'custom';
        $('#base-url-label').textContent = custom ? 'Base URL (required)' : 'Base URL (optional override)';
    }

    function saveSettings() {
        const provider = $('#provider').value;
        if (provider === 'custom' && !$('#base-url').value.trim()) return toast('Custom provider needs a Base URL');
        localStorage.setItem(STORE.settings, JSON.stringify({ provider, model: $('#model').value.trim(), baseUrl: $('#base-url').value.trim() }));
        const key = $('#api-key').value.trim();
        if ($('#remember-key').checked) {
            localStorage.setItem(STORE.key, key);
            state.sessionKey = '';
        } else {
            localStorage.removeItem(STORE.key);
            state.sessionKey = key;
        }
        updateModePill();
        closeDrawers();
        toast(key ? '✅ Settings saved. AI mode on' : 'Saved. Using demo mode');
    }

    /* ---------------- prompt ---------------- */
    function buildMessages(input) {
        const system = `You are a world-class hackathon mentor who has judged 200+ hackathons.
You generate original, specific, buildable project ideas. Avoid generic to-do apps and chatbots-without-a-twist.
Respond with ONLY valid JSON, no markdown, matching exactly:
{"ideas":[{"name":string,"emoji":string,"tagline":string,"problem":string,"solution":string,"features":[string,string,string,string],"techStack":[string],"mvpPlan":[{"phase":string,"task":string}],"pitch":string,"wowFactor":string,"difficulty":"Easy"|"Medium"|"Hard","judgesWillLove":[string,string,string]}]}`;

        const user = `Generate ${input.count} hackathon idea(s).
Theme: ${input.theme}
Track: ${input.track}
Duration: ${input.duration} hours
Team: ${input.team} people, ${input.skill} level
Preferred tech: ${input.stack || 'any'}

Rules:
- Names must be short and brandable (1–2 words).
- "problem" and "solution": 2 sentences each, concrete and specific.
- "mvpPlan": 4–6 phases that fit inside ${input.duration} hours, with phase labels like "H0–H3 · Setup".
- "pitch": a 30-second spoken pitch (about 70 words) with a hook.
- "techStack": 4–7 realistic technologies a ${input.skill.toLowerCase()} team can ship in time.
- Each idea must use a different approach.`;

        return [{ role: 'system', content: system }, { role: 'user', content: user }];
    }

    function validateIdeas(data) {
        const ideas = Array.isArray(data) ? data : data.ideas;
        if (!Array.isArray(ideas) || !ideas.length) throw new Error('The AI response did not contain any ideas.');
        return ideas.map(i => ({
            name: String(i.name || 'Untitled'),
            emoji: String(i.emoji || '✦').slice(0, 4),
            tagline: String(i.tagline || ''),
            problem: String(i.problem || ''),
            solution: String(i.solution || ''),
            features: (i.features || []).map(String).slice(0, 8),
            techStack: (i.techStack || []).map(String).slice(0, 10),
            mvpPlan: (i.mvpPlan || []).map(p => (typeof p === 'string' ? { phase: '', task: p } : { phase: String(p.phase || ''), task: String(p.task || '') })),
            pitch: String(i.pitch || ''),
            wowFactor: String(i.wowFactor || ''),
            difficulty: ['Easy', 'Medium', 'Hard'].includes(i.difficulty) ? i.difficulty : 'Medium',
            judgesWillLove: (i.judgesWillLove || []).map(String).slice(0, 5)
        }));
    }

    /* ---------------- rendering ---------------- */
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function ideaCard(idea, i) {
        return `
        <article class="idea" style="animation-delay:${i * 120}ms">
            <div class="idea-top">
                <div>
                    <div class="idea-index">IDEA ${String(i + 1).padStart(2, '0')}</div>
                    <h3>${esc(idea.emoji)} ${esc(idea.name)}</h3>
                    <p class="tagline">${esc(idea.tagline)}</p>
                </div>
                <div class="idea-meta">
                    <span class="badge diff-${idea.difficulty}">● ${idea.difficulty}</span>
                    <span class="badge">⏱ ${state.lastInput.duration}h</span>
                    <span class="badge">👥 ${state.lastInput.team}</span>
                </div>
            </div>
            <div class="idea-body">
                <div class="block"><h4>😣 Problem</h4><p>${esc(idea.problem)}</p></div>
                <div class="block"><h4>💡 Solution</h4><p>${esc(idea.solution)}</p></div>
                <div class="block"><h4>🧩 Key features</h4><ul>${idea.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
                <div class="block"><h4>🛠 Tech stack</h4><div class="stack">${idea.techStack.map(t => `<span>${esc(t)}</span>`).join('')}</div>
                    ${idea.judgesWillLove.length ? `<h4 style="margin-top:16px">🏆 Judges will love</h4><ul>${idea.judgesWillLove.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
                </div>
                <div class="block"><h4>🗓 MVP plan</h4><ul class="timeline">${idea.mvpPlan.map(p => `<li><b>${esc(p.phase)}</b>${esc(p.task)}</li>`).join('')}</ul></div>
                <div class="block"><h4>🎤 30-second pitch</h4><p class="pitch">${esc(idea.pitch)}</p>
                    <h4 style="margin-top:16px">✨ Wow factor</h4><p class="wow">${esc(idea.wowFactor)}</p>
                </div>
            </div>
            <div class="idea-actions">
                <button class="ghost-btn" data-copy="${i}">📋 Copy idea</button>
                <button class="ghost-btn" data-readme="${i}">📄 Copy as README</button>
            </div>
        </article>`;
    }

    function render(ideas) {
        state.lastIdeas = ideas;
        $('#idea-grid').innerHTML = ideas.map(ideaCard).join('');
        $('#results').hidden = false;
        $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------------- markdown export ---------------- */
    function ideaMarkdown(idea, i, input = state.lastInput) {
        return `## ${i + 1}. ${idea.emoji} ${idea.name}
> ${idea.tagline}

**Difficulty:** ${idea.difficulty} · **Duration:** ${input.duration}h · **Team:** ${input.team}

### Problem
${idea.problem}

### Solution
${idea.solution}

### Key features
${idea.features.map(f => `- ${f}`).join('\n')}

### Tech stack
${idea.techStack.map(t => `\`${t}\``).join(' · ')}

### MVP plan
${idea.mvpPlan.map(p => `- **${p.phase}**: ${p.task}`).join('\n')}

### 30-second pitch
${idea.pitch}

### Wow factor
${idea.wowFactor}
`;
    }

    function readmeMarkdown(idea) {
        return `<h1 align="center">${idea.emoji} ${idea.name}</h1>
<p align="center"><b>${idea.tagline}</b></p>

## The problem
${idea.problem}

## Our solution
${idea.solution}

## Features
${idea.features.map(f => `- ✅ ${f}`).join('\n')}

## Built with
${idea.techStack.map(t => `- ${t}`).join('\n')}

## Getting started
\`\`\`bash
git clone https://github.com/your-team/${idea.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git
\`\`\`

---
<sub>Idea forged with <a href="https://github.com/krishyaa06/prism-idea-forge">Prism Idea Forge</a></sub>
`;
    }

    const allMarkdown = () =>
        `# ✦ Hackathon ideas: ${state.lastInput.theme}\n_Track: ${state.lastInput.track} · Generated with Prism Idea Forge_\n\n` +
        state.lastIdeas.map((idea, i) => ideaMarkdown(idea, i)).join('\n---\n\n');

    async function copy(text, label = 'Copied') {
        try {
            await navigator.clipboard.writeText(text);
            toast(`📋 ${label}`);
        } catch {
            toast('Copy failed. Your browser blocked clipboard access');
        }
    }

    function download() {
        const blob = new Blob([allMarkdown()], { type: 'text/markdown' });
        const a = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(blob),
            download: `ideas-${state.lastInput.theme.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.md`
        });
        a.click();
        URL.revokeObjectURL(a.href);
    }

    /* ---------------- history ---------------- */
    const getHistory = () => JSON.parse(localStorage.getItem(STORE.history) || '[]');
    function pushHistory(input, ideas) {
        const list = [{ input, ideas, at: Date.now() }, ...getHistory()].slice(0, 20);
        localStorage.setItem(STORE.history, JSON.stringify(list));
    }
    function renderHistory() {
        const list = getHistory();
        $('#history-list').innerHTML = list.length
            ? list.map((h, i) => `<li data-history="${i}"><b>${esc(h.input.theme)}</b><small>${h.ideas.map(x => esc(x.name)).join(' · ')}</small><small>${new Date(h.at).toLocaleString()}</small></li>`).join('')
            : '<li class="empty">No ideas yet. Forge your first batch!</li>';
    }

    /* ---------------- loading animation ---------------- */
    const LOG_LINES = ['Reading the theme', 'Scanning past winning projects', 'Mapping real-world pain points', 'Forging concepts', 'Planning the MVP timeline', 'Writing the pitch'];
    let logTimer = null;
    function startLoading() {
        $('#loading').hidden = false;
        $('#error').hidden = true;
        const log = $('#loading-log');
        log.innerHTML = '';
        let i = 0;
        const step = () => {
            log.lastElementChild?.classList.add('done');
            if (i < LOG_LINES.length) log.insertAdjacentHTML('beforeend', `<li>${LOG_LINES[i++]}...</li>`);
        };
        step();
        logTimer = setInterval(step, 900);
        $('#forge-btn').disabled = true;
        $('.forge-btn-label').textContent = '✦ Forging...';
    }
    function stopLoading() {
        clearInterval(logTimer);
        $('#loading').hidden = true;
        $('#forge-btn').disabled = false;
        $('.forge-btn-label').textContent = '✦ Forge ideas';
    }

    /* ---------------- main flow ---------------- */
    function readInput() {
        return {
            theme: $('#theme').value.trim(),
            track: $('#track').value,
            duration: $('#duration').value,
            skill: $('#skill').value,
            team: Number($('#team').value),
            stack: $('#stack').value.trim(),
            count: state.count
        };
    }

    async function forge(input = readInput()) {
        if (!input.theme) {
            $('#theme').focus();
            return toast('Add a theme first ✍️');
        }
        state.lastInput = input;
        state.controller?.abort();
        state.controller = new AbortController();
        startLoading();

        try {
            const p = resolveProvider();
            let ideas;
            if (!p.key && !(p.id === 'custom' && p.url)) {
                await new Promise(r => setTimeout(r, 2600)); // let the animation breathe
                ideas = demoIdeas(input);
                toast('Demo mode: add a free API key in ⚙️ for real AI ideas');
            } else {
                const text = await callChat({ url: p.url, model: p.model, key: p.key, messages: buildMessages(input), signal: state.controller.signal });
                ideas = validateIdeas(extractJson(text));
            }
            pushHistory(input, ideas);
            render(ideas);
        } catch (err) {
            if (err.name === 'AbortError') return;
            $('#error').hidden = false;
            $('#error').innerHTML = `<b>Couldn't forge ideas.</b><br>${esc(err.message)}<br><small>Tip: check your key and model in ⚙️ AI Settings, or clear the key to use demo mode.</small>`;
        } finally {
            stopLoading();
        }
    }

    /* ---------------- UI helpers ---------------- */
    let toastTimer;
    function toast(msg) {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
    }

    function openDrawer(id) {
        $(`#${id}`).classList.add('open');
        $(`#${id}`).setAttribute('aria-hidden', 'false');
    }
    function closeDrawers() {
        $$('.drawer').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
    }

    function heroRotate() {
        const el = $('#hero-word');
        let i = 0;
        setInterval(() => {
            i = (i + 1) % HERO_WORDS.length;
            el.textContent = HERO_WORDS[i];
            el.classList.remove('swap');
            void el.offsetWidth;
            el.classList.add('swap');
        }, 2600);
    }

    function starfield() {
        const c = $('#stars');
        const ctx = c.getContext('2d');
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let stars = [];
        const resize = () => {
            const dpr = devicePixelRatio || 1;
            c.width = innerWidth * dpr;
            c.height = innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            stars = Array.from({ length: Math.min(120, Math.floor(innerWidth / 10)) }, () => ({
                x: Math.random() * innerWidth, y: Math.random() * innerHeight,
                r: Math.random() * 1.2 + 0.2, s: Math.random() * 0.3 + 0.05, p: Math.random() * Math.PI * 2
            }));
        };
        resize();
        addEventListener('resize', resize);
        const draw = t => {
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (const s of stars) {
                const a = 0.35 + Math.sin(t / 900 + s.p) * 0.3;
                ctx.fillStyle = `rgba(200, 210, 255, ${a})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                if (!reduce) { s.y -= s.s; if (s.y < -2) { s.y = innerHeight + 2; s.x = Math.random() * innerWidth; } }
            }
            if (!reduce) requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    /* ---------------- wire up ---------------- */
    function init() {
        $('#theme-chips').innerHTML = THEME_SUGGESTIONS.map(t => `<button type="button" class="chip">${t}</button>`).join('');
        $('#theme-chips').addEventListener('click', e => {
            if (e.target.classList.contains('chip')) { $('#theme').value = e.target.textContent; $('#theme').focus(); }
        });

        $$('.stepper button').forEach(b => b.addEventListener('click', () => {
            const input = $('#team');
            input.value = Math.min(6, Math.max(1, Number(input.value) + Number(b.dataset.step)));
        }));

        $('#count').addEventListener('click', e => {
            const b = e.target.closest('button');
            if (!b) return;
            $$('#count button').forEach(x => x.classList.toggle('active', x === b));
            state.count = Number(b.dataset.value);
        });

        $('#forge-form').addEventListener('submit', e => { e.preventDefault(); forge(); });
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') forge();
            if (e.key === 'Escape') closeDrawers();
        });

        $('#copy-all').addEventListener('click', () => copy(allMarkdown(), 'All ideas copied as Markdown'));
        $('#download-md').addEventListener('click', download);
        $('#regenerate').addEventListener('click', () => forge(state.lastInput));
        $('#idea-grid').addEventListener('click', e => {
            const b = e.target.closest('button');
            if (!b) return;
            if (b.dataset.copy) copy(ideaMarkdown(state.lastIdeas[b.dataset.copy], Number(b.dataset.copy)), 'Idea copied');
            if (b.dataset.readme) copy(readmeMarkdown(state.lastIdeas[b.dataset.readme]), 'README starter copied');
        });

        $('#open-settings').addEventListener('click', () => { fillSettingsForm(); openDrawer('settings'); });
        $('#open-history').addEventListener('click', () => { renderHistory(); openDrawer('history'); });
        $$('.drawer').forEach(d => d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) closeDrawers(); }));
        $('#provider').addEventListener('change', onProviderChange);
        $('#save-settings').addEventListener('click', saveSettings);
        $('#toggle-key').addEventListener('click', () => {
            const k = $('#api-key');
            k.type = k.type === 'password' ? 'text' : 'password';
        });
        $('#clear-key').addEventListener('click', () => {
            localStorage.removeItem(STORE.key);
            state.sessionKey = '';
            $('#api-key').value = '';
            updateModePill();
            closeDrawers();
            toast('Demo mode on');
        });
        $('#history-list').addEventListener('click', e => {
            const li = e.target.closest('[data-history]');
            if (!li) return;
            const h = getHistory()[li.dataset.history];
            state.lastInput = h.input;
            closeDrawers();
            render(h.ideas);
        });
        $('#clear-history').addEventListener('click', () => { localStorage.removeItem(STORE.history); renderHistory(); toast('History cleared'); });

        updateModePill();
        heroRotate();
        starfield();
    }

    // Expose pure helpers for tests
    window.ForgeInternals = { buildMessages, validateIdeas, ideaMarkdown };
    init();
})();
