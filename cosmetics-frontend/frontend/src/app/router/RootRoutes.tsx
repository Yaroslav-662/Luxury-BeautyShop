// src/app/router/RootRoutes.tsx
import { Routes } from "react-router-dom";
import { GuestRoutes } from "./GuestRoutes";
import { UserRoutes } from "./UserRoutes";
import { AdminRoutes } from "./AdminRoutes";

export default function RootRoutes() {
  return (
    <Routes>
      {GuestRoutes}
      {UserRoutes}
      {AdminRoutes}
    </Routes>
  );
}
