import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { SidebarRight } from './components/layout/SidebarRight';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { FeedView } from './components/feed/FeedView';
import { ProfileView } from './components/profile/ProfileView';
import { CommunitiesHub } from './components/communities/CommunitiesHub';
import { FriendsView } from './components/friends/FriendsView';
import { PhotosView } from './components/photos/PhotosView';
import { VibeEncontrosView } from './components/dating/VibeEncontrosView';
import { ArcadeHub } from './components/arcade/ArcadeHub';
import { DiscoverView } from './components/discover/DiscoverView';
import { AppsHub } from './components/apps/AppsHub';
import { ReelsView } from './components/video/ReelsView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { ChatView } from './components/chat/ChatView';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModals } from './components/modals/AuthModals';
import { GoogleAuthModal } from './components/modals/GoogleAuthModal';
import { AllModals } from './components/modals/AllModals';
import { ModerationPanel } from './components/moderation/ModerationPanel';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { RealtimeNotificationAlert } from './components/notifications/RealtimeNotificationAlert';
import { Sparkles, CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    activeTab, 
    toast,
    activeLiveAlerts,
    dismissLiveAlert,
    handleNotificationClick
  } = useApp();

  // If user is not authenticated and is visiting public/landing mode
  if (!isAuthenticated && activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 w-full max-w-full overflow-x-hidden m-0 p-0">
        <LandingPage />
        <AuthModals />
        <GoogleAuthModal />
        <AllModals />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased w-full max-w-full overflow-x-hidden m-0 p-0 font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Content Layout Container (Classic Orkut Centered 3-Column Width) */}
      <div className="flex-1 max-w-[1240px] w-full mx-auto px-2 sm:px-3 py-2 sm:py-3 overflow-x-hidden">
        <div className="flex items-start gap-2.5 sm:gap-3.5 justify-center w-full max-w-full min-w-0">
          
          {/* Left Navigation Sidebar */}
          <SidebarLeft />

          {/* Center Main Dynamic View Area */}
          <main className="flex-1 min-w-0 w-full max-w-full pb-20 lg:pb-6">
            {activeTab === 'home' && <FeedView />}
            {activeTab === 'feed' && <FeedView />}
            {activeTab === 'videos' && <ReelsView />}
            {activeTab === 'apps' && <AppsHub />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'communities' && <CommunitiesHub />}
            {activeTab === 'friends' && <FriendsView />}
            {activeTab === 'photos' && <PhotosView />}
            {activeTab === 'encontros' && <VibeEncontrosView />}
            {activeTab === 'arcade' && <ArcadeHub />}
            {activeTab === 'discover' && <DiscoverView />}
            {activeTab === 'achievements' && <ProfileView />}
            {activeTab === 'help' && <CommunitiesHub />}
            {activeTab === 'marketplace' && <MarketplaceView />}
            {activeTab === 'chat' && <ChatView />}
            {(activeTab === 'admin' || (activeTab as string) === 'moderation') && <ModerationPanel />}
          </main>

          {/* Right Interactive Widgets Sidebar */}
          <SidebarRight />

        </div>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* 3.1 PWA Install Prompt Banner */}
      <PWAInstallBanner />

      {/* 4. Global Modals & Dialogs */}
      <AuthModals />
      <GoogleAuthModal />
      <AllModals />

      {/* 4.1 Real-Time Live Notification Alerts (Floating cards with actions & avatar) */}
      <RealtimeNotificationAlert
        alerts={activeLiveAlerts}
        onDismiss={dismissLiveAlert}
        onActionClick={handleNotificationClick}
      />

      {/* 5. Animated Toast System */}
      {toast && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-bold backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-900/90 text-white border-emerald-500/40' :
            toast.type === 'error' ? 'bg-red-900/90 text-white border-red-500/40' :
            toast.type === 'vibe' ? 'bg-gradient-to-r from-purple-900 via-pink-900 to-amber-900 text-white border-pink-400/40 shadow-pink-500/20' :
            'bg-slate-900/90 text-white border-slate-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'vibe' && <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  React.useEffect(() => {
    console.log('[DIAGNÓSTICO] App montado no DOM (componente raiz)');
  }, []);

  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
