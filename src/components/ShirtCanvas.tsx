/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { CanvasLayer, ShirtStyle } from '../types';
import { Move, RotateCw, ZoomIn, Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react';

interface ShirtCanvasProps {
  style: ShirtStyle;
  fabricColor: string;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
}

export default function ShirtCanvas({
  style,
  fabricColor,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
}: ShirtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG Paths and configurations for different apparel styles
  const renderApparelOutline = () => {
    switch (style) {
      case 'hoodie':
        return (
          <svg className="w-full h-full drop-shadow-2xl transition-all duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hoodies Silhouette with Pouch and Drawstrings */}
            <path
              d="M15 42 L22 30 L32 23 C32 23 37 12 50 12 C63 12 68 23 68 23 L78 30 L85 42 L80 48 L72 38 L72 82 C72 85 70 88 66 88 L34 88 C30 88 28 85 28 82 L28 38 L20 48 Z"
              fill={fabricColor}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Detail lines: Hood inner fold */}
            <path d="M37 23 C37 23 45 28 50 28 C55 28 63 23 63 23 C63 23 58 13 50 13 C42 13 37 23 37 23 Z" fill="#000000" fillOpacity="0.15" stroke="#000000" strokeWidth="0.8" />
            <path d="M43 28 C43 28 47 33 50 33 C53 33 57 28 57 28" stroke="#000000" strokeWidth="1" />
            {/* Drawstrings */}
            <path d="M47 31 L45 38" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M53 31 L55 39" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
            {/* Pouch Pocket */}
            <path d="M36 68 L64 68 L60 82 L40 82 Z" fill="#000000" fillOpacity="0.08" stroke="#000000" strokeWidth="1" />
            {/* Ribbed Hem & Cuffs */}
            <path d="M34 85 L66 85" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 41 Q18 43 20 43" stroke="#000000" strokeWidth="1" />
            <path d="M84 41 Q82 43 80 43" stroke="#000000" strokeWidth="1" />
          </svg>
        );

      case 'longsleeve':
        return (
          <svg className="w-full h-full drop-shadow-2xl transition-all duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Long sleeves Outline */}
            <path
              d="M15 80 L11 81 L8 45 L20 28 L32 23 C35 18 40 18 50 18 C60 18 65 18 68 23 L80 28 L92 45 L89 81 L85 80 L80 40 L80 82 C80 85 78 88 74 88 L26 88 C22 88 20 85 20 82 L20 40 Z"
              fill={fabricColor}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Collar line */}
            <path d="M40 22 C43 26 57 26 60 22" stroke="#000000" strokeWidth="1" fill="none" />
            {/* Cuffs */}
            <path d="M11 78 L15 80" stroke="#000000" strokeWidth="1.5" />
            <path d="M89 78 L85 80" stroke="#000000" strokeWidth="1.5" />
          </svg>
        );

      case 'croptop':
        return (
          <svg className="w-full h-full drop-shadow-2xl transition-all duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crop Top Outline (shorter, boxier, raw hem) */}
            <path
              d="M15 38 L25 38 L25 24 C28 20 33 20 50 20 C67 20 72 20 75 24 L75 38 L85 38 L82 52 L73 48 L73 68 L27 68 L27 48 L18 52 Z"
              fill={fabricColor}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Collar neckline */}
            <path d="M40 23 C43 27 57 27 60 23" fill="#000000" fillOpacity="0.1" stroke="#000000" strokeWidth="1" />
            {/* Raw bottom edge details */}
            <line x1="27" y1="68" x2="73" y2="68" stroke="#000000" strokeWidth="1.5" strokeDasharray="1 1" />
          </svg>
        );

      case 'unisex':
      default:
        return (
          <svg className="w-full h-full drop-shadow-2xl transition-all duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Unisex Short Sleeve T-Shirt Outline */}
            <path
              d="M15 36 L26 36 L24 24 C27 18 35 18 50 18 C65 18 73 18 76 24 L74 36 L85 36 L80 50 L72 45 L72 82 C72 85 70 88 66 88 L34 88 C30 88 28 85 28 82 L28 45 L20 50 Z"
              fill={fabricColor}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Collar line */}
            <path d="M40 21 C43 26 57 26 60 21" fill="#000000" fillOpacity="0.1" stroke="#000000" strokeWidth="1" />
          </svg>
        );
    }
  };

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
      default: return '🔮';
    }
  };

  const activeLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-md bg-brand-card/95 border border-white/10 rounded-none p-4 md:p-6 backdrop-blur-md shadow-2xl transition-all">
      {/* Upper bar: Style tag and Reset selection */}
      <div className="flex justify-between items-center w-full mb-3 text-[10px] font-mono tracking-widest text-white/40">
        <span>PREVIEW AREA</span>
        <span>STYLE: {style.toUpperCase()}</span>
      </div>

      {/* Main interactive Canvas */}
      <div
        id="apparel-canvas-frame"
        ref={containerRef}
        onClick={() => onSelectLayer(null)}
        className="relative w-full aspect-square max-w-[340px] md:max-w-[390px] flex items-center justify-center cursor-default group overflow-hidden"
      >
        {/* Fabric Backdrop Silhouette */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          {renderApparelOutline()}
        </div>

        {/* Printable/Editable Area Box (Dashed boundaries on chest) */}
        <div 
          className={`absolute w-[44%] h-[56%] top-[25%] left-[28%] border border-dashed rounded-none transition-all flex items-center justify-center pointer-events-none ${
            selectedLayerId ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-white/10'
          }`}
        >
          <span className="absolute bottom-1 right-2 text-[7px] font-mono tracking-widest text-white/30 uppercase">PRINT ZONE</span>
        </div>

        {/* Floating Custom Layers (Rendered inside the Print Zone Container to keep dimensions fully responsive) */}
        <div className="absolute w-[44%] h-[56%] top-[25%] left-[28%]">
          {layers
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((layer) => {
              const isSelected = selectedLayerId === layer.id;

              return (
                <div
                  id={`layer-element-${layer.id}`}
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLayer(layer.id);
                  }}
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                    zIndex: layer.zIndex,
                  }}
                  className={`absolute cursor-pointer transition-shadow hover:outline-1 hover:outline-dashed hover:outline-brand-cyan/60 p-1 rounded-none ${
                    isSelected ? 'outline outline-1 outline-brand-pink shadow-[0_0_20px_rgba(255,0,85,0.4)]' : ''
                  }`}
                >
                  {/* Outer selection helpers shown only, when active */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-4 h-4 rounded-none bg-brand-pink text-white flex items-center justify-center animate-bounce text-[8px] font-bold shadow-md shadow-brand-pink/50">
                      ★
                    </div>
                  )}

                  {/* Render based on Type */}
                  {layer.type === 'text' && (
                    <p
                      style={{
                        fontFamily: layer.fontFamily || 'sans-serif',
                        fontSize: `${layer.fontSize}px`,
                        color: layer.color,
                        lineHeight: 1.1,
                      }}
                      className="whitespace-nowrap font-bold tracking-tight text-center drop-shadow"
                    >
                      {layer.text || 'Write Text'}
                    </p>
                  )}

                  {layer.type === 'sticker' && (
                    <div className="text-4xl select-none filter drop-shadow-md py-1 px-2 leading-none antialiased">
                      {getStickerEmoji(layer.stickerId)}
                    </div>
                  )}

                  {layer.type === 'upload' && layer.src && (
                    <img
                      src={layer.src}
                      alt="Custom design"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-contain pointer-events-none drop-shadow"
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Manual Layout & Fine-Tuning adjustment panel (Displays when a layer is selected) */}
      {activeLayer ? (
        <div id="layout-fine-tuning-panel" className="w-full mt-4 bg-[#0f0f12] rounded-none border border-white/10 p-4 transition-all animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-mono font-bold text-brand-pink tracking-widest flex items-center gap-1.5 uppercase">
              <Layers size={13} className="text-brand-cyan" />
              EDITING: {activeLayer.type.toUpperCase()} LAYER
            </h4>
            <button
              onClick={() => onDeleteLayer(activeLayer.id)}
              className="text-white/40 hover:text-brand-pink p-1 py-0.5 border border-white/10 hover:border-brand-pink rounded-none transition-colors flex items-center gap-1 text-[9px] font-mono cursor-pointer uppercase"
              title="Delete layer"
            >
              <Trash2 size={11} /> DELETE
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Position Controls: Horizontal and Vertical */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="flex justify-between font-mono text-[9px] text-white/40 mb-1">
                  <span>H-POSITION (X)</span>
                  <span className="text-brand-pink font-bold">{Math.round(activeLayer.x)}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={activeLayer.x}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { x: Number(e.target.value) })}
                    className="w-full accent-brand-pink bg-[#050505] h-1 rounded-none cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="flex justify-between font-mono text-[9px] text-white/40 mb-1">
                  <span>V-POSITION (Y)</span>
                  <span className="text-brand-pink font-bold">{Math.round(activeLayer.y)}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={activeLayer.y}
                    onChange={(e) => onUpdateLayer(activeLayer.id, { y: Number(e.target.value) })}
                    className="w-full accent-brand-pink bg-[#050505] h-1 rounded-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Scale Slider and Rotate Slider */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="flex justify-between font-mono text-[9px] text-white/40 mb-1">
                  <span className="flex items-center gap-1"><ZoomIn size={12} /> SCALE</span>
                  <span className="text-brand-cyan font-bold">{activeLayer.scale.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={activeLayer.scale}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { scale: Number(e.target.value) })}
                  className="w-full accent-brand-cyan bg-[#050505] h-1 rounded-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between font-mono text-[9px] text-white/40 mb-1">
                  <span className="flex items-center gap-1"><RotateCw size={12} /> ROTATE</span>
                  <span className="text-brand-cyan font-bold">{activeLayer.rotation}°</span>
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={activeLayer.rotation}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { rotation: Number(e.target.value) })}
                  className="w-full accent-brand-cyan bg-[#050505] h-1 rounded-none cursor-pointer"
                />
              </div>
            </div>

            {/* Depth controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="font-mono text-white/40 text-[9px] tracking-wider uppercase">LAYER DEPTH</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onUpdateLayer(activeLayer.id, { zIndex: activeLayer.zIndex + 1 })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white hover:text-brand-pink transition-all font-mono text-[9px] flex items-center gap-1 cursor-pointer rounded-none uppercase border border-white/10"
                >
                  <ArrowUp size={11} /> BRING FORWARD
                </button>
                <button
                  onClick={() => onUpdateLayer(activeLayer.id, { zIndex: Math.max(1, activeLayer.zIndex - 1) })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white hover:text-brand-pink transition-all font-mono text-[9px] flex items-center gap-1 cursor-pointer rounded-none uppercase border border-white/10"
                >
                  <ArrowDown size={11} /> SEND BACKWARD
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-4 text-center py-4 bg-[#0c0c0e]/30 text-white/40 font-mono text-[10px] tracking-wide rounded-none border border-dashed border-white/10">
          💡 CLICK ANY LAYER ELEMENT ON THE GARMENT TO POSITION, SCALE, ROTATE, OR DELETE IT.
        </div>
      )}
    </div>
  );
}
