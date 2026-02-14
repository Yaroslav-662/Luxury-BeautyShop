import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import CartMini from "../CartMini/CartMini";

export default function Navbar() {
  return (
    <header className="w-full bg-black/70 backdrop-blur-lg border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          BEAUTY LUXE
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-gray-300 font-medium">
          <Link className="hover:text-yellow-500" to="/shop">
            Магазин
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CartMini />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
