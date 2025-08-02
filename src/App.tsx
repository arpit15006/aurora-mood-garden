
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import Index from "./pages/Index";
import MoodGarden from "./pages/MoodGarden";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold aurora-text">Welcome to Aurora</h1>
      <p className="text-gray-300">Your AI Wellness Companion</p>
      <div className="space-x-4">
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-aurora-electric-blue text-white rounded-lg hover:bg-aurora-cyan transition-colors">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-6 py-3 border border-aurora-purple text-aurora-purple rounded-lg hover:bg-aurora-purple hover:text-white transition-colors">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <SignedIn>
        <Index />
      </SignedIn>
    } />
    <Route path="/mood-garden" element={
      <SignedIn>
        <MoodGarden />
      </SignedIn>
    } />
    <Route path="/onboarding" element={
      <SignedIn>
        <Onboarding />
      </SignedIn>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SignedOut>
          <AuthPage />
        </SignedOut>
        <SignedIn>
          <AppRoutes />
        </SignedIn>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
