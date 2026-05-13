import React, { useState } from 'react';
import { Delete } from 'lucide-react';

interface CalculatorAppProps {
  state?: string;
}

const CalculatorApp: React.FC<CalculatorAppProps> = ({ state }) => {
  const [display, setDisplay] = useState('0');
  
  const isSmall = state === 'floating' || (state && state.includes('split-') && (state.includes('top') || state.includes('bottom')));
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(display);
    } else if (operator) {
      const currentValue = parseFloat(prevValue || '0');
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(String(newValue));
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '×': return prev * next;
      case '÷': return prev / next;
      default: return next;
    }
  };

  const handleEqual = () => {
    if (!operator || prevValue === null) return;
    const inputValue = parseFloat(display);
    const currentValue = parseFloat(prevValue);
    const result = calculate(currentValue, inputValue, operator);
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const Button = ({ children, onClick, className = "", variant = "default" }: any) => {
    const variants: any = {
      default: "bg-slate-100 hover:bg-slate-200 text-slate-800",
      operator: "bg-rose-500 hover:bg-rose-600 text-white",
      function: "bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold",
    };
    return (
      <button 
        onClick={onClick}
        className={`${isSmall ? 'h-11 rounded-xl text-lg' : 'h-16 rounded-2xl text-xl'} font-semibold transition-all active:scale-95 flex items-center justify-center ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-white ${isSmall ? 'px-4 pb-4 pt-2' : 'px-6 pb-6 pt-4'} select-none transition-all`}>
      {/* Display */}
      <div className={`${isSmall ? 'h-24' : 'h-32'} flex flex-col items-end justify-end pb-4 transition-all`}>
        {prevValue && (
          <div className="text-slate-400 text-sm font-medium mb-1">
            {prevValue} {operator}
          </div>
        )}
        <div className={`${isSmall ? 'text-4xl' : 'text-5xl'} font-bold text-slate-900 tracking-tight overflow-hidden text-right w-full transition-all`}>
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className={`grid grid-cols-4 ${isSmall ? 'gap-2' : 'gap-3'} transition-all`}>
        <Button onClick={handleClear} variant="function">AC</Button>
        <Button onClick={() => setDisplay(String(parseFloat(display) * -1))} variant="function">+/-</Button>
        <Button onClick={() => setDisplay(String(parseFloat(display) / 100))} variant="function">%</Button>
        <Button onClick={() => handleOperator('÷')} variant="operator">÷</Button>

        <Button onClick={() => handleDigit('7')}>7</Button>
        <Button onClick={() => handleDigit('8')}>8</Button>
        <Button onClick={() => handleDigit('9')}>9</Button>
        <Button onClick={() => handleOperator('×')} variant="operator">×</Button>

        <Button onClick={() => handleDigit('4')}>4</Button>
        <Button onClick={() => handleDigit('5')}>5</Button>
        <Button onClick={() => handleDigit('6')}>6</Button>
        <Button onClick={() => handleOperator('-')} variant="operator">-</Button>

        <Button onClick={() => handleDigit('1')}>1</Button>
        <Button onClick={() => handleDigit('2')}>2</Button>
        <Button onClick={() => handleDigit('3')}>3</Button>
        <Button onClick={() => handleOperator('+')} variant="operator">+</Button>

        <Button onClick={() => handleDigit('0')} className="col-span-2 aspect-auto">0</Button>
        <Button onClick={() => !display.includes('.') && setDisplay(display + '.')}>.</Button>
        <Button onClick={handleEqual} variant="operator">=</Button>
      </div>
    </div>
  );
};

export default CalculatorApp;
