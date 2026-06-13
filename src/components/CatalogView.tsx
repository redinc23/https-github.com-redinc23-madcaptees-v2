/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TeeDesign, ShirtSize } from '../types';
import { PREMADE_DESIGNS } from '../data';
import { HelpCircle, Sparkles, Wand2, ShoppingCart, ArrowUpRight, Search } from 'lucide-react';

interface CatalogViewProps {
  onLoadDesignIntoStudio: (design: TeeDesign) => void;
  onAddToCartDirect: (design: TeeDesign, size: ShirtSize) => void;
}

export default function CatalogView({ onLoadDesignIntoStudio, onAddToCartDirect }: CatalogViewProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedSizeForDesign, setSelectedSizeForDesign] = useState<{ [key: string]: ShirtSize }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract all distinct tags for filtering
  const allTags = ['All', ...Array.from(new Set(PREMADE_DESIGNS.flatMap(d => d.tags)))];

  const filteredDesigns = PREMADE_DESIGNS.filter((design) => {
    const matchesTag = selectedTag === 'All' || design.tags.includes(selectedTag);
    const matchesKeyword = searchQuery === '' || 
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTag && matchesKeyword;
  });

  const getStickerEmoji = (stickerId?: string) => {
    switch (stickerId) {
      case 'melt': return '🫠';
      case 'skull': return '💀';
      case 'clown': return '🤡';
      case 'alien': return '👽';
      case 'robot': return '🤖';
      case 'lightning': return '⚡';
      case 'star': return '⭐';
      case 'swirl': return '🌀';
      case 'crystal': return '🔮';
      case 'fire': return '🔥';
      case 'ufo': return '🛸';
      case 'octopus': return '🐙';
      case 'ghost': return '👻';
      case 'brain': return '🧠';
      case 'portal': return '🌀';
      case 'tape': return '📼';
      case 'gameboy': return '🕹️';
      case 'radio': return '📻';
      case 'skate': return '🛹';
      case 'pizza': return '🍕';
      case 'shroom': return '🍄';
      case 'bomb': return '💣';
      case 'heart_crack': return '💔';
      case 'lizard': return '🦖';
      case 'beer': return '🍺';
      default: return '🍔';
    }
  };

  const handleSizeChange = (designId: string, size: ShirtSize) => {
    setSelectedSizeForDesign((prev) => ({ ...prev, [designId]: size }));
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero with distinctive urban/grunge streetwear header */}
      <div className="p-6 md:p-8 rounded-none bg-brand-card/90 border border-white/10 text-center relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 w-44 h-44 bg-brand-pink/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-8 w-44 h-44 bg-brand-purple/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 text-[10px] font-mono tracking-widest text-brand-pink font-bold uppercase">
            ⚡ MADCAP MASTERPIECES ⚡
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-white leading-tight uppercase">
            Eccentric Apparel for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan">Sophisticated Miscreant</span>
          </h1>
          <p className="text-white/60 text-xs md:text-sm font-mono max-w-lg mx-auto leading-relaxed uppercase">
            All premium garments are pre-configured to provoke reactions and prompt interesting discussions. Load them into the Customizer to tweak!
          </p>
        </div>
      </div>

      {/* Filter and search controllers */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/10 pb-5">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto p-1 bg-black/40 rounded-none border border-white/10">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-mono font-bold tracking-widest transition-all whitespace-nowrap cursor-pointer uppercase ${
                selectedTag === tag
                  ? 'bg-brand-pink text-white border border-brand-pink shadow-[0_0_10px_rgba(255,0,85,0.25)]'
                  : 'text-white/40 hover:text-white bg-transparent border border-transparent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="SEARCH CATALOG FEED..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-none font-mono text-xs text-white focus:outline-none focus:border-brand-pink placeholder-white/30 uppercase tracking-wider"
          />
          <Search size={14} className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-white/40" />
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => {
            const size = selectedSizeForDesign[design.id] || 'L';
            const headlineLayer = design.layers.find(l => l.type === 'text' && l.y < 40);
            const stickerLayer = design.layers.find(l => l.type === 'sticker');
            const sublineLayer = design.layers.find(l => l.type === 'text' && l.y > 60);

            return (
              <div
                key={design.id}
                className="group flex flex-col bg-brand-card/90 border border-white/10 rounded-none overflow-hidden shadow-xl hover:border-brand-pink/50 transition-all duration-300 relative"
              >
                {/* Visual Apparel Card Mock preview */}
                <div 
                  className="w-full aspect-square relative flex items-center justify-center p-6 overflow-hidden bg-black/45"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  {/* Floating price sticker */}
                  <div className="absolute top-4 left-4 z-20 bg-black/90 border border-white/15 px-3 py-1 rounded-none text-[10px] font-mono tracking-widest text-white flex items-center gap-1.5 shadow-md uppercase">
                    <span className="text-white/50">VAL:</span>
                    <span className="text-brand-pink font-bold">${design.price}</span>
                  </div>

                  {/* Interactive floating customizer loader */}
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-30">
                    <button
                      onClick={() => onLoadDesignIntoStudio(design)}
                      className="px-4 py-2 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold font-mono text-[10px] tracking-widest rounded-none flex items-center gap-1.5 shadow-lg shadow-brand-pink/20 active:scale-95 transition-transform cursor-pointer uppercase"
                    >
                      <Wand2 size={13} className="text-brand-cyan" /> CUSTOMIZE APPAREL
                    </button>
                    <p className="text-[9px] text-white/50 font-mono uppercase tracking-wider">Tweak text, colors & stickers</p>
                  </div>

                  {/* Micro stylized Apparel representation wrapper */}
                  <div className="w-[160px] h-[160px] relative">
                    {/* Outline Silhouette representation */}
                    <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" viewBox="0 0 100 100" fill="none">
                      <path
                        d="M15 36 L26 36 L24 24 C27 18 35 18 50 18 C65 18 73 18 76 24 L74 36 L85 36 L80 50 L72 45 L72 82 C72 85 70 88 66 88 L34 88 C30 88 28 85 28 82 L28 45 L20 50 Z"
                        fill={design.fabricColor}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.2"
                      />
                    </svg>
                    
                    {/* Mini printed layers on front */}
                    <div className="absolute w-[44%] h-[56%] top-[25%] left-[28%] flex flex-col items-center justify-between py-1.5 pointer-events-none">
                      {headlineLayer && (
                        <p 
                          className="font-black text-center leading-none text-white overflow-hidden text-ellipsis w-full uppercase"
                          style={{ 
                            fontFamily: headlineLayer.fontFamily, 
                            fontSize: `${(headlineLayer.fontSize || 24) * 0.32}px`,
                            lineHeight: 1.05
                          }}
                        >
                          {headlineLayer.text}
                        </p>
                      )}
                      
                      {stickerLayer && (
                        <span className="text-[22px] leading-none filter drop-shadow">
                          {getStickerEmoji(stickerLayer.stickerId)}
                        </span>
                      )}

                      {sublineLayer && (
                        <p 
                          className="font-semibold text-center overflow-hidden text-ellipsis w-full leading-none"
                          style={{ 
                            fontFamily: sublineLayer.fontFamily, 
                            fontSize: `${(sublineLayer.fontSize || 14) * 0.38}px`,
                            color: sublineLayer.color || '#FF0055'
                          }}
                        >
                          {sublineLayer.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Text Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-sans font-black text-white text-md uppercase tracking-wide group-hover:text-brand-pink transition-colors leading-tight">
                        {design.name}
                      </h3>
                      <button 
                        onClick={() => onLoadDesignIntoStudio(design)}
                        className="text-white/40 hover:text-white transition-colors p-0.5 cursor-pointer"
                        title="Open in editor"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    
                    <p className="text-white/60 font-mono text-[11px] mt-1.5 leading-relaxed uppercase">
                      {design.description}
                    </p>

                    {/* Tag bubbles */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {design.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-none bg-black border border-white/5 text-white/50 font-mono text-[9px] uppercase tracking-wider">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Size and Quick add bottom drawer bar */}
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono tracking-widest font-bold text-white/45 uppercase">SELECT SIZE</span>
                      <div className="flex gap-1">
                        {(['S', 'M', 'L', 'XL', 'XXL'] as ShirtSize[]).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleSizeChange(design.id, sz)}
                            className={`w-6 h-6 rounded-none flex items-center justify-center font-mono text-[9px] font-bold border transition-all cursor-pointer ${
                              size === sz
                                ? 'bg-brand-pink text-white border-brand-pink shadow-[0_0_8px_rgba(255,0,85,0.3)]'
                                : 'bg-transparent text-white/40 border-white/10 hover:border-brand-pink hover:text-white'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCartDirect(design, size)}
                      className="w-full py-2 bg-transparent hover:bg-brand-pink/5 border border-white/10 hover:border-brand-pink text-white rounded-none transition-all font-mono font-bold text-[10px] tracking-widest flex justify-center items-center gap-1.5 active:scale-98 cursor-pointer uppercase"
                    >
                      <ShoppingCart size={12} className="text-brand-cyan" /> QUICK ADD TO CARGO
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full p-12 text-center bg-black/40 border border-dashed border-white/10 rounded-none">
          <HelpCircle size={36} className="text-white/20 mx-auto mb-2.5" />
          <h2 className="text-white text-sm font-mono font-bold uppercase tracking-wider">No Designs Match Select Tag</h2>
          <p className="text-white/40 text-xs mt-1 uppercase">Try selecting another tag or clearing the search query.</p>
        </div>
      )}
    </div>
  );
}
