/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ShirtStyle = 'unisex' | 'hoodie' | 'longsleeve' | 'croptop';
export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type CanvasLayerType = 'text' | 'sticker' | 'upload';

export interface CanvasLayer {
  id: string;
  type: CanvasLayerType;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  stickerId?: string;
  src?: string; // base64 data for uploads
  x: number; // percentage of canvas width (0-100)
  y: number; // percentage of canvas height (0-100)
  scale: number; // multiplier (e.g. 1.0)
  rotation: number; // degrees
  zIndex: number;
}

export interface FabricColor {
  id: string;
  name: string;
  hex: string;
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  category: 'memes' | 'shapes' | 'eccentric' | 'vintage' | 'illustrations';
}

export interface TeeDesign {
  id: string;
  name: string;
  description: string;
  price: number;
  style: ShirtStyle;
  fabricColor: string; // hex value
  tags: string[];
  layers: CanvasLayer[];
  isPremade: boolean;
  modelImage?: string; // Optional realistic mockup generated or mock
}

export interface CartItem {
  id: string;
  design: TeeDesign;
  size: ShirtSize;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  zipCode: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  date: string;
  status: string;
}
