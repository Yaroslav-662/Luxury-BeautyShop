// src/app/router/GuestRoutes.tsx
import { Route } from "react-router-dom";
import GuestLayout from "@/app/layouts/GuestLayout";

import HomePage from "@/pages/Home/HomePage";
import ShopPage from "@/pages/Shop/ShopPage";
import ProductPage from "@/pages/Product/ProductPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import NotFound from "@/pages/NotFound/NotFound";

import SalePage from "@/pages/Sale/SalePage";
import OutletPage from "@/pages/Outlet/OutletPage";
import BrandsPage from "@/pages/Brands/BrandsPage";
import InspirationPage from "@/pages/Inspiration/InspirationPage";
import FavoritesPage from "@/pages/Favorites/FavoritesPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";

import ShippingPage from "@/pages/Info/ShippingPage";
import ReturnsPage from "@/pages/Info/ReturnsPage";
import PaymentsPage from "@/pages/Info/PaymentsPage";
import TermsPage from "@/pages/Info/TermsPage";
import PrivacyPage from "@/pages/Info/PrivacyPage";
import CookiesPage from "@/pages/Info/CookiesPage";
import AboutPage from "@/pages/Info/AboutPage";
import ContactPage from "@/pages/Info/ContactPage";
import GiftCardsPage from "@/pages/Info/GiftCardsPage";
import RedeemPage from "@/pages/Info/RedeemPage";
import AffiliatesPage from "@/pages/Info/AffiliatesPage";
import InvestorsPage from "@/pages/Info/InvestorsPage";
import VerifyEmailPage from "@/pages/Auth/VerifyEmailPage";
import ProductDetailsPage from "@/pages/Product/ProductDetailsPage";
// ✅ named export
import { ReviewsPage } from "@/features/reviews/pages/ReviewsPage";

export const GuestRoutes = (
  <Route element={<GuestLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/reviews" element={<ReviewsPage />} />

    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/reviews" element={<ReviewsPage />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/sale" element={<SalePage />} />
    <Route path="/outlet" element={<OutletPage />} />
    <Route path="/brands" element={<BrandsPage />} />
    <Route path="/inspiration" element={<InspirationPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />

    <Route path="/shipping" element={<ShippingPage />} />
    <Route path="/returns" element={<ReturnsPage />} />
    <Route path="/payments" element={<PaymentsPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/cookies" element={<CookiesPage />} />
    <Route path="/auth/verify/:token" element={<VerifyEmailPage />} />
    <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
    <Route path="/auth/reset/:token" element={<ResetPasswordPage />} />

    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/gift-cards" element={<GiftCardsPage />} />
    <Route path="/redeem" element={<RedeemPage />} />
    <Route path="/affiliates" element={<AffiliatesPage />} />
    <Route path="/investors" element={<InvestorsPage />} />
    <Route path="/investors" element={<ProductDetailsPage />} />
  </Route>
);

