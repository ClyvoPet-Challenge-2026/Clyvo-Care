// ==========================================
// TAILWIND.CONFIG.JS — CLYVO CARE
// Configuração centralizada de cores e tema
// ==========================================

// ==========================================
// 1. CONSTANTES DE CORES DO DESIGN SYSTEM
// ==========================================

/** Azuis da marca */
const clyvoBrandColors = {
  DEFAULT: "#1f6ae1",
  hover: "#0069e8",
  ink: "#19448b",
  navy: "#182447",
  navy2: "#111c3a",
  soft: "#e5ebf5",
  softLine: "#99b6e6",
};

/** Neutros */
const clyvoNeutralColors = {
  paper: "#ffffff",
  ground: "#f2f3f5",
  ink: "#0c0d10",
  body: "#393f4b",
  softInk: "#525a6a",
  mute: "#6c778c",
  rule: "#d9dce1",
  rule2: "#e1e7ee",
};

/** Status */
const clyvoStatusColors = {
  ok: "#008c4d",
  mint: "#99e6bf",
  warn: "#f6b60b",
  danger: "#d32f2f",
};

// ==========================================
// 2. MAPA DE CORES PARA TAILWIND CSS
// ==========================================

const tailwindColors = {
  // Compatibilidade com código legado
  blue: clyvoBrandColors.DEFAULT,
  lightBlue: "#E6F0FA",
  text: clyvoBrandColors.DEFAULT,
  mainBackground: "#f3f5f8",
  secondaryBackground: clyvoNeutralColors.paper,

  // Azuis
  brand: {
    DEFAULT: clyvoBrandColors.DEFAULT,
    hover: clyvoBrandColors.hover,
    ink: clyvoBrandColors.ink,
  },
  navy: {
    DEFAULT: clyvoBrandColors.navy,
    2: clyvoBrandColors.navy2,
  },
  soft: clyvoBrandColors.soft,
  "soft-line": clyvoBrandColors.softLine,

  // Neutros
  paper: clyvoNeutralColors.paper,
  ground: clyvoNeutralColors.ground,
  ink: clyvoNeutralColors.ink,
  body: clyvoNeutralColors.body,
  "soft-ink": clyvoNeutralColors.softInk,
  mute: clyvoNeutralColors.mute,
  rule: {
    DEFAULT: clyvoNeutralColors.rule,
    2: clyvoNeutralColors.rule2,
  },

  // Status
  ok: clyvoStatusColors.ok,
  mint: clyvoStatusColors.mint,
  warn: clyvoStatusColors.warn,
  danger: clyvoStatusColors.danger,
};

// ==========================================
// 3. PALETAS PARA MODO CLARO E MODO ESCURO
// ==========================================

/** @type {import('./src/Types/types').ClyvoThemeColors} */
const clyvoLightColors = {
  background: clyvoNeutralColors.ground,       // #f2f3f5
  card: clyvoNeutralColors.paper,               // #ffffff
  surface: clyvoNeutralColors.paper,            // #ffffff
  soft: clyvoBrandColors.soft,                  // #e5ebf5
  text: clyvoNeutralColors.ink,                 // #0c0d10
  textSecondary: clyvoNeutralColors.body,       // #393f4b
  textMuted: clyvoNeutralColors.mute,           // #6c778c
  border: clyvoNeutralColors.rule,              // #d9dce1
  borderSecondary: clyvoNeutralColors.rule2,    // #e1e7ee
  brand: clyvoBrandColors.DEFAULT,              // #1f6ae1
  icon: clyvoNeutralColors.ink,                 // #0c0d10
  iconSecondary: clyvoNeutralColors.mute,       // #6c778c
};

/** @type {import('./src/Types/types').ClyvoThemeColors} */
const clyvoDarkColors = {
  background: clyvoBrandColors.navy2,           // #111c3a (fundo escuro profundo)
  card: clyvoBrandColors.navy,                  // #182447 (cartões e superfícies)
  surface: clyvoBrandColors.navy,               // #182447
  soft: "#1e2f5b",                              // azul marinho suave para badges no escuro
  text: clyvoNeutralColors.paper,               // #ffffff (texto em alto contraste)
  textSecondary: clyvoBrandColors.soft,         // #e5ebf5
  textMuted: clyvoBrandColors.softLine,         // #99b6e6
  border: "rgba(255, 255, 255, 0.12)",          // borda suave translúcida
  borderSecondary: "rgba(255, 255, 255, 0.08)",
  brand: clyvoBrandColors.DEFAULT,              // #1f6ae1
  icon: clyvoNeutralColors.paper,               // #ffffff
  iconSecondary: clyvoBrandColors.softLine,     // #99b6e6
};

// ==========================================
// 4. CONFIGURAÇÃO OFICIAL TAILWIND CSS
// ==========================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [],
};

// ==========================================
// 5. EXPORTS PARA USO EM RUNTIME (ThemeContext)
// ==========================================

module.exports.clyvoLightColors = clyvoLightColors;
module.exports.clyvoDarkColors = clyvoDarkColors;
module.exports.clyvoBrandColors = clyvoBrandColors;
module.exports.clyvoNeutralColors = clyvoNeutralColors;
module.exports.clyvoStatusColors = clyvoStatusColors;
