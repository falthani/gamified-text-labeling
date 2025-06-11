# Gamified Text Labeling Tasks Interface

> **Conference paper**: *How Task Complexity Moderates the Impact of AI‑Generated Images on User Experience in Gamified Text Labeling* (Althani et al., 2025). This repository contains the gamified text labelling tasks interface used in the experiments described in the paper.

---

## Repository Overview

```
src/
├─ app/
│  ├─ exp1/                # Part-of-speech tagging Experiment
│  │  ├─ doc-ai-img-exp1   # AI‑generated image condition
│  │  └─ doc-text-exp1     # Text‑only condition
│  └─ exp1-nli/            # Natural‑language inference Experiment
│     ├─ doc-nli-ai-exp1   # AI‑generated image condition
│     └─ doc-nli-text-exp1 # Text‑only condition
└─ …
```

---

## Quick Start

1. **Clone and install**

   ```bash
   git clone https://github.com/falthani/gamified-text-labeling.git
   cd gamified-text-labeling
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm start       # runs "ng serve" via the package.json start script
   ```

3. **Open your browser**

   * POS tagging, **AI‑image** condition: [http://localhost:4200/exp1/doc-ai-img-exp1](http://localhost:4200/exp1/doc-ai-img-exp1)
   * POS tagging, **Text‑only** condition: [http://localhost:4200/exp1/doc-text-exp1](http://localhost:4200/exp1/doc-text-exp1)
   * NLI, **AI‑image**: [http://localhost:4200/exp1-nli/doc-nli-ai-exp1](http://localhost:4200/exp1-nli/doc-nli-ai-exp1)
   * NLI, **Text‑only**: [http://localhost:4200/exp1-nli/doc-nli-text-exp1](http://localhost:4200/exp1-nli/doc-nli-text-exp1)

   The Angular dev server reloads automatically on file changes.

---

## Building for Production

```bash
ng build --configuration production
```

Compiled files are written to `dist/`.

---

## Running Tests

```bash
# Unit tests (Karma)
ng test

# End‑to‑end tests (Protractor / Cypress)
ng e2e
```

---

