/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShirtStyle, ShirtSize, CanvasLayer, TeeDesign, CartItem } from './types';
import ShirtCanvas from './components/ShirtCanvas';
import DesignSidebar from './components/DesignSidebar';
import CatalogView from './components/CatalogView';
import CartCheckout from './components/CartCheckout';
import { ShoppingBag, Sparkles, Sliders, LayoutGrid, Heart, Gift } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'catalog'>('studio');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Custom Studio apparel configuration states
  const [studioStyle, setStudioStyle] = useState<ShirtStyle>('unisex');
  const [studioFabricColor, setStudioFabricColor] = useState('#334155'); // Slate grey default
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Load initial preset design: Compile Failure Meme (Funny starting state)
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'start_h',
      type: 'text',
      text: 'CRITICAL FAILURE',
      fontSize: 24,
      fontFamily: 'Space Grotesk',
      color: '#ffffff',
      x: 50,
      y: 25,
      scale: 1.15,
      rotation: -5,
      zIndex: 10,
    },
    {
      id: 'start_s',
      type: 'sticker',
      stickerId: 'skull',
      x: 50,
      y: 54,
      scale: 2.2,
      rotation: 0,
      zIndex: 5,
    },
    {
      id: 'start_b',
      type: 'text',
      text: 'COMPILE EXITED WITH CODE 1',
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      color: '#FF0055', // Brand punch pink color
      x: 50,
      y: 80,
      scale: 1.0,
      rotation: 3,
      zIndex: 8,
    }
  ]);

  // Shopping Bag persist list state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Local storage synchronization
  useEffect(() => {
    const cachedCart = localStorage.getItem('madcap_cart_items');
    if (cachedCart) {
      try {
        setCartItems(JSON.parse(cachedCart));
      } catch (err) {
        console.error('Failed to parse cached bag items:', err);
      }
    }
  }, []);

  const saveCartToCache = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('madcap_cart_items', JSON.stringify(newCart));
  };

  // Canvas layers manipulation utilities
  const handleAddLayer = (newLayer: CanvasLayer) => {
    setLayers((prev) => [...prev, newLayer]);
  };

  const handleUpdateLayer = (id: string, updates: Partial<CanvasLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleClearLayers = () => {
    setLayers([]);
    setSelectedLayerId(null);
  };

  // Loads a premade design catalog selection into the active editor
  const handleLoadDesignIntoStudio = (design: TeeDesign) => {
    setStudioStyle(design.style);
    setStudioFabricColor(design.fabricColor);
    setLayers(design.layers);
    setSelectedLayerId(null);
    setActiveTab('studio');
  };

  // Checkout Direct purchase adds product straight, into bag from list view
  const handleAddToCartDirect = (design: TeeDesign, size: ShirtSize) => {
    const targetId = `${design.id}_${size}`;
    const exists = cartItems.find((item) => item.id === targetId);

    let updatedCart: CartItem[];
    if (exists) {
      updatedCart = cartItems.map((item) =>
        item.id === targetId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: targetId,
          design,
          size,
          quantity: 1,
        },
      ];
    }
    saveCartToCache(updatedCart);
    setIsCartOpen(true);
  };

  // Packs active current studio custom canvas state into a buyable Item record
  const handleAddStudioDesignToCart = (size: ShirtSize) => {
    if (layers.length === 0) {
      alert('The canvas is blank! Add some custom slogans or wacky stickers to buy.');
      return;
    }

    const customDesignId = `custom_${Date.now()}`;
    const customTee: TeeDesign = {
      id: customDesignId,
      name: `Madcap Original #${Math.floor(100 + Math.random() * 900)}`,
      description: `A unique cosmic custom configuration featuring ${layers.length} personalized layers of typography and graphics.`,
      price: studioStyle === 'hoodie' ? 44.99 : studioStyle === 'longsleeve' ? 32.99 : studioStyle === 'croptop' ? 26.99 : 24.99,
      style: studioStyle,
      fabricColor: studioFabricColor,
      tags: ['Custom', 'Original'],
      layers: [...layers],
      isPremade: false,
    };

    handleAddToCartDirect(customTee, size);
  };

  const handleUpdateCartQuantity = (cartItemId: string, q: number) => {
    const updated = cartItems.map((item) =>
      item.id === cartItemId ? { ...item, quantity: q } : item
    );
    saveCartToCache(updated);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const filtered = cartItems.filter((item) => item.id !== cartItemId);
    saveCartToCache(filtered);
  };

  const handleClearCart = () => {
    saveCartToCache([]);
  };

  const cartTotalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans antialiased overflow-x-hidden selection:bg-brand-pink selection:text-white pb-12 relative">
      {/* Background atmospheric blur glows */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-25 overflow-hidden z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-brand-pink blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-brand-cyan blur-[125px] rounded-full opacity-30 pointer-events-none"></div>
      </div>

      {/* Upper Navigation Header Bar */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between relative">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-pink to-brand-purple rounded-sm rotate-45 flex items-center justify-center cursor-pointer hover:rotate-180 transition-transform duration-500">
            <span className="text-xs font-black text-white -rotate-45 block">M</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-space font-black tracking-tighter text-white leading-none text-lg">
              MADCAP<span className="text-brand-pink">.</span>
            </h1>
            <span className="text-[8px] font-mono tracking-[0.2em] text-white/40 uppercase mt-0.5">ECCENTRIC APPAREL</span>
          </div>
        </div>

        {/* Tab Selector controls */}
        <div className="flex bg-[#0f0f12] border border-white/15 rounded-none p-1 gap-1">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer rounded-none uppercase ${
              activeTab === 'studio'
                ? 'bg-brand-pink text-white border-brand-pink shadow-[0_0_15px_rgba(255,0,85,0.35)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={13} className="text-brand-cyan" />
            STUDIO WORKBENCH
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer rounded-none uppercase ${
              activeTab === 'catalog'
                ? 'bg-brand-pink text-white border-brand-pink shadow-[0_0_15px_rgba(255,0,85,0.35)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid size={13} className="text-brand-cyan" />
            EXPLORE BOUTIQUE
          </button>
        </div>

        {/* Cart bag & checkout triggers */}
        <div className="flex items-center gap-4">
          {/* Promo code subtle sticker for professional styling */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/5 rounded-none text-[9px] font-mono text-brand-cyan">
            <Gift size={11} className="animate-pulse text-brand-pink" />
            <span>CODE: <b className="text-white">MADCAP20</b> FOR <span className="text-brand-pink font-bold">20% OFF</span></span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-transparent border border-white/20 hover:border-brand-pink hover:bg-brand-pink/5 rounded-none transition-all font-mono text-xs cursor-pointer text-white"
          >
            <ShoppingBag size={14} className="text-brand-pink" />
            <span>BAG ({cartTotalQuantity})</span>
          </button>
        </div>
      </header>

      {/* Main Dynamic Viewport Frame */}
      <main className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 relative z-10">
        
        {/* VIEW 1: DESIGN STUDIO WORKBENCH */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Shirt canvas layout preview */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center gap-6">
              <ShirtCanvas
                style={studioStyle}
                fabricColor={studioFabricColor}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                onUpdateLayer={handleUpdateLayer}
                onDeleteLayer={handleDeleteLayer}
              />

              {/* Quick direct buy layout picker shown under the canvas for Studio */}
              <div className="w-full max-w-md bg-brand-card/90 border border-white/10 p-6 rounded-none text-center space-y-4 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white/40 font-bold uppercase tracking-widest">REGISTER APPAREL ORIGINS</span>
                  <span className="text-brand-pink font-black text-sm tracking-wider">
                    ${studioStyle === 'hoodie' ? '44.99' : studioStyle === 'longsleeve' ? '32.99' : studioStyle === 'croptop' ? '26.99' : '24.99'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs">
                  <span className="font-mono text-white/55 tracking-wider">REGISTER YOUR SIZE</span>
                  <div className="flex gap-1.5">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as ShirtSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handleAddStudioDesignToCart(sz)}
                        className="px-3 py-1.5 bg-white text-black hover:bg-brand-pink hover:text-white font-mono text-xs font-black transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                      >
                        ADD ({sz})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Custom controls and widgets sidebar */}
            <div className="lg:col-span-12 xl:col-span-7">
              <DesignSidebar
                currentStyle={studioStyle}
                onStyleChange={setStudioStyle}
                currentFabricColorHex={studioFabricColor}
                onFabricColorChange={setStudioFabricColor}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onAddLayer={handleAddLayer}
                onUpdateLayer={handleUpdateLayer}
                onSelectLayer={setSelectedLayerId}
                onClearLayers={handleClearLayers}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: EXPLORE MASTERPIECES CURATED CATALOG */}
        {activeTab === 'catalog' && (
          <CatalogView
            onLoadDesignIntoStudio={handleLoadDesignIntoStudio}
            onAddToCartDirect={handleAddToCartDirect}
          />
        )}

      </main>

      {/* Floating sliding Shopping Cart Drawer overlay */}
      <CartCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
