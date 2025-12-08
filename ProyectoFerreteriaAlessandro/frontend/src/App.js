import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Productos } from './components/Productos';
import { Reportes } from './components/Reportes';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('home');
  };

  const handleProfileClick = () => {
    // TODO: Implementar vista de perfil
    alert('Perfil de usuario - Funcionalidad pendiente');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard />;
      case 'nueva-venta':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Nueva Venta</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'devoluciones':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Devoluciones</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'cierre-caja':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Cierre de Caja</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'productos':
        return <Productos user={user} />;
      case 'registro-compras':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Registro de Compras</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'alertas-stock':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Alertas de Stock</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'reportes':
        return <Reportes user={user} />;
      case 'usuarios':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      case 'configuracion':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Configuración</h1>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onLogout={handleLogout}
          onMenuClick={toggleSidebar}
          onProfileClick={handleProfileClick}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
