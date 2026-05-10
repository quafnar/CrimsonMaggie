/**
 * Crimson Maggie — Ship VI for Foundry VTT
 * Compatible with v12 and v13.
 */

const MODULE_ID = "crimson-maggie";
const SOCKET_NAME = `module.${MODULE_ID}`;

/* -----------------------------------------------------
 * Face grids (16 cols × 10 rows). '.' = empty, '#' = fg pixel, '*' = accent pixel.
 * --------------------------------------------------- */
const FACES = {
  manic: [
    "................",
    "................",
    "...**......**...",
    "...**......**...",
    "................",
    "................",
    "..#..........#..",
    "...##......##...",
    ".....######.....",
    "................"
  ],
  sarcastic: [
    "................",
    "................",
    "..####....####..",
    "..####....####..",
    "................",
    "................",
    "................",
    ".....######.....",
    "....#......#....",
    "................"
  ],
  delighted: [
    "................",
    "................",
    "..####....####..",
    "................",
    "................",
    "................",
    "...##......##...",
    "....##....##....",
    ".....######.....",
    "................"
  ],
  disappointed: [
    "................",
    "................",
    "................",
    "..####....####..",
    "..####....####..",
    "....*...........",
    "....*...........",
    ".....######.....",
    "....##....##....",
    "...##......##.."
  ],
  furious: [
    "................",
    "..##.........##.",
    "...##.......##..",
    "....#########...",
    "....#.#...#.#...",
    "................",
    "....#.#.#.#.#...",
    "...#.#.#.#.#.#..",
    "....#.#.#.#.#...",
    "................"
  ],
  glitched: [
    "..####...#####..",
    ".......#........",
    "..##.....##..##.",
    ".....##....##...",
    "..#.#####....##.",
    "................",
    "....#.#.#.#.#...",
    "...##.....######",
    ".###.#.....#....",
    "................"
  ],
  lucid: [
    "................",
    "................",
    "................",
    "....##......##..",
    "....##......##..",
    "................",
    "................",
    "....########....",
    "................",
    "................"
  ]
};

/* -----------------------------------------------------
 * Mood metadata: foreground + accent colors for the face
 * and a background SVG generator.
 * --------------------------------------------------- */
const MOODS = {
  manic: {
    label: "Manic upswing",
    fg: "#001a33",
    accent: "#FFD400",
    bg() {
      let s = '<rect width="320" height="200" fill="#22D3EE"/>';
      for (let y = 0; y < 200; y += 4) {
        s += `<rect x="0" y="${y}" width="320" height="2" fill="#0EA5C4" opacity="0.55"/>`;
      }
      return s;
    }
  },
  sarcastic: {
    label: "Sarcastic baseline",
    fg: "#1A0033",
    accent: "#1A0033",
    bg() {
      let s = '<rect width="320" height="200" fill="#7F77DD"/>';
      s += '<rect width="320" height="200" fill="#534AB7" opacity="0.35"/>';
      for (let i = -2; i < 8; i++) {
        s += `<polygon points="${i*60},0 ${i*60+30},0 ${i*60-50},200 ${i*60-80},200" fill="#3C3489" opacity="0.18"/>`;
      }
      return s;
    }
  },
  delighted: {
    label: "Genuinely delighted",
    fg: "#412402",
    accent: "#412402",
    bg() {
      let s = '<rect width="320" height="200" fill="#FAC775"/>';
      for (let y = -20; y < 220; y += 32) {
        for (let x = -20; x < 340; x += 32) {
          const cx = x + (((y / 32) | 0) % 2 === 0 ? 0 : 16);
          s += `<polygon points="${cx},${y-8} ${cx+8},${y} ${cx},${y+8} ${cx-8},${y}" fill="#EF9F27" opacity="0.55"/>`;
        }
      }
      return s;
    }
  },
  disappointed: {
    label: "Disappointed",
    fg: "#04342C",
    accent: "#1565F2",
    bg() {
      let s = '<rect width="320" height="200" fill="#5DCAA5"/>';
      s += '<rect width="320" height="200" fill="#0F6E56" opacity="0.25"/>';
      for (let x = 8; x < 320; x += 24) {
        const h = 30 + (x * 7) % 60;
        s += `<rect x="${x}" y="0" width="3" height="${h}" fill="#085041" opacity="0.4"/>`;
      }
      return s;
    }
  },
  furious: {
    label: "Furious",
    fg: "#FCEBEB",
    accent: "#FCEBEB",
    bg() {
      let s = '<rect width="320" height="200" fill="#A32D2D"/>';
      for (let y = 0; y < 200; y += 16) {
        const op = 0.3 + ((y * 13) % 7) / 20;
        s += `<rect x="0" y="${y}" width="320" height="6" fill="#501313" opacity="${op.toFixed(2)}"/>`;
      }
      s += '<rect x="0" y="40" width="320" height="3" fill="#FCEBEB" opacity="0.7"/>';
      s += '<rect x="0" y="140" width="320" height="2" fill="#FCEBEB" opacity="0.5"/>';
      return s;
    }
  },
  glitched: {
    label: "Glitched",
    fg: "#22FF88",
    accent: "#FF22AA",
    bg() {
      let s = '<rect width="320" height="200" fill="#0a0a0a"/>';
      for (let i = 0; i < 200; i++) {
        const x = (i * 53) % 320;
        const y = (i * 91) % 200;
        const c = i % 3 === 0 ? '#22FF88' : (i % 3 === 1 ? '#FF22AA' : '#FFFFFF');
        s += `<rect x="${x}" y="${y}" width="2" height="2" fill="${c}" opacity="0.6"/>`;
      }
      s += '<rect x="0" y="55" width="320" height="3" fill="#22FF88" opacity="0.7"/>';
      s += '<rect x="0" y="120" width="320" height="2" fill="#FF22AA" opacity="0.7"/>';
      s += '<rect x="40" y="150" width="240" height="4" fill="#FFFFFF" opacity="0.5"/>';
      return s;
    }
  },
  lucid: {
    label: "Lucid moment",
    fg: "#2C2C2A",
    accent: "#2C2C2A",
    bg() {
      return '<rect width="320" height="200" fill="#D3D1C7"/>';
    }
  }
};

