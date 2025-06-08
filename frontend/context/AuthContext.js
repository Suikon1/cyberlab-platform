import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import MachineCard from '../components/MachineCard/MachineCard';
import FilterBar from '../components/FilterBar/FilterBar';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import LoginModal from '../components/LoginModal/LoginModal';

// Main App Content Component
function AppContent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/machines');
      const data = await response.json();
      setMachines(data);
      setFilteredMachines(data);
    } catch (error) {
      console.error('Error loading machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    setShowLogin(false);
  };

  const handleOpenAdmin = () => {
    if (isAuthenticated && isAdmin) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-cyan-400">Cargando máquinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header 
        totalMachines={machines.length}
        onOpenAdmin={handleOpenAdmin}
        onOpenLogin={() => setShowLogin(true)}
        isAdmin={isAdmin}
        adminUser={user}
        onLogout={handleLogout}
      />
      
      <FilterBar 
        machines={machines} 
        onFilter={setFilteredMachines} 
      />
      
      <main className="max-w-7xl mx-auto px-6 py-6">
        {filteredMachines.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron máquinas</h3>
            <p className="text-cyan-300/60">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        isAdmin={isAdmin}
      />
    </div>
  );
}

// Main App Component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}