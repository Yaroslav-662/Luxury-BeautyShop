// src/widgets/Navbar/Navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";

export default function Navbar() {
  const cartCount = useCartStore((s) => s.count);
  const favCount = useFavoritesStore((s) => s.count);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  }

  return (
    <header className="w-full bg-black/80 backdrop-blur-lg border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-yellow-500 shrink-0">
          BEAUTY LUXE
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-300 font-medium">
          <Link className="hover:text-yellow-400 transition-colors" to="/shop">Магазин</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/shop?q=sale">Sale</Link>
          <Link className="hover:text-yellow-400 transition-colors" to="/shop?q=new">Новинки</Link>
        </nav>

        {/* Search bar — desktop */}
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <input
              autoFocus
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-1.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="Пошук товарів..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onBlur={() => { if (!searchQ) setSearchOpen(false); }}
            />
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex text-gray-400 hover:text-yellow-400 transition-colors"
            title="Пошук"
          >
            🔍
          </button>
        )}

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition-colors"
          >
            🔍
          </button>

          {/* Favorites */}
          <Link to="/favorites" className="relative text-gray-300 hover:text-yellow-400 transition-colors" title="Обрані">
            <span className="text-lg">♡</span>
            {favCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-300 hover:text-yellow-400 transition-colors" title="Кошик">
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <input
              autoFocus
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="Пошук товарів..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
}
