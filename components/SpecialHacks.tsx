
import React, { useState, useEffect, useRef } from 'react';
import { DiamondIcon, CubeIcon } from './Icons';

interface SpecialHacksProps {
  title: string;
  currency: string;
}

const SpecialHacks: React.FC<SpecialHacksProps> = ({ title, currency }) => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('10000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLog]);

  const handleGenerate = () => {
    if (!username || !amount || isGenerating) return;

    setIsGenerating(true);
    setConsoleLog([]);

    const log = (message: string, delay: number) => 
      new Promise(resolve => setTimeout(() => {
        setConsoleLog(prev => [...prev, message]);
        resolve(true);
      }, delay));

    const runScript = async () => {
      await log(`[INFO] Initializing injection sequence for ${currency}...`, 500);
      await log(`[AUTH] Authenticating with game servers...`, 1000);
      await log(`[SUCCESS] Connection established.`, 800);
      await log(`[TARGET] User found: ${username}`, 1200);
      await log(`[INFO] Preparing to inject ${parseInt(amount).toLocaleString()} ${currency}.`, 500);
      await log(`[WARN] Bypassing anti-cheat protocols...`, 1500);
      await log(`[... ] This might take a moment.`, 500);
      await log(`[SUCCESS] Security bypassed.`, 2000);
      await log(`[INJECT] Writing ${currency} to user account...`, 1000);
      await log(`[DONE] Injection complete!`, 1500);
      await log(`[VERIFY] Verification required to prevent abuse.`, 1000);
      await log(`[INFO] Please restart your game to see the changes.`, 500);
      setIsGenerating(false);
    };

    runScript();
  };

  return (
    <div className="flex flex-col h-full text-gray-200">
      <div className="text-center mb-4">
        {currency === 'Robux' ? <CubeIcon className="w-12 h-12 mx-auto text-green-400"/> : <DiamondIcon className="w-12 h-12 mx-auto text-green-400"/>}
        <h3 className="text-xl font-bold text-green-400 mt-2">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-400 block mb-1">Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your game username"
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            disabled={isGenerating}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-400 block mb-1">Amount of {currency}</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            disabled={isGenerating}
          />
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={isGenerating || !username || !amount}
          className="w-full py-3 bg-green-600 rounded-md font-bold hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'Generating...' : `Generate ${currency}`}
        </button>
      </div>

      {consoleLog.length > 0 && (
        <div className="mt-4 flex-grow bg-black p-2 rounded-md font-mono text-xs overflow-y-auto flex flex-col">
            <div className="flex-grow">
                {consoleLog.map((line, index) => (
                  <p key={index} className={`${line.startsWith('[SUCCESS]') || line.startsWith('[DONE]') ? 'text-green-400' : line.startsWith('[WARN]') ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {`> ${line}`}
                  </p>
                ))}
                <div ref={consoleEndRef} />
            </div>
        </div>
      )}
    </div>
  );
};

export default SpecialHacks;
