import { useCartStore } from "@/store/cart.store";
import { Link } from "react-router-dom";

export default function CartMini() {
  const count = useCartStore((s) => s.count);

  return (
    <Link to="/cart" className="relative">
      <div className="text-2xl text-yellow-500">🛒</div>
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs px-1">
          {count}
        </span>
      )}
    </Link>
  );
}
