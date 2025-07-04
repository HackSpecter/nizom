import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-8 max-w-md w-full mx-4 relative animate-modal-enter">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-2xl"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center relative z-10">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Ташаккур!
          </h3>
          
          <p className="text-gray-300 text-lg leading-relaxed">
            Мо дар наздиктарин вақт бо шумо дар тамос мешавем!
          </p>
          
          <button
            onClick={onClose}
            className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Хуб
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;