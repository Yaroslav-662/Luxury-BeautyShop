import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

function navClass({ isActive }: { isActive: boolean }) {
  return (
    "text-sm transition-colors " +
    (isActive ? "text-white" : "text-neutral-300 hover:text-white")
  );
}

export default function GuestLayout() {
  const { user, logout } = useAuthStore();
  const { count: cartCount } = useCartStore();


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* TOP INFO BAR (як у PDF: Free shipping...) */}
      <div className="bg-neutral-900/70 border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-2 text-xs text-neutral-200 text-center">
          Free shipping on all orders over $200! For a limited time only.
        </div>
      </div>

      {/* HEADER */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10">
              @
            </span>
            <div className="leading-tight">
              <div className="font-semibold">Luxury BeautyShop</div>
              <div className="text-xs text-neutral-400">Premium cosmetics</div>
            </div>
          </NavLink>

          {/* Search */}
          <form onSubmit={onSubmit} className="flex-1">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full bg-white/5 border border-neutral-800 px-4 py-2 text-sm outline-none focus:border-neutral-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs bg-white/10 hover:bg-white/15 border border-white/10"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right icons / auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist (поки заглушка) */}
            <button
              className="h-10 w-10 rounded-full bg-white/5 border border-neutral-800 hover:bg-white/10 transition"
              title="Wishlist"
              onClick={() => navigate("/favorites")}
            >
              ❤
            </button>

            {/* Cart */}
            <button
              className="relative h-10 w-10 rounded-full bg-white/5 border border-neutral-800 hover:bg-white/10 transition"
              title="Cart"
              onClick={() => navigate("/cart")}
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth area */}
            <div className="ml-2 flex items-center gap-2">
              {user ? (
                <>
                  <span className="hidden md:inline text-xs text-neutral-300 max-w-[220px] truncate">
                    {user.email}
                  </span>

                  <NavLink to="/account" className="text-sm text-neutral-200 hover:text-white">
                    Account
                  </NavLink>

                  {/* Admin link only for admin */}
                  {user.role === "admin" && (
                    <NavLink to="/admin" className="text-sm text-neutral-200 hover:text-white">
                      Admin
                    </NavLink>
                  )}

                  <button
                    onClick={logout}
                    className="text-sm px-3 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/auth/login" className="text-sm text-neutral-200 hover:text-white">
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth/register"
                    className="text-sm px-3 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV (як у PDF: Products / Sale / Inspiration / Brands / Outlet ... ) */}
        <div className="border-t border-neutral-900">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap items-center gap-5">
              <NavLink to="/shop" className={navClass}>
                Products
              </NavLink>
              <NavLink to="/sale" className={navClass}>
                SALE
              </NavLink>
              <NavLink to="/inspiration" className={navClass}>
                Inspiration
              </NavLink>
              <NavLink to="/brands" className={navClass}>
                Brands
              </NavLink>
              <NavLink to="/outlet" className={navClass}>
                Outlet
              </NavLink>

              {/* Reviews публічні за твоїм API */}
              <NavLink to="/reviews" className={navClass}>
                Reviews
              </NavLink>
            </nav>

            <nav className="flex flex-wrap items-center gap-5">
              <NavLink to="/shipping" className={navClass}>
                Shipping
              </NavLink>
              <NavLink to="/returns" className={navClass}>
                Returns & Warranty
              </NavLink>
              <NavLink to="/contact" className={navClass}>
                Contact
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      {/* FOOTER (4 колонки як у PDF) */}
      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="font-semibold">Need help?</div>
            <p className="text-sm text-neutral-400">
              We’re here to help with orders, returns, and product questions.
            </p>
            <NavLink
              to="/contact"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90 text-sm"
            >
              Contact Us
            </NavLink>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Customer Support</div>
            <div className="grid gap-2 text-sm text-neutral-400">
              <NavLink to="/returns" className="hover:text-white">Returns & Warranty</NavLink>
              <NavLink to="/payments" className="hover:text-white">Payments</NavLink>
              <NavLink to="/shipping" className="hover:text-white">Shipping</NavLink>
              <NavLink to="/terms" className="hover:text-white">Terms of Service</NavLink>
              <NavLink to="/privacy" className="hover:text-white">Privacy Policy</NavLink>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Corporate Info</div>
            <div className="grid gap-2 text-sm text-neutral-400">
              <NavLink to="/about" className="hover:text-white">About Us</NavLink>
              <NavLink to="/brands" className="hover:text-white">Brands</NavLink>
              <NavLink to="/affiliates" className="hover:text-white">Affiliates</NavLink>
              <NavLink to="/investors" className="hover:text-white">Investors</NavLink>
              <NavLink to="/cookies" className="hover:text-white">Cookies</NavLink>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Gift Card</div>
            <div className="grid gap-2 text-sm text-neutral-400">
              <NavLink to="/gift-cards" className="hover:text-white">Buy Gift Cards</NavLink>
              <NavLink to="/redeem" className="hover:text-white">Redeem Card</NavLink>
            </div>

            <div className="pt-3 text-xs text-neutral-500">
              © {new Date().getFullYear()} Luxury BeautyShop
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
