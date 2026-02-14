// src/features/cart/model/cart.types.ts

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string; // обов'язкове
  sku?: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  currency: "USD" | "EUR" | "UAH";

  addToCart: (product: CartProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
}
