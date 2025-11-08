
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ValueScanner from './ValueScanner';
import SpecialHacks from './SpecialHacks';
import { CloseIcon, CubeIcon, DiamondIcon, TargetIcon } from './Icons';

type Tab = 'scanner' | 'roblox' | 'freefire';

interface FloatingWindowProps {
  onClose: () => void;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState<{ x: number, y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('scanner');

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centeredX = window.innerWidth / 2 - (windowRef.current?.offsetWidth ?? 400) / 2;
    const centeredY = window.innerHeight / 2 - (windowRef.current?.offsetHeight ?? 600) / 2;
    setPosition({ x: centeredX, y: centeredY });
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return; // prevent drag on buttons
    if (windowRef.current) {
      const pos = windowRef.current.getBoundingClientRect();
      setIsDragging(true);
      setRel({
        x: e.pageX - pos.left,
        y: e.pageY - pos.top,
      });
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && rel && windowRef.current) {
      setPosition({
        x: e.pageX - rel.x,
        y: e.pageY - rel.y
      });
      e.stopPropagation();
      e.preventDefault();
    }
  }, [isDragging, rel]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const renderContent = () => {
    switch(activeTab) {
      case 'scanner':
        return <ValueScanner />;
      case 'roblox':
        return <SpecialHacks title="Roblox Robux Generator" currency="Robux" />;
      case 'freefire':
        return <SpecialHacks title="Free Fire Diamond Injector" currency="Diamonds" />;
      default:
        return null;
    }
  };
  
  const TabButton = ({ tabId, icon, label }: {tabId: Tab, icon: React.ReactNode, label: string}) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors duration-200 ${
        activeTab === tabId
          ? 'bg-green-500 text-black'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div
      ref={windowRef}
      className="fixed w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gray-900/80 backdrop-blur-md border border-green-500/50 rounded-lg shadow-2xl shadow-green-500/10 flex flex-col overflow-hidden"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <header
        onMouseDown={onMouseDown}
        className="bg-gray-900 text-green-400 p-2 flex justify-between items-center cursor-move border-b border-green-500/50"
      >
        <h2 className="font-mono text-sm font-bold">GH-X PRO v9.1</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-red-500/50 transition-colors">
          <CloseIcon className="w-4 h-4" />
        </button>
      </header>
      
      <nav className="flex w-full border-b border-green-500/50">
        <TabButton tabId="scanner" icon={<TargetIcon className="w-4 h-4"/>} label="Scanner" />
        <TabButton tabId="roblox" icon={<CubeIcon className="w-4 h-4"/>} label="Roblox" />
        <TabButton tabId="freefire" icon={<DiamondIcon className="w-4 h-4"/>} label="Free Fire" />
      </nav>

      <main className="flex-grow p-4 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default FloatingWindow;
