# 🌀 The Entropy Chamber

An interactive, meditative art experience where neglect has consequences and patience is rewarded.

![The Entropy Chamber](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## 🎭 What Is This?

The Entropy Chamber is a strange, contemplative web experience that explores the relationship between attention, decay, and care. It's part art installation, part idle game, part meditation tool.

**The core philosophy:** Everything decays without attention. But with patience and presence, beauty emerges.

## ✨ Features

### 🎛️ The Frequency Dial
- Central control mechanism for the chamber's energy
- Drag to adjust frequency from 0-100 Hz
- Push too high and trigger system overload

### 💨 Dust Accumulation
- Leave the chamber idle and dust naturally accumulates
- Watch the dust meter fill over time
- Drag across the screen to clean dust particles
- **Warning:** Let dust reach 100% and witness the explosive consequences

### ⚡ Overload & Cracks
- Push the frequency past safe limits
- Cracks appear across the chamber
- Click on cracks to repair them before the system destabilizes

### 🌿 Moss Growth (The Reward)
- Keep the frequency steady (40-60 Hz range)
- Maintain low dust levels
- Wait patiently...
- Beautiful moss begins to grow as a reward for your care

### 🎵 Ambient Audio
- Reactive sound design that responds to your interactions
- Cleaning sounds, crack repairs, and ambient frequencies
- Audio initializes on first interaction

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd entropy-chamber

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

1. **Enter the Chamber** - Click the welcome screen to begin
2. **Explore the Dial** - Drag the central dial to change frequency
3. **Don't Neglect It** - If you stop interacting, dust will accumulate
4. **Clean Regularly** - Drag across dusty areas to clean
5. **Avoid Overload** - Don't push frequency too high
6. **Repair Damage** - Click cracks to fix them
7. **Find Balance** - Keep frequency around 50Hz, stay clean, and wait for moss

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Custom React Hooks
- **Audio:** Web Audio API

## 📁 Project Structure

```
src/
├── components/
│   ├── EntropyChamber.tsx    # Main chamber orchestrator
│   ├── FrequencyDial.tsx     # Central control dial
│   ├── DustLayer.tsx         # Dust particle system
│   ├── CrackOverlay.tsx      # Crack damage display
│   ├── MossGrowth.tsx        # Moss reward system
│   ├── WelcomeOverlay.tsx    # Entry screen
│   ├── AmbientBackground.tsx # Background visuals
│   ├── ThoughtStream.tsx     # Floating thoughts
│   └── HiddenQuote.tsx       # Easter egg quotes
├── hooks/
│   ├── useEntropyState.ts    # Core state management
│   └── useAudioEngine.ts     # Audio system
├── data/
│   └── thoughts.ts           # Thought content
└── pages/
    └── Index.tsx             # Main page
```

## 🎨 Design Philosophy

The Entropy Chamber draws inspiration from:
- **Digital Zen Gardens** - Spaces for contemplation
- **Tamagotchi** - The responsibility of care
- **Generative Art** - Beauty from systems
- **Wabi-Sabi** - Finding beauty in imperfection

## 📜 License

MIT License - Feel free to remix, modify, and share.

---

*"In the chamber, entropy is not the enemy. Neglect is."*
