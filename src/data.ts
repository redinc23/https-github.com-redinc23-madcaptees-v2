/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FabricColor, StickerItem, TeeDesign, ShirtStyle } from './types';

export const FABRIC_COLORS: FabricColor[] = [
  { id: 'slate', name: 'Ambient Slate', hex: '#334155' },
  { id: 'black', name: 'Midnight Obsidian', hex: '#0f172a' },
  { id: 'offwhite', name: 'Vintage Cream', hex: '#f8fafc' },
  { id: 'blue', name: 'Dusk Cobalt', hex: '#1e3a8a' },
  { id: 'sage', name: 'Matcha Sage', hex: '#2e7d32' },
  { id: 'pink', name: 'Retro Fuchsia', hex: '#db2777' },
  { id: 'yellow', name: 'Atomic Yellow', hex: '#eab308' },
  { id: 'crimson', name: 'Crimson Panic', hex: '#991b1b' },
];

export const SHIRT_STYLES: { id: ShirtStyle; name: string; basePrice: number; description: string }[] = [
  { id: 'unisex', name: 'Unisex Heavy Tee', basePrice: 24.99, description: '100% premium heavy cotton with a relaxed, boxy fit.' },
  { id: 'hoodie', name: 'Cozy Cosmic Hoodie', basePrice: 44.99, description: 'Ultra-soft fleece lining, double-lined hood, and thick drawstrings.' },
  { id: 'longsleeve', name: 'Retro Long Sleeve', basePrice: 32.99, description: 'Classic cuffed sleeves, breathable vintage weave.' },
  { id: 'croptop', name: 'Quirky Crop Top', basePrice: 26.99, description: 'Casual drop-shoulder, clean raw hemline, and cheeky length.' },
];

export const FONTS = [
  { name: 'Space Grotesk', class: 'font-space', import: 'Space+Grotesk:wght@500;700' },
  { name: 'JetBrains Mono', class: 'font-mono', import: 'JetBrains+Mono:wght@500;800' },
  { name: 'Syne', class: 'font-syne', import: 'Syne:wght@700;800' },
  { name: 'Bungee', class: 'font-bungee', import: 'Bungee' },
  { name: 'Pacifico', class: 'font-pacifico', import: 'Pacifico' },
  { name: 'Playfair Display', class: 'font-serif', import: 'Playfair+Display:ital,wght@0,700;1,700' },
  { name: 'Impact Pro', class: 'font-impact', import: '' }, // System font
  { name: 'Cinzel Decorative', class: 'font-cinzel', import: 'Cinzel+Decorative:wght@700' },
  { name: 'Creepster', class: 'font-creepster', import: 'Creepster' },
  { name: 'Fredoka One', class: 'font-fredoka', import: 'Fredoka+One' },
];

