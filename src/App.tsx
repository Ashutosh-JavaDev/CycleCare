import { AppProvider, useApp } from './store/AppContext';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Login, Signup } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Symptoms } from './pages/Symptoms';
import { CycleCalendar } from './pages/CycleCalendar';
import { Education } from './pages/Education';
import { AIAssistant } from './pages/AIAssistant';
import { Forum } from './pages/Forum';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/Admin';
import { MedicineGuide } from './pages/MedicineGuide';
import { ReliefFoods } from './pages/ReliefFoods';
import { Hospitals } from './pages/Hospitals';
import { SettingsPage } from './pages/Settings';
import { PrivacyPage } from './pages/Privacy';
import { HelpPage } from './pages/Help';
import "./index.css";
function AppShell() {
  const { currentPage, isLoggedIn } = useApp();

  const publicPage = currentPage === 'landing'
    ? <Landing />
    : currentPage === 'signup'
      ? <Signup />
      : <Login />;

  const appPage = (() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <Tracker />;
      case 'symptoms':
        return <Symptoms />;
      case 'calendar':
        return <CycleCalendar />;
      case 'education':
        return <Education />;
      case 'ai':
        return <AIAssistant />;
      case 'forum':
        return <Forum />;
      case 'profile':
        return <Profile />;
      case 'medicines':
        return <MedicineGuide />;
      case 'foods':
        return <ReliefFoods />;
      case 'hospitals':
        return <Hospitals />;
      case 'settings':
        return <SettingsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'help':
        return <HelpPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  })();

  return (
    <div className="min-h-screen bg-mesh text-ink-700 dark:bg-mesh-dark dark:text-ink-50 theme-transition">
      {!isLoggedIn ? (
        publicPage
      ) : (
        <div className="min-h-screen">
          <Sidebar />
          <main className="pt-16 lg:pt-0 lg:ml-64">{appPage}</main>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
