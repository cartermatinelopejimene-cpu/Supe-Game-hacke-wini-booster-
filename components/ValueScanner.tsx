
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, SaveIcon } from './Icons';

interface ScanResult {
  id: number;
  address: string;
  value: number;
}

const ValueEditor: React.FC<{ result: ScanResult; onSave: (id: number, newValue: number) => void, onFreeze: (id: number) => void, isFrozen: boolean }> = ({ result, onSave, onFreeze, isFrozen }) => {
  const [newValue, setNewValue] = useState(result.value.toString());
  const [message, setMessage] = useState('');

  const handleSave = () => {
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      onSave(result.id, numValue);
      setMessage('Value modified in memory!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-800 border border-green-500/50 rounded-md">
      <p className="text-xs text-gray-400 font-mono">Address: {result.address}</p>
      <div className="flex items-center gap-2 mt-2">
        <input 
          type="text" 
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-grow bg-gray-900 border border-gray-600 rounded p-1 font-mono text-green-400 focus:ring-green-500 focus:border-green-500"
        />
        <button onClick={handleSave} className="p-2 bg-green-600 rounded hover:bg-green-500"><SaveIcon className="w-5 h-5"/></button>
        <button onClick={() => onFreeze(result.id)} className={`p-2 rounded ${isFrozen ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-400`}>
          Freeze
        </button>
      </div>
      {message && <p className="text-green-400 text-xs mt-2">{message}</p>}
    </div>
  );
};

const ValueScanner: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [frozenValues, setFrozenValues] = useState<Set<number>>(new Set());

  const handleScan = () => {
    setIsScanning(true);
    setScanResults([]);
    setSelectedResultId(null);

    setTimeout(() => {
      const results: ScanResult[] = [];
      const numResults = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < numResults; i++) {
        results.push({
          id: i,
          address: `0x${(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`,
          value: parseInt(searchValue, 10) || Math.floor(Math.random() * 10000),
        });
      }
      setScanResults(results);
      setIsScanning(false);
    }, 1500);
  };
  
  const handleSaveValue = (id: number, newValue: number) => {
      setScanResults(prev => prev.map(r => r.id === id ? {...r, value: newValue} : r));
  };
  
  const handleFreezeValue = (id: number) => {
    setFrozenValues(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  return (
    <div className="flex flex-col h-full text-gray-200">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
          <input
            type="number"
            placeholder="Enter value..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 pl-8 focus:ring-green-500 focus:border-green-500"
            disabled={isScanning}
          />
        </div>
        <button onClick={handleScan} disabled={isScanning} className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500 disabled:bg-gray-500">
          {isScanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      <div className="mt-4 flex-grow overflow-y-auto pr-2">
        {isScanning && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-green-400">Scanning memory...</p>
          </div>
        )}
        {scanResults.length > 0 && !isScanning && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">{scanResults.length} results found.</p>
            {scanResults.map((result) => (
              <div key={result.id}>
                <div 
                  onClick={() => setSelectedResultId(result.id === selectedResultId ? null : result.id)}
                  className={`p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 font-mono text-sm flex justify-between items-center ${selectedResultId === result.id ? 'border border-green-500' : 'border border-transparent'}`}
                >
                  <span className="text-gray-400">{result.address}</span>
                  <span className={`font-bold ${frozenValues.has(result.id) ? 'text-blue-400' : 'text-green-400'}`}>
                    {result.value.toLocaleString()} {frozenValues.has(result.id) && ' (Frozen)'}
                  </span>
                </div>
                {selectedResultId === result.id && (
                    <ValueEditor result={result} onSave={handleSaveValue} onFreeze={handleFreezeValue} isFrozen={frozenValues.has(result.id)}/>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueScanner;
