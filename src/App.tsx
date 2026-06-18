import React from 'react';
import { useConcrete } from './context/ConcreteContext';
import { Step1Materials } from './components/Step1Materials';
import { Step2Granulometry } from './components/Step2Granulometry';
import { Step3Packing } from './components/Step3Packing';
import { Step4Regression } from './components/Step4Regression';
import { Step5Dosage } from './components/Step5Dosage';
import { Beaker, Settings, Layers, TrendingUp, CheckCircle, Calculator } from 'lucide-react';

const App: React.FC = () => {
  const { step, setStep } = useConcrete();

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* HEADER (Ocultado na impressão) */}
      <header className="no-print bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 text-white rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-955 tracking-tight leading-none">ABCP / IPT</h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Dosagem de Concreto Convencional</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold font-mono tracking-wider hidden sm:block bg-slate-50 px-2.5 py-1 rounded">
            MÉTODO DE DOSAGEM RACIONAL
          </div>
        </div>
      </header>

      {/* STEPPER WIZARD (Ocultado na impressão) */}
      <div className="no-print bg-white border-b border-slate-100 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between relative">
            
            {/* Linha horizontal de fundo */}
            <div className="absolute left-4 right-4 top-5 h-[2px] bg-slate-100 z-0"></div>

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
                        ? 'border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-50'
                        : isCompleted
                        ? 'border-indigo-600 bg-white text-indigo-600'
                        : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    <StepIcon className="w-4.5 h-4.5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold tracking-tight mt-2 transition-colors uppercase ${
                      isActive
                        ? 'text-indigo-600 font-extrabold'
                        : isCompleted
                        ? 'text-slate-600 font-semibold'
                        : 'text-slate-400 group-hover:text-slate-600'
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
      <footer className="no-print bg-white border-t border-slate-200 py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[10px] gap-2 font-mono uppercase tracking-wider">
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
