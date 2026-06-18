import React from 'react';
import { useConcrete } from '../context/ConcreteContext';
import type { TrialMix } from '../context/ConcreteContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LineChart as ChartIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const Step4Regression: React.FC = () => {
  const {
    trialMixes,
    setTrialMixes,
    numMixes,
    setNumMixes,
    cylinderDiameter,
    setCylinderDiameter,
    cylinderHeight,
    setCylinderHeight,
    regression,
    setStep,
  } = useConcrete();

  const handleMixChange = (index: number, field: keyof TrialMix, value: any) => {
    const nextMixes = [...trialMixes];
    nextMixes[index] = { ...nextMixes[index], [field]: value };
    setTrialMixes(nextMixes);
  };

  const handleCylChange = (index: number, cylNum: 1 | 2, field: 'pVazio' | 'pCheio', val: number) => {
    const nextMixes = [...trialMixes];
    const mix = nextMixes[index];
    const cyl = cylNum === 1 ? { ...mix.cyl1, [field]: val } : { ...mix.cyl2, [field]: val };
    
    if (cylNum === 1) {
      nextMixes[index] = { ...mix, cyl1: cyl };
    } else {
      nextMixes[index] = { ...mix, cyl2: cyl };
    }
    setTrialMixes(nextMixes);
  };

  const handleToggleMixCount = (n: 3 | 4) => {
    setNumMixes(n);
    if (n === 4 && trialMixes.length === 3) {
      // Add a 4th point if not already present
      setTrialMixes([
        ...trialMixes,
        {
          ac: 0.75, m: 8.5, fc: 12,
          cyl1: { pVazio: 1.9, pCheio: 5.6 },
          cyl2: { pVazio: 2.1, pCheio: 5.8 }
        }
      ]);
    }
  };

  const isValid = trialMixes.length >= numMixes && regression !== null;

  // Abrams Base-10 Chart Data
  const getAbramsData = () => {
    if (!regression) return [];
    const { abramsSlope, abramsIntercept } = regression;
    const activePoints = trialMixes.slice(0, numMixes);
    const acs = activePoints.map(m => m.ac);
    const minAc = Math.min(...acs, 0.40);
    const maxAc = Math.max(...acs, 0.80);
    const data: any[] = [];

    // Trendline (fc = 10^(intercept + slope * ac))
    const steps = 25;
    for (let i = 0; i <= steps; i++) {
      const ac = minAc + (i * (maxAc - minAc)) / steps;
      data.push({
        ac: Number(ac.toFixed(3)),
        'Curva de Abrams': Number(Math.pow(10, abramsIntercept + abramsSlope * ac).toFixed(2)),
      });
    }

    // Experimental points
    activePoints.forEach((m, idx) => {
      data.push({
        ac: m.ac,
        'Pontos de Ensaio': m.fc,
        tooltipLabel: `Ensaio ${idx + 1}: a/c=${m.ac}, fc=${m.fc} MPa`,
      });
    });

    return data.sort((a, b) => a.ac - b.ac);
  };

  // Lyse Chart Data
  const getLyseData = () => {
    if (!regression) return [];
    const { lyseSlope, lyseIntercept } = regression;
    const activePoints = trialMixes.slice(0, numMixes);
    const acs = activePoints.map(m => m.ac);
    const minAc = Math.min(...acs, 0.40);
    const maxAc = Math.max(...acs, 0.80);
    const data: any[] = [];

    // Trendline
    const steps = 25;
    for (let i = 0; i <= steps; i++) {
      const ac = minAc + (i * (maxAc - minAc)) / steps;
      data.push({
        ac: Number(ac.toFixed(3)),
        'Reta de Lyse': Number((lyseIntercept + lyseSlope * ac).toFixed(2)),
      });
    }

    // Experimental points
    activePoints.forEach((m, idx) => {
      data.push({
        ac: m.ac,
        'Pontos de Ensaio': m.m,
        tooltipLabel: `Ensaio ${idx + 1}: a/c=${m.ac}, m=${m.m}`,
      });
    });

    return data.sort((a, b) => a.ac - b.ac);
  };

  const abramsData = getAbramsData();
  const lyseData = getLyseData();
  const activePoints = trialMixes.slice(0, numMixes);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">4. Curvas de Dosagem (Modelo Matemático)</h2>
          <p className="text-slate-500 text-sm mt-1">
            Escolha o número de traços e insira as pesagens dos corpos de prova para calcular as regressões.
          </p>
        </div>

        {/* Toggle 3t vs 4t */}
        <div className="flex border border-slate-200/50 p-1 bg-slate-100/50 rounded-xl">
          <button
            onClick={() => handleToggleMixCount(3)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              numMixes === 3 ? 'bg-white text-indigo-600 shadow-xs border border-slate-250/20' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3 Traços
          </button>
          <button
            onClick={() => handleToggleMixCount(4)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              numMixes === 4 ? 'bg-white text-indigo-600 shadow-xs border border-slate-250/20' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            4 Traços
          </button>
        </div>
      </div>

      {/* Dimensões dos Cilindros */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Diâmetro dos Cilindros (cm)</label>
          <input
            type="number"
            min="5"
            max="30"
            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white"
            value={cylinderDiameter}
            onChange={(e) => setCylinderDiameter(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Altura dos Cilindros (cm)</label>
          <input
            type="number"
            min="10"
            max="60"
            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white"
            value={cylinderHeight}
            onChange={(e) => setCylinderHeight(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Grid: Tabela de Entrada + Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tabela de Pontos de Ensaio e Densidade */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Ensaios dos Corpos de Prova (Cilindros 10x20)
            </h3>
            
            <div className="space-y-6 overflow-y-auto max-h-[400px] pr-1">
              {activePoints.map((mix, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 space-y-3 transition-all hover:bg-slate-50/70">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 text-xs">Traço {idx + 1} ({idx === 0 ? 'Rico' : idx === numMixes - 1 ? 'Pobre' : 'Interm'})</span>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-bold">
                      <span>a/c: <strong className="text-slate-700">{mix.ac}</strong></span>
                      <span>m: <strong className="text-slate-700">{mix.m}</strong></span>
                      <span>fc: <strong className="text-slate-700">{mix.fc} MPa</strong></span>
                    </div>
                  </div>
                  
                  {/* Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Cilindro 1 (Vazio / Cheio) (kg)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          className="w-1/2 border border-slate-200 px-2 py-1 rounded-md text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 transition-all bg-white"
                          placeholder="Vazio"
                          value={mix.cyl1.pVazio}
                          onChange={(e) => handleCylChange(idx, 1, 'pVazio', Number(e.target.value))}
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="w-1/2 border border-slate-200 px-2 py-1 rounded-md text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 transition-all bg-white"
                          placeholder="Cheio"
                          value={mix.cyl1.pCheio}
                          onChange={(e) => handleCylChange(idx, 1, 'pCheio', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Cilindro 2 (Vazio / Cheio) (kg)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          className="w-1/2 border border-slate-200 px-2 py-1 rounded-md text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 transition-all bg-white"
                          placeholder="Vazio"
                          value={mix.cyl2.pVazio}
                          onChange={(e) => handleCylChange(idx, 2, 'pVazio', Number(e.target.value))}
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="w-1/2 border border-slate-200 px-2 py-1 rounded-md text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 transition-all bg-white"
                          placeholder="Cheio"
                          value={mix.cyl2.pCheio}
                          onChange={(e) => handleCylChange(idx, 2, 'pCheio', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edição rápida dos coeficientes de entrada */}
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100/70 pt-2 text-center text-[10px]">
                    <div>
                      <label className="block text-slate-400 font-semibold">Relação a/c</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-20 border border-slate-250/70 px-2 py-1 rounded-md text-xs font-bold text-center mt-0.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white text-slate-800"
                        value={mix.ac}
                        onChange={(e) => handleMixChange(idx, 'ac', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold">Traço Unitário (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 border border-slate-250/70 px-2 py-1 rounded-md text-xs font-bold text-center mt-0.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white text-slate-800"
                        value={mix.m}
                        onChange={(e) => handleMixChange(idx, 'm', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold">Resistência fc (MPa)</label>
                      <input
                        type="number"
                        className="w-20 border border-slate-250/70 px-2 py-1 rounded-md text-xs font-bold text-center mt-0.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white text-slate-800"
                        value={mix.fc}
                        onChange={(e) => handleMixChange(idx, 'fc', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 bg-slate-50 rounded-lg p-2 px-3">
                    <span>Massa Fresca: <strong className="text-slate-850 font-mono">{mix.calculatedDensity} kg/m³</strong></span>
                    <span>Consumo Cimento: <strong className="text-slate-850 font-mono">{mix.calculatedC} kg/m³</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regressões matemáticas */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
              <ChartIcon className="w-4 h-4 text-indigo-600" /> Parâmetros de Regressão Linear
            </h4>
            {regression ? (
              <div className="space-y-3.5 text-xs">
                {/* Abrams */}
                <div className="bg-white p-3 rounded-lg border border-slate-200/50 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Abrams (Resistência)</span>
                    <span className="text-slate-400 font-mono">R² = {regression.r2Abrams.toFixed(4)}</span>
                  </div>
                  <div className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50/30 rounded-md p-2 mt-2">
                    log10(fc) = {regression.abramsIntercept.toFixed(4)} + ({regression.abramsSlope.toFixed(4)} * a/c)
                  </div>
                </div>

                {/* Lyse */}
                <div className="bg-white p-3 rounded-lg border border-slate-200/50 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Lyse (Agregado/Cimento)</span>
                    <span className="text-slate-400 font-mono">R² = {regression.r2Lyse.toFixed(4)}</span>
                  </div>
                  <div className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50/30 rounded-md p-2 mt-2">
                    m = {regression.lyseSlope.toFixed(4)} * a/c + ({regression.lyseIntercept.toFixed(4)})
                  </div>
                </div>

                {/* Molinari */}
                <div className="bg-white p-3 rounded-lg border border-slate-200/50 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Molinari (Consumo Cimento)</span>
                    <span className="text-slate-400 font-mono">R² = {regression.r2Molinari.toFixed(4)}</span>
                  </div>
                  <div className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50/30 rounded-md p-2 mt-2">
                    m = {regression.molinariSlope.toFixed(4)} * (1/C) + ({regression.molinariIntercept.toFixed(4)})
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100/60 font-semibold">
                Aguardando dados de ensaio...
              </div>
            )}
          </div>
        </div>

        {/* Gráficos */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase flex justify-between items-center tracking-wider">
              <span>Curva de Abrams (fc vs a/c)</span>
            </h4>
            <div className="w-full h-[220px] text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={abramsData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="ac" 
                    type="number" 
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                    tickFormatter={(v) => v.toFixed(2)}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 10']}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props: any) => {
                      if (props.payload.tooltipLabel) {
                        return [`${props.payload['Pontos de Ensaio']} MPa`, 'Ponto Experimental'];
                      }
                      return [`${value} MPa`, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={30} iconType="circle" />
                  
                  <Line
                    type="monotone"
                    dataKey="Pontos de Ensaio"
                    stroke="none"
                    dot={{ r: 6, fill: '#0f172a', strokeWidth: 0 }}
                    name="Ensaios Realizados"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="Curva de Abrams"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    name="Curva de Ajuste"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase flex justify-between items-center tracking-wider">
              <span>Reta de Lyse (m vs a/c)</span>
            </h4>
            <div className="w-full h-[220px] text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lyseData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="ac" 
                    type="number" 
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                    tickFormatter={(v) => v.toFixed(2)}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 2']}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props: any) => {
                      if (props.payload.tooltipLabel) {
                        return [props.payload['Pontos de Ensaio'], 'Ponto Experimental'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={30} iconType="circle" />
                  
                  <Line
                    type="monotone"
                    dataKey="Pontos de Ensaio"
                    stroke="none"
                    dot={{ r: 6, fill: '#0f172a', strokeWidth: 0 }}
                    name="Ensaios Realizados"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="Reta de Lyse"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    name="Reta de Ajuste"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-350 px-5 py-2.5 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all bg-white cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Empacotamento
        </button>
        <button
          onClick={() => isValid && setStep(5)}
          disabled={!isValid}
          className="bg-indigo-600 hover:bg-indigo-755 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-sm hover:-translate-y-px active:translate-y-0 disabled:opacity-45 disabled:pointer-events-none cursor-pointer uppercase tracking-wider flex items-center gap-1"
        >
          Avançar para Dosagem Final <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