export const STICKERS: StickerItem[] = [
  // Memes Category
  { id: 'melt', name: 'Melting Smile', emoji: '🫠', category: 'memes' },
  { id: 'skull', name: 'Grave Error', emoji: '💀', category: 'memes' },
  { id: 'clown', name: 'Circus Logic', emoji: '🤡', category: 'memes' },
  { id: 'alien', name: 'Cosmic Visitor', emoji: '👽', category: 'memes' },
  { id: 'robot', name: 'Crying Bot', emoji: '🤖', category: 'memes' },
  
  // Shapes Category
  { id: 'lightning', name: 'Danger Bolt', emoji: '⚡', category: 'shapes' },
  { id: 'star', name: 'Sparkle Vibe', emoji: '⭐', category: 'shapes' },
  { id: 'swirl', name: 'Hypno Swirl', emoji: '🌀', category: 'shapes' },
  { id: 'crystal', name: 'Gaze Crystal', emoji: '🔮', category: 'shapes' },
  { id: 'fire', name: 'Hot Mess', emoji: '🔥', category: 'shapes' },

  // Eccentric Category
  { id: 'ufo', name: 'Beam Me Up', emoji: '🛸', category: 'eccentric' },
  { id: 'octopus', name: 'Kraken Hug', emoji: '🐙', category: 'eccentric' },
  { id: 'ghost', name: 'Spooky Nerd', emoji: '👻', category: 'eccentric' },
  { id: 'brain', name: 'Huge Mind', emoji: '🧠', category: 'eccentric' },
  { id: 'portal', name: 'Dimension Loop', emoji: '🌀', category: 'eccentric' },

  // Vintage Category
  { id: 'tape', name: 'Rewind Tape', emoji: '📼', category: 'vintage' },
  { id: 'gameboy', name: 'Retro Play', emoji: '🕹️', category: 'vintage' },
  { id: 'radio', name: 'No Signal', emoji: '📻', category: 'vintage' },
  { id: 'skate', name: 'Kickflip', emoji: '🛹', category: 'vintage' },
  { id: 'pizza', name: 'Pizza Party', emoji: '🍕', category: 'vintage' },

  // Illustrations Category
  { id: 'shroom', name: 'Magic Cap', emoji: '🍄', category: 'illustrations' },
  { id: 'bomb', name: 'Boom Vibe', emoji: '💣', category: 'illustrations' },
  { id: 'heart_crack', name: 'Heart Glitch', emoji: '💔', category: 'illustrations' },
  { id: 'lizard', name: 'Scurry Dino', emoji: '🦖', category: 'illustrations' },
  { id: 'beer', name: 'Yeast Magic', emoji: '🍺', category: 'illustrations' },
];

