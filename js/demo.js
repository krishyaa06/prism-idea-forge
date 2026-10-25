/* ==========================================================
   Prism Idea Forge · Offline demo generator
   Builds structured ideas from templates so the app works
   without an API key (great for live demos and screenshots).
   ========================================================== */
(function () {
    const ARCHETYPES = [
        {
            suffix: 'Pulse', emoji: '📡', kind: 'real-time insight dashboard',
            solution: t => `A live dashboard that turns scattered ${t} data into clear, actionable signals, with an AI assistant that explains what changed and what to do next.`,
            features: ['Live data ingestion from public APIs and CSV uploads', 'AI summary: “what changed today” in plain language', 'Smart alerts when a metric crosses a threshold', 'Shareable public report link'],
            wow: 'Ask the dashboard a question in natural language and watch it build the chart for you.'
        },
        {
            suffix: 'Mate', emoji: '🤝', kind: 'AI companion app',
            solution: t => `A friendly AI companion that guides people through ${t} step by step, remembers their progress and nudges them at the right moment.`,
            features: ['Conversational onboarding that builds a personal plan', 'Daily micro-tasks with streaks and XP', 'Voice input for low-literacy and hands-free use', 'Progress timeline with weekly AI reflection'],
            wow: 'The companion adapts its tone and difficulty to each user after just three conversations.'
        },
        {
            suffix: 'Hub', emoji: '🌐', kind: 'community marketplace',
            solution: t => `A local community hub that connects people who need help with ${t} to verified volunteers, mentors and resources nearby.`,
            features: ['Map of nearby resources and volunteers', 'Request → match → chat flow in under 60 seconds', 'Reputation badges and verified profiles', 'Discord bot that posts new requests to a server'],
            wow: 'An AI matcher pairs requests with the best helper using skills, distance and availability.'
        },
        {
            suffix: 'Lens', emoji: '🔍', kind: 'computer-vision tool',
            solution: t => `Point your phone camera at anything related to ${t} and get instant AI analysis, explanations and next steps.`,
            features: ['Camera capture with on-device pre-processing', 'Vision model classifies and explains the scene', 'History gallery with notes and tags', 'Offline fallback with a lightweight model'],
            wow: 'Live AR overlay labels what the camera sees in real time.'
        },
        {
            suffix: 'Quest', emoji: '🎮', kind: 'gamified learning platform',
            solution: t => `A gamified quest platform that teaches ${t} through bite-sized challenges, boss levels and team leaderboards.`,
            features: ['Quest map with unlockable levels', 'AI-generated challenges tuned to skill level', 'Team leaderboards and weekly tournaments', 'Certificates minted on completion'],
            wow: 'Every quest is generated on the fly, so no two players get the same adventure.'
        },
        {
            suffix: 'Flow', emoji: '⚙️', kind: 'automation toolkit',
            solution: t => `A no-code automation builder that removes the repetitive busywork around ${t}, connecting the tools people already use.`,
            features: ['Drag-and-drop workflow builder', 'Pre-built templates for common tasks', 'Triggers from email, forms, Discord and Sheets', 'AI step that drafts messages and summaries'],
            wow: 'Describe a workflow in one sentence and the AI builds it for you.'
        }
    ];

    const STACKS = {
        'AI / ML': ['Python', 'FastAPI', 'Gemini API', 'React', 'Supabase'],
        'Web3 / Blockchain': ['Solidity', 'Hardhat', 'Next.js', 'ethers.js', 'IPFS'],
        FinTech: ['Next.js', 'Node.js', 'PostgreSQL', 'Plaid API', 'Chart.js'],
        HealthTech: ['React Native', 'Firebase', 'Python', 'Gemini API', 'FHIR API'],
        EdTech: ['Next.js', 'Supabase', 'OpenAI API', 'Tailwind', 'Vercel'],
        Sustainability: ['React', 'Python', 'Open-Meteo API', 'Leaflet', 'Firebase'],
        'Developer tools': ['TypeScript', 'Node.js', 'VS Code API', 'GitHub API', 'SQLite'],
        'Social good': ['Flutter', 'Firebase', 'Google Maps API', 'Discord.js', 'Node.js'],
        Gaming: ['Phaser', 'TypeScript', 'Socket.IO', 'Node.js', 'Redis'],
        'Open innovation': ['Next.js', 'Node.js', 'Supabase', 'Gemini API', 'Tailwind']
    };

    function hash(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        return h >>> 0;
    }

    function titleCase(s) {
        return s.replace(/\b\w/g, c => c.toUpperCase());
    }

    function shortWord(theme) {
        const stop = new Set(['for', 'the', 'and', 'of', 'in', 'to', 'a', 'an', 'with', 'on', 'ai']);
        const words = theme.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !stop.has(w));
        const w = words.sort((a, b) => b.length - a.length)[0] || 'idea';
        return titleCase(w.length > 8 ? w.slice(0, 6) : w);
    }

    function timeline(hours) {
        const phases = [
            ['Plan', 'Lock scope, sketch UI, split tasks'],
            ['Core', 'Build the main flow end-to-end'],
            ['AI', 'Integrate the model and tune prompts'],
            ['Polish', 'UI polish, edge cases, seed demo data'],
            ['Pitch', 'Record demo video, rehearse the pitch']
        ];
        const splits = [0.1, 0.4, 0.25, 0.15, 0.1];
        let t = 0;
        return phases.map(([name, task], i) => {
            const start = Math.round(t);
            t += hours * splits[i];
            const fmt = h => (hours >= 72 ? `Day ${Math.floor(h / 24) + 1}` : `H${h}`);
            return { phase: `${fmt(start)}–${fmt(Math.round(t))} · ${name}`, task };
        });
    }

    /** Lower-case the first letter for use mid-sentence, but keep acronyms like "AI". */
    function midSentence(s) {
        return s.replace(/^(\S)(\S*)/, (m, a, b) => (b && b[0] === b[0].toUpperCase() && /[A-Z]/.test(b[0]) ? m : a.toLowerCase() + b));
    }

    const PROBLEMS = [
        t => `People working on ${t} juggle scattered tools and information, so small problems go unnoticed until they become expensive. Existing solutions are either too complex or not built for this audience.`,
        t => `Most people who care about ${t} don't know where to start. Advice is generic, motivation fades after a week and nobody tracks whether anything actually improved.`,
        t => `Help for ${t} exists, but it is hard to find and harder to trust. The people who need it most are often the least connected to it.`,
        t => `Decisions around ${t} are still made on gut feeling. The data exists, but it is buried in spreadsheets, PDFs and portals that nobody has time to read.`,
        t => `Everyday tasks around ${t} are repetitive and manual, so busy people skip them and small mistakes pile up over time.`
    ];
    const JUDGE_HOOKS = [
        ['Clear real-world problem', 'Working live demo', 'Smart, visible use of AI'],
        ['Strong social impact story', 'Simple, polished UX', 'Measurable results in the demo'],
        ['Realistic scope for the time limit', 'Clever use of public data', 'Easy to keep building after the event'],
        ['Memorable live moment', 'Thoughtful accessibility', 'Clean technical architecture']
    ];

    window.demoIdeas = function demoIdeas(input) {
        const theme = input.theme.trim();
        const t = midSentence(theme);
        const seed = hash(theme.toLowerCase() + input.track);
        const word = shortWord(theme);
        const stack = (input.stack ? input.stack.split(',').map(s => s.trim()).filter(Boolean) : []);
        const baseStack = STACKS[input.track] || STACKS['Open innovation'];
        const difficulty = { Beginner: 'Easy', Intermediate: 'Medium', Advanced: 'Hard' }[input.skill] || 'Medium';

        return Array.from({ length: input.count }, (_, i) => {
            const a = ARCHETYPES[(seed + i * 7) % ARCHETYPES.length];
            const name = `${word}${a.suffix}`;
            return {
                name,
                emoji: a.emoji,
                tagline: `The ${a.kind} for ${t}.`,
                problem: PROBLEMS[(seed + i) % PROBLEMS.length](t),
                solution: a.solution(t),
                features: a.features,
                techStack: [...new Set([...stack, ...baseStack])].slice(0, 6),
                mvpPlan: timeline(Number(input.duration)),
                pitch: `Every day, people dealing with ${t} lose hours to guesswork. ${name} fixes that: ${midSentence(a.solution(t).replace(/\.$/, ''))}. In our demo you'll see it go from zero to insight in under a minute. We built it in ${input.duration} hours, and we're ready to scale it.`,
                wowFactor: a.wow,
                difficulty,
                judgesWillLove: JUDGE_HOOKS[(seed + i) % JUDGE_HOOKS.length]
            };
        });
    };
})();
