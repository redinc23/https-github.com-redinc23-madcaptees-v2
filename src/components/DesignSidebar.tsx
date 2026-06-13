/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FabricColor, ShirtStyle, CanvasLayer, StickerItem } from '../types';
import { FABRIC_COLORS, SHIRT_STYLES, FONTS, STICKERS } from '../data';
import { Plus, Sliders, Type, Smile, Upload, Sparkles, Wand2, Loader2, RefreshCw } from 'lucide-react';

interface DesignSidebarProps {
  currentStyle: ShirtStyle;
  onStyleChange: (style: ShirtStyle) => void;
  currentFabricColorHex: string;
  onFabricColorChange: (hex: string) => void;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onAddLayer: (layer: CanvasLayer) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onSelectLayer: (id: string | null) => void;
  onClearLayers: () => void;
}

interface AISloganIdea {
  headline: string;
  subline: string;
  stickerEmoji: string;
  explanation: string;
}

export default function DesignSidebar({
  currentStyle,
  onStyleChange,
  currentFabricColorHex,
  onFabricColorChange,
  layers,
  selectedLayerId,
  onAddLayer,
  onUpdateLayer,
  onSelectLayer,
  onClearLayers,
}: DesignSidebarProps) {
  const [activeTab, setActiveTab] = useState<'apparel' | 'text' | 'stickers' | 'upload' | 'ai'>('apparel');
  const [stickerFilter, setStickerFilter] = useState<string>('all');
  
  // Text element state
  const [newText, setNewText] = useState('UNSTABLE NODE');
  const [selectedFont, setSelectedFont] = useState('Space Grotesk');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedTextColor, setSelectedTextColor] = useState('#f8fafc');

  // AI Generator local states
  const [aiTheme, setAiTheme] = useState('Existential Dread');
  const [aiVibe, setAiVibe] = useState('Highly Sarcastic');
  const [customTopic, setCustomTopic] = useState('');
  const [aiSlogans, setAiSlogans] = useState<AISloganIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const activeLayer = layers.find(l => l.id === selectedLayerId);
  const isSelectedLayerText = activeLayer?.type === 'text';

  // Handler to add a brand new custom text layer
  const handleAddTextLayer = () => {
    const freshId = `text_${Date.now()}`;
    const newLayer: CanvasLayer = {
      id: freshId,
      type: 'text',
      text: newText,
      fontSize: selectedFontSize,
      fontFamily: selectedFont,
      color: selectedTextColor,
      x: 50,
      y: layers.length === 0 ? 35 : Math.min(85, 30 + layers.length * 15),
      scale: 1.0,
      rotation: 0,
      zIndex: layers.length + 5,
    };
    onAddLayer(newLayer);
    onSelectLayer(freshId);
  };

  // Handler for custom local image uploads (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const freshId = `upload_${Date.now()}`;
        const newLayer: CanvasLayer = {
          id: freshId,
          type: 'upload',
          src: reader.result as string,
          x: 50,
          y: 50,
          scale: 1.2,
          rotation: 0,
          zIndex: layers.length + 4,
        };
        onAddLayer(newLayer);
        onSelectLayer(freshId);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler to inject selected stickers
  const handleAddSticker = (sticker: StickerItem) => {
    const freshId = `sticker_${Date.now()}`;
    const newLayer: CanvasLayer = {
      id: freshId,
      type: 'sticker',
      stickerId: sticker.id,
      x: 50,
      y: 50,
      scale: 1.8,
      rotation: 0,
      zIndex: layers.length + 3,
    };
    onAddLayer(newLayer);
    onSelectLayer(freshId);
  };

  // Express server-side calling logic for generator
  const handleCallGeminiAI = async () => {
    setIsGenerating(true);
    setAiError(null);
    setAiSlogans([]);

    try {
      const response = await fetch('/api/generate-slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: aiTheme,
          vibe: aiVibe,
          customTopics: customTopic,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'The Gemini API service generated an error. Double-check your API Key configuration.');
      }

      setAiSlogans(data.slogans);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Service offline. Check network configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Help translate stickerEmoji to appropriate pre-existing stickers inside sticker library
  const mapEmojiToStickerId = (emoji: string): string => {
    const matches = STICKERS.find(s => s.emoji === emoji || emoji.includes(s.emoji));
    return matches ? matches.id : 'swirl';
  };

  // Overwrites current canvas layers with a curated Gemini suggestion
  const handleApplyAISlogan = (idea: AISloganIdea) => {
    onClearLayers();

    // Layer 1: Top Headline (Large)
    const layer1: CanvasLayer = {
      id: `ai_h_${Date.now()}`,
      type: 'text',
      text: idea.headline.toUpperCase(),
      fontSize: idea.headline.length > 20 ? 18 : 24,
      fontFamily: 'Space Grotesk',
      color: '#f8fafc',
      x: 50,
      y: 24,
      scale: 1.1,
      rotation: -3,
      zIndex: 2,
    };

    // Layer 2: Center Sticker
    const targetStickerId = mapEmojiToStickerId(idea.stickerEmoji);
    const layer2: CanvasLayer = {
      id: `ai_s_${Date.now()}`,
      type: 'sticker',
      stickerId: targetStickerId,
      x: 50,
      y: 52,
      scale: 2.2,
      rotation: 5,
      zIndex: 1,
    };

    // Layer 3: Lower Supporting Subline (Smaller)
    const layer3: CanvasLayer = {
      id: `ai_b_${Date.now()}`,
      type: 'text',
      text: idea.subline,
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      color: '#FF0055', // Brand punch pink color
      x: 50,
      y: 78,
      scale: 1.0,
      rotation: 2,
      zIndex: 3,
    };

    onAddLayer(layer1);
    onAddLayer(layer2);
    onAddLayer(layer3);
    onSelectLayer(null);
  };

  return (
    <div className="flex flex-col w-full bg-brand-card/95 border border-white/10 rounded-none overflow-hidden shadow-2xl min-h-[500px] backdrop-blur-md relative z-10">
      {/* Sidebar Section tabs bar */}
      <div className="flex border-b border-white/10 bg-black/40 p-2 gap-1 overflow-x-auto scrollbar-none">
        {(['apparel', 'text', 'stickers', 'upload', 'ai'] as const).map((tab) => {
          const getIcon = () => {
            switch (tab) {
              case 'apparel': return <Sliders size={14} className="text-brand-cyan" />;
              case 'text': return <Type size={14} className="text-brand-cyan" />;
              case 'stickers': return <Smile size={14} className="text-brand-cyan" />;
              case 'upload': return <Upload size={14} className="text-brand-cyan" />;
              case 'ai': return <Sparkles size={14} className="text-brand-pink animate-pulse" />;
            }
          };

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-[10px] font-mono font-bold tracking-widest border transition-all cursor-pointer uppercase ${
                activeTab === tab
                  ? 'bg-brand-pink/15 border-brand-pink/40 text-white shadow-[0_0_15px_rgba(255,0,85,0.2)]'
                  : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {getIcon()}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[510px] sm:max-h-[580px] md:max-h-[660px]">
        
        {/* PANEL: Apparel styling & colors */}
        {activeTab === 'apparel' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-brand-pink uppercase mb-3">1. Select Apparel Base</h3>
              <div className="grid grid-cols-2 gap-3">
                {SHIRT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onStyleChange(style.id)}
                    className={`p-3.5 rounded-none border text-left cursor-pointer transition-all ${
                      currentStyle === style.id
                        ? 'border-brand-pink bg-brand-pink/5 shadow-[0_0_15px_rgba(255,0,85,0.15)] ring-0'
                        : 'border-white/10 bg-[#0f0f12] hover:border-brand-pink hover:bg-brand-pink/5'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-white mb-1 leading-none uppercase">{style.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">${style.basePrice}</div>
                    <p className="text-[9px] text-zinc-500 mt-1.5 leading-relaxed truncate">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-brand-pink uppercase mb-3">2. Fabric Color</h3>
              <div className="grid grid-cols-4 gap-3.5">
                {FABRIC_COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onFabricColorChange(col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`h-11 rounded-none border relative group transition-all transform hover:scale-105 cursor-pointer ${
                      currentFabricColorHex.toLowerCase() === col.hex.toLowerCase()
                        ? 'border-brand-pink ring-2 ring-brand-pink/50 scale-102'
                        : 'border-white/10'
                    }`}
                    title={col.name}
                  >
                    {/* Tick for selected */}
                    {currentFabricColorHex.toLowerCase() === col.hex.toLowerCase() && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black mix-blend-difference">
                        ✓
                      </span>
                    )}
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#0c0c0e] border border-white/10 text-white text-[9px] font-mono py-1 px-1.5 rounded-none whitespace-nowrap z-50 shadow-md">
                      {col.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onClearLayers}
                className="w-full text-center py-2.5 bg-transparent border border-white/10 hover:border-red-500/50 text-white/50 hover:text-red-400 rounded-none transition-all font-mono text-[10px] tracking-widest cursor-pointer flex items-center justify-center gap-2 uppercase"
              >
                <RefreshCw size={12} className="text-brand-cyan animate-spin-slow" /> CLEAR CANVAS LAYERS
              </button>
            </div>
          </div>
        )}

        {/* PANEL: Text Layer customization */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Context: are we adding a new text layer or modifying an existing, selected text layer? */}
            {isSelectedLayerText ? (
              <div className="p-4 bg-brand-pink/5 border border-brand-pink/20 rounded-none space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest font-bold text-brand-pink uppercase">MODIFYING SELECTED TEXT</span>
                  <button onClick={() => onSelectLayer(null)} className="text-[9px] font-mono text-white/50 hover:text-white uppercase">DONE</button>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">EDIT TEXT CONTENT</label>
                  <textarea
                    value={activeLayer.text || ''}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { text: e.target.value })}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 text-white rounded-none font-mono text-sm focus:outline-none focus:border-brand-pink text-center uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">FONT PAIRING</label>
                  <select
                    value={activeLayer.fontFamily || 'Space Grotesk'}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { fontFamily: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none rounded-none"
                  >
                    {FONTS.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">TEXT COLOR</label>
                    <input
                      type="color"
                      value={activeLayer.color || '#ffffff'}
                      onChange={(e) => onUpdateLayer(activeLayer.id, { color: e.target.value })}
                      className="w-full h-8 px-1 py-1 bg-black/40 border border-white/10 rounded-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">FONT SIZE ({activeLayer.fontSize}px)</label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={activeLayer.fontSize || 24}
                      onChange={(e) => onUpdateLayer(activeLayer.id, { fontSize: Number(e.target.value) })}
                      className="w-full accent-brand-pink cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono font-bold tracking-widest text-brand-pink uppercase">ADD A TEXT LAYER</h3>
                
                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">TYPOGRAPHY TEXT</label>
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white focus:outline-none font-mono text-sm uppercase text-center focus:border-brand-pink rounded-none"
                    placeholder="ENTER SLOGAN TEXT"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">SELECT DESIGN FONT</label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-none font-mono text-xs focus:outline-none"
                  >
                    {FONTS.map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">FILL COLOR</label>
                    <div className="flex gap-1.5 items-center bg-black border border-white/10 p-1.5 rounded-none">
                      <input
                        type="color"
                        value={selectedTextColor}
                        onChange={(e) => setSelectedTextColor(e.target.value)}
                        className="w-8 h-8 rounded-none cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-[10px] font-mono uppercase text-white/60">{selectedTextColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">FONT SIZE ({selectedFontSize}px)</label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={selectedFontSize}
                      onChange={(e) => setSelectedFontSize(Number(e.target.value))}
                      className="w-full accent-brand-pink h-8 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddTextLayer}
                  className="w-full py-3 bg-brand-pink hover:bg-brand-pink/90 active:scale-98 text-white rounded-none transition-all font-mono font-bold text-xs flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest shadow-lg shadow-brand-pink/15"
                >
                  <Plus size={15} /> ADD TEXT LAYER TO SHIRT
                </button>
              </div>
            )}
          </div>
        )}

        {/* PANEL: Stickers & Icons */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 border-b border-white/10">
              {['all', 'memes', 'shapes', 'eccentric', 'vintage', 'illustrations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStickerFilter(cat)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-none transition-colors cursor-pointer uppercase tracking-wider font-bold ${
                    stickerFilter === cat
                      ? 'bg-brand-pink text-white shadow-[0_0_10px_rgba(255,0,85,0.25)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {STICKERS.filter(s => stickerFilter === 'all' || s.category === stickerFilter).map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleAddSticker(sticker)}
                  className="p-3 bg-[#0f0f12] border border-white/10 hover:border-brand-pink rounded-none text-center group transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                  title={sticker.name}
                >
                  <span className="text-3xl leading-none mb-1 group-hover:scale-110 transition-transform filter drop-shadow">
                    {sticker.emoji}
                  </span>
                  <span className="text-[8px] font-mono text-white/40 overflow-hidden text-ellipsis w-full whitespace-nowrap block mt-1">
                    {sticker.name.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: Upload Graphics */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-brand-pink uppercase mb-1">UPLOAD CUSTOM GRAPHIC</h3>
            
            <div className="border border-dashed border-white/15 hover:border-brand-pink/55 bg-black/40 rounded-none p-6 text-center transition-colors relative flex flex-col items-center justify-center">
              <Upload size={32} className="text-white/40 mb-2" />
              <p className="text-xs text-white/60">Drag & Drop your design or click below</p>
              <p className="text-[9px] text-white/40 mt-1 font-mono uppercase tracking-wider">SUPPORTS PNG, JPEG, SVG up to 5MB</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="p-3.5 bg-[#0f0f12] border border-white/10 rounded-none text-[10px] text-white/40 font-mono leading-relaxed">
              💡 Tip: Use a PNG with a transparent background for a seamless integration onto the fabric silhouette.
            </div>
          </div>
        )}

        {/* PANEL: AI Slogan Generator (Powered by Gemini) */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 p-2 bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 border border-brand-pink/20 rounded-none">
              <Wand2 size={16} className="text-brand-pink animate-pulse" />
              <span className="text-xs font-mono text-brand-pink font-bold uppercase tracking-widest">AI SLOGAN MASTERMIND GENERATOR</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">CHOOSE ARTISTIC CATEGORY</label>
                <select
                  value={aiTheme}
                  onChange={(e) => setAiTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-none font-mono text-xs focus:outline-none"
                >
                  <option value="Existential Dread">Existential Dread & Cynical Vibe</option>
                  <option value="Advanced Developer Jokes">Underpaid Dev Software Tears</option>
                  <option value="Absurdism & Surrealistic Humor">Wacky Absurdist Chaos</option>
                  <option value="Aggressively Positive Slogans">Threateningly Happy & Cheerful</option>
                  <option value="Coffee & Caffeinated Vibe">Deep Cafe & Caffeine Worship</option>
                  <option value="Alien & Retro Sci-Fi">Atomic Space Age Paranoia</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">CHOOSE COPYWRITING STYLE</label>
                <select
                  value={aiVibe}
                  onChange={(e) => setAiVibe(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-none font-mono text-xs focus:outline-none"
                >
                  <option value="Highly Sarcastic & Smart">Highly Sarcastic & Cynical</option>
                  <option value="Extremely Intellectual & Philosophical">Extremely Philosophical</option>
                  <option value="Gen-Z Slang, Brainrot & Meme Speak">Gen-Z Brainrot Meme Speak</option>
                  <option value="Scream & Chaos Core">Vintage Punk Screamcore</option>
                  <option value="Dry Corporate Speak Humor">Dry Corporate Boardroom Irony</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">INCORPORATE CUSTOM KEYWORDS (OPTIONAL)</label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-none focus:outline-none font-mono text-xs focus:border-brand-pink"
                  placeholder="e.g. coffee, react, deadlines, absolute chaos"
                />
              </div>

              <button
                onClick={handleCallGeminiAI}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold font-mono text-xs rounded-none flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-brand-pink/15 cursor-pointer transition-all active:scale-98 uppercase tracking-widest"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-brand-cyan" /> CONJURING DESIGNS WITH GEMINI AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-brand-cyan" /> CONJURING AI DESIGNS
                  </>
                )}
              </button>
            </div>

            {/* AI Error display */}
            {aiError && (
              <div className="p-3 bg-red-950/60 border border-red-500/20 rounded-none text-[11px] font-mono text-red-300 leading-relaxed uppercase tracking-wider">
                🤖 {aiError}
              </div>
            )}

            {/* Generated results rendering */}
            {aiSlogans.length > 0 && (
              <div className="mt-4 space-y-3">
                <span className="text-[10px] font-mono tracking-widest font-bold text-brand-pink uppercase block">SELECT A LAYOUT TO LOAD IT</span>
                <div className="space-y-3">
                  {aiSlogans.map((idea, index) => (
                    <div
                      key={index}
                      onClick={() => handleApplyAISlogan(idea)}
                      className="p-3.5 bg-[#0f0f12] border border-white/10 hover:border-brand-pink rounded-none cursor-pointer hover:bg-brand-pink/5 group transition-all"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[9px] font-mono text-brand-pink bg-brand-pink/15 py-0.5 px-2 rounded-none font-bold uppercase tracking-wider">IDEA {index + 1}</span>
                        <span className="text-2xl filter drop-shadow">{idea.stickerEmoji}</span>
                      </div>
                      <div className="text-xs font-mono font-black text-white group-hover:text-brand-pink tracking-tight uppercase">{idea.headline.toUpperCase()}</div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">{idea.subline}</div>
                      <p className="text-[9px] text-white/30 italic mt-2 border-t border-white/10 pt-1.5">"{idea.explanation}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
