import React from 'react';
import { DollarSign, Instagram, Coins } from 'lucide-react';

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dollar bills */}
      <div className="absolute top-20 left-10 animate-bounce-slow">
        <DollarSign className="w-8 h-8 text-yellow-400 opacity-20" />
      </div>
      <div className="absolute top-40 right-20 animate-float-1">
        <DollarSign className="w-6 h-6 text-yellow-400 opacity-30" />
      </div>
      <div className="absolute bottom-32 left-16 animate-float-2">
        <DollarSign className="w-10 h-10 text-yellow-400 opacity-15" />
      </div>
      
      {/* Coins */}
      <div className="absolute top-60 right-10 animate-spin-slow">
        <Coins className="w-12 h-12 text-yellow-400 opacity-25" />
      </div>
      <div className="absolute bottom-20 right-32 animate-bounce-slow">
        <Coins className="w-8 h-8 text-yellow-400 opacity-20" />
      </div>
      
      {/* Instagram elements */}
      <div className="absolute top-32 right-40 animate-float-1">
        <Instagram className="w-14 h-14 text-yellow-400 opacity-10" />
      </div>
      <div className="absolute bottom-40 left-32 animate-float-2">
        <Instagram className="w-10 h-10 text-yellow-400 opacity-15" />
      </div>
      
      {/* Additional floating elements */}
      <div className="absolute top-24 left-1/3 animate-pulse-slow">
        <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-20"></div>
      </div>
      <div className="absolute bottom-60 right-1/4 animate-pulse-slow">
        <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-15"></div>
      </div>
    </div>
  );
};

export default FloatingElements;