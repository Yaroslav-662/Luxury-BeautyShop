// src/features/cart/ui/CartItem.tsx
import React from "react";
import { CartItem as CartItemType } from "../model/cart.types";
import { useCartStore } from "../model/cart.store";
import Button from "@/shared/ui/Button";

interface Props {
  item: CartItemType;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const increment = () => updateQuantity(item.id, item.quantity + 1);
  const decrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 px-4">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-400">
          {item.price} ₴ × {item.quantity} = {item.subtotal} ₴
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={decrement} size="sm">-</Button>
        <span>{item.quantity}</span>
        <Button onClick={increment} size="sm">+</Button>
        <Button onClick={() => removeFromCart(item.id)} size="sm" variant="danger">
          Видалити
        </Button>
      </div>
    </div>
  );
};
