import React from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, PenTool, History, DollarSign } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out
          ${isActive 
            ? 'text-indigo-600 bg-indigo-50' 
            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
          }`}
      >
        <Icon className={`w-5 h-5 mr-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Loom Diary</span>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" icon={Home}>Home</NavLink>
                  <NavLink to="entry" icon={PenTool}>Entry</NavLink>
                  <NavLink to="history" icon={History}>History</NavLink>
                  <NavLink to="karja" icon={DollarSign}>Karja</NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;