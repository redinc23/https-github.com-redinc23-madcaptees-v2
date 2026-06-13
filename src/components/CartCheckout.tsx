/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem, Order, ShirtSize } from '../types';
import { SHIRT_STYLES } from '../data';
import { X, Trash2, ShoppingBag, CreditCard, Ship, CheckCircle, Ticket, FileText, MapPin } from 'lucide-react';

interface CartCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartCheckout({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartCheckoutProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'receipt'>('cart');
  
  // Checkout Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Standard (4-5 Days)');
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // value in dollars
  const [promoError, setPromoError] = useState<string | null>(null);

  // Completed Order Details state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => acc + item.design.price * item.quantity, 0);
  const shippingCost = shippingMethod.includes('Express') ? 12.99 : subtotal > 50 ? 0 : 5.99;
  const discountAmount = Math.min(subtotal, appliedDiscount);
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.toUpperCase().trim();
    if (code === 'MADCAP20') {
      setAppliedDiscount(subtotal * 0.2); // 20% Off
      setPromoCode('');
    } else if (code === 'DREADCLUB') {
      setAppliedDiscount(10); // $10 off
      setPromoCode('');
    } else {
      setPromoError('INVALID OR EXPIRED CONJURING CODE.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !address || !city || !zipCode) return;

    const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalOrder: Order = {
      id: mockOrderId,
      items: [...cartItems],
      customerName,
      customerEmail,
      address,
      city,
      zipCode,
      shippingMethod,
      subtotal,
      shippingCost,
      total,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'AWAITING DISPATCH'
    };

    setPlacedOrder(finalOrder);
    setStep('receipt');
    onClearCart();
  };

  const handleCloseAndReset = () => {
    setStep('cart');
    setCustomerName('');
    setCustomerEmail('');
    setAddress('');
    setCity('');
    setZipCode('');
    setAppliedDiscount(0);
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Background Mask */}
      <div 
        onClick={handleCloseAndReset}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      {/* Drawer Body Panel */}
      <div className="relative w-full max-w-md bg-brand-card border-l border-white/10 text-white flex flex-col h-full shadow-2xl z-10 transition-all">
        {/* Header bar */}
        <div className="p-5 border-b border-white/10 bg-black/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-pink" />
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
              {step === 'cart' && 'YOUR REBEL BAG'}
              {step === 'checkout' && 'DELIVERY DISPATCH'}
              {step === 'receipt' && 'ORDER REGISTER RECEIPT'}
            </h2>
          </div>
          <button 
            onClick={handleCloseAndReset}
            className="p-1.5 hover:bg-white/5 text-white/50 hover:text-white rounded-none transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: CART OVERVIEW */}
        {step === 'cart' && (
          <div className="flex-1 flex flex-col min-h-0">
            {cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                <ShoppingBag size={48} className="text-white/15 animate-pulse" />
                <h3 className="font-sans font-black tracking-wider text-white/80 text-sm">YOUR BAG IS ENTIRELY EMPTY</h3>
                <p className="text-[10px] text-white/50 font-mono max-w-xs leading-relaxed uppercase">
                  Go to the Studio or Browse Masterpieces to materialize custom designed wearables.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-transparent hover:bg-brand-pink/5 text-white text-[10px] tracking-widest font-mono font-bold rounded-none border border-white/10 hover:border-brand-pink transition-all"
                >
                  CONTINUE CONSULTING
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable list items */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                  {cartItems.map((item) => {
                    const styleMeta = SHIRT_STYLES.find(s => s.id === item.design.style);
                    
                    return (
                      <div 
                        key={item.id}
                        className="flex gap-4 p-4 bg-black/40 border border-white/10 rounded-none relative"
                      >
                        {/* Tiny color preview box */}
                        <div 
                          style={{ backgroundColor: item.design.fabricColor }}
                          className="w-16 h-16 rounded-none flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner"
                        >
                          {/* Render the first emoji inside design as micro badge preview */}
                          <span className="text-2xl filter drop-shadow">
                            {(() => {
                              const stickerLayer = item.design.layers.find(l => l.type === 'sticker');
                              if (stickerLayer && stickerLayer.stickerId) {
                                switch (stickerLayer.stickerId) {
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
                                  default: return '👚';
                                }
                              }
                              return '👚';
                            })()}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-mono text-[11px] font-bold text-white uppercase truncate">
                                {item.design.name}
                              </h4>
                              <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="text-white/40 hover:text-red-400 p-0.5 transition"
                                title="Remove item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            
                            <p className="text-[9px] font-mono text-white/50 mt-1 flex items-center gap-2">
                              <span>BASE: {styleMeta?.name}</span>
                              <span className="text-white/20">|</span>
                              <span>SIZE: {item.size}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3.5">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-2 bg-black border border-white/10 rounded-none p-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-5 h-5 flex items-center justify-center font-bold text-xs text-white hover:text-brand-pink transition-colors rounded-none cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-mono font-black text-brand-pink px-1">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center font-bold text-xs text-white hover:text-brand-pink transition-colors rounded-none cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs font-mono font-bold text-white/90">
                              ${(item.design.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom billing calculations */}
                <div className="p-5 border-t border-white/10 bg-black/60 space-y-4">
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CONJURE PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black border border-white/10 text-xs font-mono rounded-none focus:outline-none focus:border-brand-pink uppercase text-center placeholder-white/20"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-brand-pink/15 border border-brand-pink/30 hover:bg-brand-pink/25 text-white font-mono text-[10px] tracking-widest font-bold rounded-none cursor-pointer transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[9px] font-mono text-red-400 mt-1 uppercase tracking-wider">⚠️ {promoError}</p>
                  )}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[10px] font-mono text-brand-cyan">
                      <span>✓ DISCOUNT APPLIED:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-white/50">
                      <span>BAG SUB-TOTAL:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>ESTIMATED DELIVERY:</span>
                      <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-[8px] text-white/30 italic uppercase">Add ${(50 - subtotal).toFixed(2)} more to unlock free shipping.</p>
                    )}
                    <div className="flex justify-between text-white font-bold border-t border-dashed border-white/10 pt-2.5 text-sm">
                      <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-brand-cyan" /> TOTAL DISPATCH:</span>
                      <span className="text-brand-pink font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-brand-pink hover:bg-brand-pink/90 active:scale-98 text-white font-bold font-mono text-xs rounded-none text-center cursor-pointer transition-all shadow-lg shadow-brand-pink/15 flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    CONTINUE TO DISPATCH INFO
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: DELIVERY INFO FORM */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col min-h-0">
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 text-[9px] font-mono text-white/50 tracking-wider">
                <MapPin size={13} className="text-brand-cyan" />
                <span>SHIPPING & DELIVERY DISPATCH</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">RECIPIENT FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Wile E. Coyote"
                    className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white font-mono rounded-none focus:outline-none focus:border-brand-pink placeholder-white/20 uppercase tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">CONTACT EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="coyote@acme.corp"
                    className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white font-mono rounded-none focus:outline-none focus:border-brand-pink placeholder-white/20 uppercase tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">DESTINATION DELIVERY ADDRESS</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Monument Valley Canyon"
                    className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white font-mono rounded-none focus:outline-none focus:border-brand-pink placeholder-white/20 uppercase tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">CITY</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Outback Castle"
                      className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white font-mono rounded-none focus:outline-none focus:border-brand-pink placeholder-white/20 uppercase tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">ZIP CODE</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="89012"
                      className="w-full px-3.5 py-2.5 bg-black border border-white/10 text-white font-mono rounded-none focus:outline-none focus:border-brand-pink placeholder-white/20 uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">SPEED OF FREIGHT DISPATCH</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('Standard (4-5 Days)')}
                      className={`p-3 rounded-none border text-left cursor-pointer transition-all ${
                        shippingMethod.includes('Standard')
                          ? 'border-brand-pink bg-brand-pink/5 shadow-[0_0_10px_rgba(255,0,85,0.15)]'
                          : 'border-white/10 bg-black/45'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">STANDARD SHIPPING</div>
                      <div className="text-[9px] text-white/40 font-mono mt-0.5 uppercase">4-5 Delivery Days</div>
                      <div className="text-[9px] font-mono text-brand-cyan mt-2 font-black">{subtotal > 50 ? 'FREE' : '$5.99'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMethod('Express (1-2 Days)')}
                      className={`p-3 rounded-none border text-left cursor-pointer transition-all ${
                        shippingMethod.includes('Express')
                          ? 'border-brand-pink bg-brand-pink/5 shadow-[0_0_10px_rgba(255,0,85,0.15)]'
                          : 'border-white/10 bg-black/45'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">COSMIC EXPRESS</div>
                      <div className="text-[9px] text-white/40 font-mono mt-0.5 uppercase">1-2 Delivery Days</div>
                      <div className="text-[9px] font-mono text-brand-cyan mt-2 font-black">$12.99</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Billing check and submit */}
            <div className="p-5 border-t border-white/10 bg-black/60 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-white/40">
                  <span>CART SUB-TOTAL:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-brand-cyan text-[10px]">
                    <span>PROMO CODE DISCOUNT:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/40">
                  <span>FREIGHT RATE:</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-dashed border-white/10 pt-2.5 text-sm">
                  <span>TOTAL ESTIMATION:</span>
                  <span className="text-brand-pink font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="py-2.5 bg-transparent hover:bg-white/5 border border-white/10 text-white font-mono text-[10px] tracking-widest font-black rounded-none cursor-pointer uppercase transition-colors"
                >
                  GO BACK
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-brand-pink hover:bg-brand-pink/95 text-white font-bold font-mono text-[10px] tracking-widest rounded-none flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98 uppercase shadow-lg shadow-brand-pink/15"
                >
                  <Ship size={12} className="text-brand-cyan" /> SECURE DISPATCH
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: HIGH-QUALITY RETRO RECEIPT */}
        {step === 'receipt' && placedOrder && (
          <div className="flex-1 flex flex-col min-h-0 bg-black/90 p-5 overflow-y-auto">
            <div className="bg-white text-black font-mono p-5 rounded-none border border-zinc-300 shadow-xl select-all space-y-4 relative overflow-hidden">
              {/* Retro design details */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan" />
              
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-black">
                <h3 className="text-sm font-black tracking-widest uppercase">MADCAP TEES INC.</h3>
                <p className="text-[9px]">ECCENTRIC APPAREL REGISTER #404</p>
                <p className="text-[8px] text-zinc-500">{placedOrder.date}</p>
                <p className="text-[10px] font-black text-zinc-900 bg-zinc-100 py-1 tracking-widest mt-2">
                  ORDER: {placedOrder.id}
                </p>
              </div>

              {/* Items Table */}
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between font-black border-b border-black pb-1">
                  <span>ITEM / DETAILS</span>
                  <span>QTY</span>
                  <span>PRICE</span>
                </div>

                {placedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start space-y-1">
                    <div className="max-w-[70%]">
                      <span className="font-bold">{item.design.name.toUpperCase()}</span>
                      <p className="text-[8px] text-zinc-500 font-mono">
                        SIZE: {item.size} | BASE: {item.design.style.toUpperCase()}
                      </p>
                    </div>
                    <span>{item.quantity}</span>
                    <span>${(item.design.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Payment calculations */}
              <div className="border-t border-dashed border-black pt-3 space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span>SUB-TOTAL:</span>
                  <span>${placedOrder.subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-zinc-650">
                    <span>DISCOUNT Applied:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>FREIGHT SPEED RATE:</span>
                  <span>{placedOrder.shippingCost === 0 ? 'FREE' : `$${placedOrder.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-black text-[12px] border-t border-black pt-1.5">
                  <span>FINAL TOTAL:</span>
                  <span>${placedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery stamp info */}
              <div className="border-t border-black pt-3 text-[9px] space-y-1 font-mono bg-zinc-50 p-2.5 rounded-none border border-zinc-200">
                <div className="font-black flex items-center gap-1 text-zinc-800 uppercase">
                  <CheckCircle size={10} className="text-emerald-600" /> STATUS: {placedOrder.status}
                </div>
                <div className="text-zinc-600">DELIVER TO: {placedOrder.customerName}</div>
                <div className="text-zinc-500 overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                  ADDRESS: {placedOrder.address}, {placedOrder.city}, {placedOrder.zipCode}
                </div>
                <div className="text-zinc-500">SHIPPING: {placedOrder.shippingMethod}</div>
              </div>

              {/* Stamp of authenticity */}
              <div className="text-center pt-2 text-[8px] text-zinc-500">
                <p>THANK YOU FOR SUPPORTING MADNESS.</p>
                <p className="tracking-widest font-bold mt-1 text-black">★★★ WWW.MADCAPTEES.COM ★★★</p>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full py-3 bg-brand-pink hover:bg-brand-pink/90 text-white font-bold font-mono text-xs rounded-none mt-4 text-center cursor-pointer uppercase tracking-widest shadow-lg shadow-brand-pink/20"
            >
              SUCCESSFULLY DISMISSED
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
