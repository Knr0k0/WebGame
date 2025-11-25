import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import PracticeLab from './pages/practice-lab';
import DailyRun from './pages/daily-run';
import LexiconBreaker from './pages/lexicon-breaker';
import Leaderboards from './pages/leaderboards';
import GlyphStoryMode from './pages/glyph-story-mode';
import MainMenu from './pages/main-menu/main-menu';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MainMenu />} />
        <Route path="/practice-lab" element={<PracticeLab />} />
        <Route path="/daily-run" element={<DailyRun />} />
        <Route path="/lexicon-breaker" element={<LexiconBreaker />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/glyph-story-mode" element={<GlyphStoryMode />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
