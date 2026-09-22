'use client';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export type CartItem={variantId:string;productId?:string;slug:string;name:string;variantName:string;sku:string;price:number;quantity:number;stock:number;imageUrl?:string;tone?:string;kind?:string};
type CartState={items:CartItem[];add:(item:CartItem)=>void;remove:(variantId:string)=>void;setQty:(variantId:string,qty:number)=>void;clear:()=>void};
export const useCart=create<CartState>()(persist((set)=>({
  items:[],
  add:(item)=>set(s=>{const old=s.items.find(x=>x.variantId===item.variantId);if(old)return {items:s.items.map(x=>x.variantId===item.variantId?{...x,quantity:Math.min(item.stock,x.quantity+item.quantity),stock:item.stock,price:item.price}:x)};return {items:[...s.items,{...item,quantity:Math.min(item.quantity,item.stock)}]}}),
  remove:(variantId)=>set(s=>({items:s.items.filter(x=>x.variantId!==variantId)})),
  setQty:(variantId,qty)=>set(s=>({items:s.items.map(x=>x.variantId===variantId?{...x,quantity:Math.max(1,Math.min(qty,x.stock))}:x)})),
  clear:()=>set({items:[]})
}),{name:'madstore2-cart-v1'}));
export const cartSubtotal=(items:CartItem[])=>items.reduce((sum,x)=>sum+x.price*x.quantity,0);
