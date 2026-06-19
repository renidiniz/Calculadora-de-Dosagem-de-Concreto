import React, { useState, useEffect } from 'react';
import { useConcrete } from './context/ConcreteContext';
import { Step1Materials } from './components/Step1Materials';
import { Step2Granulometry } from './components/Step2Granulometry';
import { Step3Packing } from './components/Step3Packing';
import { Step4Regression } from './components/Step4Regression';
import { Step5Dosage } from './components/Step5Dosage';
import { Beaker, Settings, Layers, TrendingUp, CheckCircle, Calculator, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const { step, setStep } = useConcrete();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Materials />;
      case 2:
        return <Step2Granulometry />;
      case 3:
        return <Step3Packing />;
      case 4:
        return <Step4Regression />;
      case 5:
        return <Step5Dosage />;
      default:
        return <Step1Materials />;
    }
  };

  const stepsList = [
    { num: 1, label: 'Materiais', icon: Settings },
    { num: 2, label: 'Granulometria', icon: Layers },
    { num: 3, label: 'Empacotamento', icon: Beaker },
    { num: 4, label: 'Regressão', icon: TrendingUp },
    { num: 5, label: 'Traço Final', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-200">
      
      {/* HEADER (Ocultado na impressão) */}
      <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 text-white rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">ABCP / IPT</h1>
              <p className="text-[9px] text-slate-400 dark:text-slate-550 font-mono tracking-widest uppercase mt-0.5">Dosagem de Concreto Convencional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono tracking-wider hidden sm:block bg-slate-50 dark:bg-slate-950/40 border border-transparent dark:border-slate-850 px-2.5 py-1 rounded">
              MÉTODO DE DOSAGEM RACIONAL
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-slate-50 dark:bg-slate-950/45 text-slate-500 dark:text-slate-450 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100/30 dark:border-slate-800 transition-all focus:outline-none cursor-pointer"
              title="Alternar Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-indigo-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* STEPPER WIZARD (Ocultado na impressão) */}
      <div className="no-print bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-6 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between relative">
            
            {/* Linha horizontal de fundo */}
            <div className="absolute left-4 right-4 top-5 h-[2px] bg-slate-100 dark:bg-slate-800 z-0"></div>

            {stepsList.map((s) => {
              const StepIcon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className="flex flex-col items-center relative z-10 focus:outline-none group cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-950/40'
                        : isCompleted
                        ? 'border-indigo-600 bg-white dark:bg-slate-900 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 group-hover:border-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  >
                    <StepIcon className="w-4.5 h-4.5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold tracking-tight mt-2 transition-colors uppercase ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-500 font-extrabold'
                        : isCompleted
                        ? 'text-slate-600 dark:text-slate-400 font-semibold'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        <div className="print:p-0">
          {renderStep()}
        </div>
      </main>

      {/* FOOTER (Ocultado na impressão) */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 mt-12 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-slate-400 dark:text-slate-500 text-[10px] gap-2 font-mono uppercase tracking-wider">
          <div>
            ABCP/IPT Concrete Mix Designer © 2026
          </div>
          <div>
            Especificações ABNT: NBR 7211 | NBR 12655 | NBR NM 248
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