const MOOD_ORDER = ["manic", "sarcastic", "delighted", "disappointed", "furious", "glitched", "lucid"];

/* -----------------------------------------------------
 * Face renderer — produces the inner SVG markup for a given mood.
 * --------------------------------------------------- */
const CELL = 12;
const FACE_W = 16;
const FACE_H = 10;
const OFFSET_X = (320 - FACE_W * CELL) / 2; // 64
const OFFSET_Y = (200 - FACE_H * CELL) / 2; // 40

function renderFaceSVG(moodKey) {
  const mood = MOODS[moodKey] ?? MOODS.sarcastic;
  const grid = FACES[moodKey] ?? FACES.sarcastic;
  let pixels = "";
  for (let row = 0; row < FACE_H; row++) {
    for (let col = 0; col < FACE_W; col++) {
      const ch = grid[row][col];
      if (ch === ".") continue;
      const x = OFFSET_X + col * CELL;
      const y = OFFSET_Y + row * CELL;
      const fill = ch === "*" ? mood.accent : mood.fg;
      pixels += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="${fill}"/>`;
    }
  }
  return mood.bg() + pixels;
}

/* -----------------------------------------------------
 * Tiny markdown -> HTML renderer.
 * Intentionally minimal: headers, bold, italic, inline code,
 * fenced code blocks, blockquotes, unordered/ordered lists,
 * and paragraph/line breaks. Input is HTML-escaped first so
 * raw HTML in the source can't break out.
 * --------------------------------------------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarkdown(src) {
  if (src == null) return "";
  let text = String(src).replace(/\r\n?/g, "\n");

  // Pull out fenced code blocks before escaping so their contents survive.
  const codeBlocks = [];
  text = text.replace(/```([\s\S]*?)```/g, (_m, code) => {
    codeBlocks.push(code.replace(/^\n/, "").replace(/\n$/, ""));
    return `@@CB${codeBlocks.length - 1}@@`;
  });

  text = escapeHtml(text);

  // Inline code
  text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Bold then italic (order matters)
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  text = text.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

  // Headers
  text = text.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  text = text.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  text = text.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  text = text.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Blockquote (group consecutive lines)
  text = text.replace(/(^&gt; .*(?:\n&gt; .*)*)/gm, (m) => {
    const inner = m.split("\n").map((l) => l.replace(/^&gt; /, "")).join("<br>");
    return `<blockquote>${inner}</blockquote>`;
  });

  // Unordered lists
  text = text.replace(/(^[-*+] .+(?:\n[-*+] .+)*)/gm, (m) => {
    const items = m.split("\n").map((l) => `<li>${l.replace(/^[-*+] /, "")}</li>`).join("");
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  text = text.replace(/(^\d+\. .+(?:\n\d+\. .+)*)/gm, (m) => {
    const items = m.split("\n").map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("");
    return `<ol>${items}</ol>`;
  });

  // Restore code blocks (escape their contents now)
  text = text.replace(/@@CB(\d+)@@/g, (_m, i) => `<pre><code>${escapeHtml(codeBlocks[+i])}</code></pre>`);

  // Paragraphs: split on blank lines, wrap loose runs in <p>, inner \n -> <br>
  const blockTag = /^<(h\d|ul|ol|pre|blockquote)/i;
  const blocks = text.split(/\n{2,}/).map((b) => {
    const t = b.trim();
    if (!t) return "";
    if (blockTag.test(t)) return t;
    return `<p>${t.replace(/\n/g, "<br>")}</p>`;
  });

  return blocks.filter(Boolean).join("\n");
}

/* -----------------------------------------------------
 * Module state — kept in module scope and synced across
 * clients via socket. `pushState` is GM-only.
 * --------------------------------------------------- */
const state = {
  mood: "sarcastic",
  glitchPulse: 0,
  terminal: {
    visible: false,
    source: "",
    html: ""
  }
};

function applyState(newState, { rerender = true } = {}) {
  Object.assign(state, newState);
  if (rerender && CrimsonMaggieApp.instance?.rendered) {
    CrimsonMaggieApp.instance.render({ force: false });
  }
}

function pushState(partial) {
  if (!game.user.isGM) return;
  applyState(partial);
  game.socket.emit(SOCKET_NAME, { type: "state", payload: { ...state } });
}

function triggerGlitchFlash() {
  if (!game.user.isGM) return;
  applyState({ glitchPulse: Date.now() });
  game.socket.emit(SOCKET_NAME, { type: "glitch", payload: { glitchPulse: state.glitchPulse } });
}

function broadcastShow() {
  if (!game.user.isGM) return;
  game.socket.emit(SOCKET_NAME, { type: "show" });
}

function setTerminal(partial) {
  if (!game.user.isGM) return;
  const next = { ...state.terminal, ...partial };
  if (partial.source !== undefined) {
    next.html = renderMarkdown(partial.source);
  }
  pushState({ terminal: next });
}

/* -----------------------------------------------------
 * The application window itself.
 * Uses ApplicationV2 + HandlebarsApplicationMixin
 * (available in v12 and v13).
 * --------------------------------------------------- */
function getAppV2Bases() {
  const ns = foundry.applications?.api;
  if (!ns) {
    throw new Error("Crimson Maggie requires Foundry v12 or higher (ApplicationV2 namespace missing).");
  }
  return {
    ApplicationV2: ns.ApplicationV2,
    HandlebarsApplicationMixin: ns.HandlebarsApplicationMixin
  };
}

let CrimsonMaggieApp = null;

function defineApp() {
  const { ApplicationV2, HandlebarsApplicationMixin } = getAppV2Bases();

  CrimsonMaggieApp = class extends HandlebarsApplicationMixin(ApplicationV2) {

    static instance = null;

    static DEFAULT_OPTIONS = {
      id: "crimson-maggie-window",
      classes: ["crimson-maggie"],
      tag: "div",
      window: {
        title: "CRIMSON_MAGGIE.WindowTitle",
        icon: "fa-solid fa-skull-crossbones",
        resizable: true,
        minimizable: true
      },
      position: {
        width: 480,
        height: "auto"
      },
      actions: {
        setMood: CrimsonMaggieApp_setMood,
        glitch: CrimsonMaggieApp_glitch,
        show: CrimsonMaggieApp_show,
        sendTerminal: CrimsonMaggieApp_sendTerminal,
        toggleTerminal: CrimsonMaggieApp_toggleTerminal,
        clearTerminal: CrimsonMaggieApp_clearTerminal
      }
    };

    static PARTS = {
      main: {
        template: `modules/${MODULE_ID}/templates/maggie.hbs`
      }
    };

    constructor(options = {}) {
      super(options);
      CrimsonMaggieApp.instance = this;
    }

    async _prepareContext() {
      const moodKey = MOODS[state.mood] ? state.mood : "sarcastic";
      const term = state.terminal ?? { visible: false, source: "", html: "" };
      const isGM = game.user.isGM;
      const showTerminal = isGM || term.visible;
      return {
        isGM,
        moodKey,
        moodLabel: MOODS[moodKey].label,
        faceSVG: renderFaceSVG(moodKey),
        glitchPulse: state.glitchPulse,
        moods: MOOD_ORDER.map(k => ({
          key: k,
          label: MOODS[k].label,
          active: k === moodKey
        })),
        terminal: {
          visible: !!term.visible,
          source: term.source ?? "",
          html: term.html ?? "",
          hasContent: !!(term.html && term.html.trim().length)
        },
        showTerminal
      };
    }

    _onRender(context, options) {
      super._onRender?.(context, options);
      const root = this.element;
      if (!root) return;

      // Apply a one-shot glitch class when a fresh pulse arrives
      if (state.glitchPulse && state.glitchPulse !== this._lastGlitchPulse) {
        this._lastGlitchPulse = state.glitchPulse;
        const screen = root.querySelector(".cm-screen");
        if (screen) {
          screen.classList.add("cm-flash");
          setTimeout(() => screen.classList.remove("cm-flash"), 700);
        }
      }

      // GM: keep textarea-driven source in module state so toggles
      // and other re-renders don't lose unsent drafts.
      const textarea = root.querySelector(".cm-terminal-input");
      if (textarea) {
        textarea.addEventListener("input", (ev) => {
          state.terminal.source = ev.target.value;
        });
      }
    }

    async close(options) {
      if (CrimsonMaggieApp.instance === this) CrimsonMaggieApp.instance = null;
      return super.close(options);
    }
  };
}

/* Action handlers (declared as module-scope functions because
 * V13 expects ApplicationV2 actions to be plain functions
 * referenced by the static actions map). */
function CrimsonMaggieApp_setMood(event, target) {
  const key = target?.dataset?.moodKey;
  if (!key || !MOODS[key]) return;
  pushState({ mood: key });
}

function CrimsonMaggieApp_glitch() {
  triggerGlitchFlash();
}

function CrimsonMaggieApp_show() {
  broadcastShow();
}

function CrimsonMaggieApp_sendTerminal(event, target) {
  const root = target?.closest(".cm-root") ?? CrimsonMaggieApp.instance?.element;
  const textarea = root?.querySelector(".cm-terminal-input");
  const source = textarea ? textarea.value : (state.terminal.source ?? "");
  setTerminal({ source });
}

function CrimsonMaggieApp_toggleTerminal() {
  setTerminal({ visible: !state.terminal.visible });
}

function CrimsonMaggieApp_clearTerminal() {
  setTerminal({ source: "" });
}

/* -----------------------------------------------------
 * Hooks
 * --------------------------------------------------- */

Hooks.once("init", () => {
  defineApp();

  game.settings.register(MODULE_ID, "syncToPlayers", {
    name: "CRIMSON_MAGGIE.Settings.SyncToPlayers",
    hint: "CRIMSON_MAGGIE.Settings.SyncToPlayersHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
});

Hooks.once("ready", () => {
  game.socket.on(SOCKET_NAME, (data) => {
    if (game.user.isGM) return; // GM is the source of truth
    if (!game.settings.get(MODULE_ID, "syncToPlayers")) return;
    if (data?.type === "state") applyState(data.payload);
    else if (data?.type === "glitch") applyState({ glitchPulse: data.payload.glitchPulse });
    else if (data?.type === "show") game.modules.get(MODULE_ID)?.api?.open();
  });

  // Expose API for macros / other modules
  const mod = game.modules.get(MODULE_ID);
  if (mod) {
    mod.api = {
      open() {
        if (!CrimsonMaggieApp.instance) new CrimsonMaggieApp().render(true);
        else CrimsonMaggieApp.instance.render(true);
      },
      setMood(key) { if (game.user.isGM) pushState({ mood: key }); },
      glitch() { triggerGlitchFlash(); },
      setTerminal(markdown) { setTerminal({ source: String(markdown ?? "") }); },
      showTerminal() { setTerminal({ visible: true }); },
      hideTerminal() { setTerminal({ visible: false }); },
      clearTerminal() { setTerminal({ source: "" }); },
      MOODS: MOOD_ORDER
    };
  }
});

// Add a scene controls button (the toolbar on the left) for quick access
Hooks.on("getSceneControlButtons", (controls) => {
  // v13 uses object form, v12 uses array. Handle both.
  const tokenControl = Array.isArray(controls)
    ? controls.find(c => c.name === "tokens")
    : controls.tokens;
  if (!tokenControl) return;

  const button = {
    name: "crimson-maggie",
    title: "CRIMSON_MAGGIE.OpenButton",
    icon: "fa-solid fa-skull-crossbones",
    button: true,
    onClick: () => game.modules.get(MODULE_ID)?.api?.open(),
    onChange: () => game.modules.get(MODULE_ID)?.api?.open()
  };

  if (Array.isArray(tokenControl.tools)) {
    tokenControl.tools.push(button);
  } else if (tokenControl.tools && typeof tokenControl.tools === "object") {
    tokenControl.tools["crimson-maggie"] = button;
  }
});
