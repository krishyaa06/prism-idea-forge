<!-- ═════════════ HEADER ═════════════ -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:07060f,50:6C63FF,100:00D2FF&height=200&section=header&text=Prism%20Idea%20Forge&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=AI%20hackathon%20idea%20generator%20%E2%80%A2%20pitch%20%E2%80%A2%20MVP%20plan%20%E2%80%A2%20README&descAlignY=58&descSize=16" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2600&pause=800&color=00D2FF&center=true&vCenter=true&width=660&lines=Theme+in+%E2%86%92+winning+idea+out;Problem+%E2%80%A2+Solution+%E2%80%A2+Features+%E2%80%A2+Tech+stack;Hour-by-hour+MVP+plan+%2B+30s+pitch;Gemini+%E2%80%A2+Groq+%E2%80%A2+OpenRouter+%E2%80%A2+OpenAI" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-idea-forge/"><img src="https://img.shields.io/badge/Live%20Demo-Open%20App-00FFAA?style=for-the-badge&logo=githubpages&logoColor=black" /></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Build-none-6C63FF?style=for-the-badge" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/krishyaa06/prism-idea-forge?style=for-the-badge&color=FF5EA8" /></a>
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-idea-forge/"><img src="assets/screenshots/demo.gif" width="88%" alt="Prism Idea Forge demo" /></a>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" />

## ⚡ Overview

Stuck at the start of a hackathon? **Prism Idea Forge** turns a theme into complete, buildable project ideas in seconds.
Every idea comes with the problem, the solution, key features, a tech stack, an **hour-by-hour MVP plan** that fits your hackathon length, a **30-second pitch**, a wow factor and what judges will love. One click gives you a ready **README starter** for your repo.

- 🆓 **Works without any key.** Demo mode uses a built-in offline generator
- 🤖 **Bring your own AI.** Gemini (free), Groq (free), OpenRouter, OpenAI or any OpenAI-compatible endpoint
- 🔒 **Private by design.** No backend. Your key stays in your browser and is sent only to the provider you choose

👉 **Try it now:** [krishyaa06.github.io/prism-idea-forge](https://krishyaa06.github.io/prism-idea-forge/)

## 📸 Screenshots

<p align="center"><img src="assets/screenshots/hero.png" width="90%" alt="Home" /><br><sub>Home: theme, track, duration, skill level, team size and preferred stack</sub></p>

<table>
  <tr>
    <td width="62%"><img src="assets/screenshots/idea-card.png" width="100%" /><p align="center"><b>Idea card</b> with MVP plan and pitch</p></td>
    <td width="38%"><img src="assets/screenshots/mobile.png" width="100%" /><p align="center"><b>Mobile</b> layout</p></td>
  </tr>
  <tr>
    <td colspan="2"><img src="assets/screenshots/settings.png" width="100%" /><p align="center"><b>AI Settings</b> drawer (provider, model, key)</p></td>
  </tr>
</table>

## ✨ Features

| | Feature | Details |
|---|---------|---------|
| 🎯 | **Smart inputs** | Theme (with quick chips), 10 tracks, 12h to 1 week, skill level, team size 1 to 6, preferred stack, 1 to 3 ideas |
| 🧠 | **Complete ideas** | Problem, solution, features, tech stack, difficulty, MVP timeline, pitch, wow factor, judge hooks |
| 📋 | **Export** | Copy one idea, copy everything as Markdown, download a `.md` file or copy a README starter |
| 🕘 | **History** | Last 20 generations saved locally, reopen with one click |
| ⌨️ | **Shortcuts** | `Ctrl + Enter` / `⌘ + Enter` to forge |
| ✨ | **Animations** | Starfield background, rotating hero word, glowing cards, step-by-step loading log |
| 📱 | **Responsive** | Works on phones, tablets and desktops |
| 🛡️ | **Robust** | Validates and cleans AI output, friendly errors, a new request safely cancels the previous one |

## 🤖 AI Providers

| Provider | Default model | Free key |
|----------|---------------|:--------:|
| **Demo mode** | Built-in offline generator | No key needed |
| **Google Gemini** | `gemini-2.5-flash` | ✅ [aistudio.google.com](https://aistudio.google.com/apikey) |
| **Groq** | `llama-3.3-70b-versatile` | ✅ [console.groq.com](https://console.groq.com/keys) |
| **OpenRouter** | `meta-llama/llama-3.3-70b-instruct:free` | ✅ [openrouter.ai](https://openrouter.ai/keys) |
| **OpenAI** | `gpt-4o-mini` | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Custom** | Any model | Any OpenAI-compatible `/chat/completions` URL (LM Studio, Ollama, Together, ...) |

**How to switch on AI mode:** open **⚙️ AI Settings** → pick a provider → paste your key → **Save**. The pill at the top changes from *Demo mode* to the provider name. Untick **Remember key** to keep it only for the current tab session.

> 🔐 Keys are stored only in your browser's `localStorage` (or in memory if you untick "Remember"). There is no server, analytics or tracking.

## 🔄 How it works

```mermaid
flowchart LR
    A[🎯 Your inputs] --> B{API key saved?}
    B -- No --> C[🧩 Offline demo generator]
    B -- Yes --> D[🤖 Provider<br/>Gemini · Groq · OpenRouter · OpenAI]
    D --> E[🧹 Parse + validate JSON]
    C --> F[🃏 Idea cards]
    E --> F
    F --> G[📋 Copy / ⬇️ .md / 📄 README]
    F --> H[🕘 Local history]
```

## 🚀 Run Locally

No build step and no dependencies. Any static server works:

```bash
git clone https://github.com/krishyaa06/prism-idea-forge.git
cd prism-idea-forge
python3 -m http.server 8080      # or: npx serve .
```

Open <http://localhost:8080>.

### Deploy your own

Fork the repo → **Settings → Pages → Deploy from branch → `main` / root**. It also works on Netlify, Vercel or Cloudflare Pages as a plain static site.

## 📁 Project Structure

```
prism-idea-forge/
├── index.html        # layout, form, drawers
├── style.css         # glassmorphism theme + animations
├── js/
│   ├── providers.js  # provider presets + callChat()
│   ├── demo.js       # offline idea generator
│   └── app.js        # UI, prompt, validation, export, history
└── assets/screenshots/
```

## 🗺️ Roadmap

- [x] Multi-provider AI + offline demo mode
- [x] MVP plan scaled to hackathon length
- [x] Markdown / README export and history
- [ ] Share an idea with a link
- [ ] Pitch deck outline export
- [ ] Team role suggestions

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-idea`
3. Commit and open a Pull Request

New themes, tracks or demo templates in `js/demo.js` are very welcome.

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/krishyaa06"><img src="https://github.com/krishyaa06.png" width="90" style="border-radius:50%" /><br><b>Soumya Bhandare</b></a><br>
      <sub>Founder @ Prism Protocol</sub>
    </td>
    <td>
      <a href="https://dc.gg/prismprotocol"><img src="https://img.shields.io/badge/Discord-Prism%20Protocol-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a><br>
      <a href="https://instagram.com/prism_protocol_"><img src="https://img.shields.io/badge/Instagram-@prism__protocol__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a><br>
      <a href="https://x.com/krishyaa06"><img src="https://img.shields.io/badge/X-@krishyaa06-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
    </td>
  </tr>
</table>

## 📄 License

Released under the [MIT License](LICENSE).

<p align="center">
  <b>If you like this project, consider giving it a ⭐</b><br>
  <sub>"Build. Create. Compete." · Made with ⚡ by Prism Protocol</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D2FF,50:6C63FF,100:07060f&height=110&section=footer" width="100%" />
