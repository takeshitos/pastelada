'use client';

import { useToast } from '../ui/Toast';

export interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  className?: string;
}

export default function BaseLayout({ 
  children, 
  title, 
  showNavigation = false,
  className = '' 
}: BaseLayoutProps) {
  const { ToastContainer } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      {showNavigation && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema Pastelada
                </h1>
              </div>
              
              {/* Mobile menu button - will be implemented later */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  aria-label="Menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Page Title */}
      {title && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
        {children}
      </main>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}