import React from 'react';

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    // Overlay with a background blur
    <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* Modal container with relative positioning for the close button */}
      <div className="relative max-w-lg w-full m-4">
        
        {/* Close button - positioned outside the children's content box */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 bg-white dark:bg-[#303030] rounded-full p-1 shadow-lg" 
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Children content area */}
        <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}