import React from 'react';
import {
  Home,
  ShoppingCart,
  RotateCcw,
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  Wrench,
} from 'lucide-react';

const navItems = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
  },
  {
    id: 'nueva-venta',
    label: 'Nueva Venta',
    icon: ShoppingCart,
    section: 'Ventas',
    requiredPermission: 'nueva-venta',
  },
  {
    id: 'devoluciones',
    label: 'Devoluciones',
    icon: RotateCcw,
    section: 'Ventas',
    requiredPermission: 'devoluciones',
  },
  {
    id: 'cierre-caja',
    label: 'Cierre de Caja',
    icon: DollarSign,
    section: 'Ventas',
    requiredPermission: 'cierre-caja',
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: Package,
    section: 'Inventario',
    requiredPermission: 'productos',
  },
  {
    id: 'registro-compras',
    label: 'Registro de Compras',
    icon: ShoppingBag,
    section: 'Inventario',
    requiredPermission: 'registro-compras',
  },
  {
    id: 'alertas-stock',
    label: 'Alertas de Stock',
    icon: AlertTriangle,
    section: 'Inventario',
    requiredPermission: 'alertas-stock',
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: BarChart3,
    section: 'Administración',
    requiredPermission: 'reportes',
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    section: 'Administración',
    requiredPermission: 'usuarios',
  },
];

export function Sidebar({ user, currentView, onViewChange, isOpen }) {
  // Obtener permisos del usuario
  const userPermissions = user?.rol?.permisos || [];
  
  const filteredItems = navItems.filter((item) => {
    // Dashboard siempre visible
    if (item.id === 'home') {
      return true;
    }
    
    // Si el item requiere un permiso específico, verificar que el usuario lo tenga
    if (item.requiredPermission) {
      return userPermissions.includes(item.requiredPermission);
    }
    
    // Si no requiere permiso específico, mostrarlo
    return true;
  });

  let lastSection = '';

  return (
    <aside
      className={`bg-[#0f4c81] border-r border-[#0a3a61] transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden flex-shrink-0`}
    >
      <div className="p-4 border-b border-[#0a3a61]">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg flex-shrink-0">
            <Wrench className="w-6 h-6 text-[#0f4c81]" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <h1 className="truncate text-white font-semibold">
                Ferretería Alessandro
              </h1>
              <p className="text-sm text-gray-300 truncate">
                {user.rol?.nombre || user.rol}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const showSectionLabel =
            item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.id}>
              {showSectionLabel && isOpen && (
                <div className="text-xs text-gray-300 mt-4 mb-2 px-3 font-medium uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-white text-[#0f4c81] shadow-sm'
                    : 'text-white hover:bg-[#0a3a61]'
                } ${!isOpen && 'justify-center'}`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
