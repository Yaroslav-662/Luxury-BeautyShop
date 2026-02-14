import Button from "@/shared/ui/Button";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/features/products/model/product.types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.add);

  // ✅ коректне отримання картинки
  const imageSrc = product.images?.[0] ?? "/placeholder-product.png";

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <Link to={`/product/${product._id}`}>
        <img
          src={imageSrc}
          alt={product.name}
          className="h-56 w-full object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-white hover:text-yellow-500">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 text-yellow-500 font-semibold text-xl">
          {product.price} грн
        </div>

        <Button
          className="w-full mt-3"
          disabled={product.stock <= 0}
          onClick={() => addToCart(product)}
        >
          {product.stock > 0 ? "Додати в кошик" : "Немає в наявності"}
        </Button>
      </div>
    </div>
  );
}
