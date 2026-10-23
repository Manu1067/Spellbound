import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import AcademyLayout from "./layouts/AcademyLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ExplorePage from "./pages/Explore/ExplorePage";
import PeoplePage from "./pages/People/PeoplePage";
import SportsPage from "./pages/Sports/SportsPage";
import AcademicsPage from "./pages/Academics/AcademicsPage";
import CommonRoomPage from "./pages/CommonRoom/CommonRoomPage";
import HousesEventsPage from "./pages/HousesEvents/HousesEventsPage";
import MysteriesPage from "./pages/Mysteries/MysteriesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Full cinematic entrance) */}
        <Route path="/" element={<LandingPage />} />

        {/* Academy Application Shell (Sidebar + Topbar + Content) */}
        <Route element={<AcademyLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/common-room" element={<CommonRoomPage />} />
          <Route path="/houses-events" element={<HousesEventsPage />} />
          <Route path="/mysteries" element={<MysteriesPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