export const PREMADE_DESIGNS: TeeDesign[] = [
  {
    id: 'premade_1',
    name: 'Existential Dread Club',
    description: 'An premium heavyweight tee dedicated to all corporate survivalists. It represents the supreme state of melting into your workstation.',
    price: 24.99,
    style: 'unisex',
    fabricColor: '#334155', // Slate
    tags: ['Existential', 'Meme', 'Workplace'],
    isPremade: true,
    layers: [
      {
        id: 'layer_1_1',
        type: 'text',
        text: 'PHYSICALLY HERE',
        fontSize: 24,
        fontFamily: 'Space Grotesk',
        color: '#f8fafc',
        x: 50,
        y: 25,
        scale: 1.1,
        rotation: -4,
        zIndex: 2,
      },
      {
        id: 'layer_1_2',
        type: 'sticker',
        stickerId: 'melt',
        x: 50,
        y: 52,
        scale: 2.2,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'layer_1_3',
        type: 'text',
        text: 'MENTALLY IN AN UNSTABLE API',
        fontSize: 16,
        fontFamily: 'JetBrains Mono',
        color: '#eab308',
        x: 50,
        y: 78,
        scale: 1,
        rotation: 3,
        zIndex: 3,
      }
    ]
  },
  {
    id: 'premade_2',
    name: 'Neon Cosmic Escape',
    description: 'For those ready to get abducted by Aliens because rent is too high down here. Features bright nuclear visual contrasts.',
    price: 26.99,
    style: 'croptop',
    fabricColor: '#db2777', // retro fuchsia
    tags: ['Sci-Fi', 'Alien', 'Retro'],
    isPremade: true,
    layers: [
      {
        id: 'layer_2_1',
        type: 'text',
        text: 'Beam Me Up',
        fontSize: 36,
        fontFamily: 'Pacifico',
        color: '#f8fafc',
        x: 50,
        y: 28,
        scale: 1.2,
        rotation: -8,
        zIndex: 2,
      },
      {
        id: 'layer_2_2',
        type: 'sticker',
        stickerId: 'ufo',
        x: 50,
        y: 56,
        scale: 2.5,
        rotation: 12,
        zIndex: 1,
      },
      {
        id: 'layer_2_3',
        type: 'text',
        text: 'I WAS PROMISED GLORY',
        fontSize: 16,
        fontFamily: 'Space Grotesk',
        color: '#0f172a',
        x: 50,
        y: 80,
        scale: 1,
        rotation: 0,
        zIndex: 3,
      }
    ]
  },
  {
    id: 'premade_3',
    name: 'Glitch In The System',
    description: 'A classic retro long sleeve tribute to the legendary programmers of the 1980s. Ideal for typing furious code that runs on first attempt.',
    price: 32.99,
    style: 'longsleeve',
    fabricColor: '#0f172a', // Midnight obsidian
    tags: ['Tech', 'Retro', 'Glitch'],
    isPremade: true,
    layers: [
      {
        id: 'layer_3_1',
        type: 'text',
        text: 'ERROR 404',
        fontSize: 32,
        fontFamily: 'Bungee',
        color: '#db2777', // fuchsia
        x: 50,
        y: 25,
        scale: 1.2,
        rotation: 0,
        zIndex: 2,
      },
      {
        id: 'layer_3_2',
        type: 'sticker',
        stickerId: 'robot',
        x: 50,
        y: 52,
        scale: 2.0,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'layer_3_3',
        type: 'text',
        text: 'SOCIALLY UNDEFINED',
        fontSize: 18,
        fontFamily: 'JetBrains Mono',
        color: '#65a30d', // Green
        x: 50,
        y: 75,
        scale: 1,
        rotation: -4,
        zIndex: 3,
      }
    ]
  },
  {
    id: 'premade_4',
    name: 'Supervillain Reactor Hoodie',
    description: 'The definitive over-engineered layer. Double thick cotton to absorb structural disappointment and build servers in total anonymity.',
    price: 44.99,
    style: 'hoodie',
    fabricColor: '#334155', // Slate
    tags: ['Cozy', 'Evil', 'Gaming'],
    isPremade: true,
    layers: [
      {
        id: 'layer_4_1',
        type: 'text',
        text: 'CATASTROPHIC DESIGN',
        fontSize: 22,
        fontFamily: 'Syne',
        color: '#f8fafc',
        x: 50,
        y: 25,
        scale: 1.1,
        rotation: 0,
        zIndex: 2,
      },
      {
        id: 'layer_4_2',
        type: 'sticker',
        stickerId: 'bomb',
        x: 50,
        y: 54,
        scale: 2.4,
        rotation: -15,
        zIndex: 1,
      },
      {
        id: 'layer_4_3',
        type: 'text',
        text: 'DO NOT PRESS THE BUTTON',
        fontSize: 14,
        fontFamily: 'JetBrains Mono',
        color: '#ef4444', // Red
        x: 50,
        y: 82,
        scale: 1,
        rotation: 5,
        zIndex: 3,
      }
    ]
  },
  {
    id: 'premade_5',
    name: 'Atomic Pizza Wizard',
    description: 'A magical mashup celebrating carbs and cosmic spells. If you love deep pan pizzas and ancient wizards, this is your coat of arms.',
    price: 24.99,
    style: 'unisex',
    fabricColor: '#eab308', // Yellow
    tags: ['Magic', 'Food', 'Funky'],
    isPremade: true,
    layers: [
      {
        id: 'layer_5_1',
        type: 'text',
        text: 'WIZARD OF CARBS',
        fontSize: 24,
        fontFamily: 'Creepster',
        color: '#991b1b', // Red
        x: 50,
        y: 28,
        scale: 1.2,
        rotation: 4,
        zIndex: 2,
      },
      {
        id: 'layer_5_2',
        type: 'sticker',
        stickerId: 'pizza',
        x: 50,
        y: 56,
        scale: 2.2,
        rotation: -10,
        zIndex: 1,
      },
      {
        id: 'layer_5_3',
        type: 'text',
        text: 'GLUTEN INTOLERANCY IMMUNITY',
        fontSize: 12,
        fontFamily: 'Space Grotesk',
        color: '#0f172a',
        x: 50,
        y: 78,
        scale: 1,
        rotation: 0,
        zIndex: 3,
      }
    ]
  }
];
