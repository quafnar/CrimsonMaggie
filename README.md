# Crimson Maggie — Ship VI for Foundry VTT

A Foundry VTT module that displays a glitchy, sarcastic shipboard virtual intelligence — a pixelated, monochromatic face with mood-based backgrounds, voiced by the GM.

Designed for a Starfinder / Pathfinder 2e Free Captains pirate game, but the module is system-agnostic — it works in any system.

## Features

- A floating window with a 16×10 pixel face on a 320×200 "screen", complete with scanlines.
- Seven moods: **manic**, **sarcastic**, **delighted**, **disappointed**, **furious**, **glitched**, **lucid**. Each has its own face, background, default status text, and sample dialogue.
- GM-only controls: pick a mood, edit the system status text, edit the dialogue line, trigger a glitch flash, or broadcast the current state to all players.
- State syncs to all connected players via Foundry's socket — when the GM changes the mood, every open Maggie window updates instantly.
- Toolbar button under Token Controls for quick open.
- Macro API for hooking Maggie up to your other modules or rolltables.

## Installation

### Manual install (development / private use)

1. Copy the `crimson-maggie` folder into your Foundry user data:
   `<userdata>/Data/modules/crimson-maggie`
2. Restart Foundry.
3. In your world, go to *Game Settings → Manage Modules* and enable **Crimson Maggie — Ship VI**.

## Usage

- Click the skull-and-crossbones button under the Token Controls toolbar (left side of the screen) to open Maggie's window. Players and GM both see the same window.
- As GM, click any mood button to switch faces. The status text and dialogue line auto-fill with that mood's defaults; edit them freely. Changes broadcast to all players' open windows.
- Click **Glitch flash** to fire a one-shot CRT-tearing animation on every connected screen.
- Click **Broadcast to players** to force-resend the current state — useful if a player joined late or had their window closed.

## Macro API

```js
const m = game.modules.get("crimson-maggie").api;

m.open();                                      // open the window
m.setMood("furious");                          // valid keys: see m.MOODS
m.setStatus("HULL BREACH — DECK 4");           // override the status text
m.setDialogue("Oh you've REALLY done it now.");// override the dialogue
m.glitch();                                    // fire a glitch flash
```

This makes it easy to wire Maggie into rolltables (random malfunction → `m.setMood("glitched")`) or chat command macros.

## Compatibility

Built against Foundry VTT v12 and v13. Uses `ApplicationV2` + `HandlebarsApplicationMixin`.
