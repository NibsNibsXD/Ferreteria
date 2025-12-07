import React from 'react';
import { LogOut, Menu, User, UserCog, ChevronDown } from 'lucide-react';

export function Header({ user, onLogout, onMenuClick, onProfileClick }) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[#0f4c81] hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg text-[#0f4c81] font-semibold">Ferretería Alessandro</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 border border-[#0f4c81]/20 hover:bg-[#f7fafc] py-2 px-4 rounded-md transition-colors"
          >
            <div className="bg-[#0f4c81] text-white rounded-full p-2">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#0f4c81] text-sm font-medium">{user.nombre}</span>
              <span className="text-xs text-gray-500">{user.rol?.nombre || user.rol}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium">Mi Cuenta</p>
                </div>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-900">{user.correo}</span>
                    <span className="text-xs text-gray-500">Rol: {user.rol?.nombre || user.rol}</span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onProfileClick();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
