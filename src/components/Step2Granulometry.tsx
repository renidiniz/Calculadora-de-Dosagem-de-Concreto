import React, { useState } from 'react';
import { useConcrete, SIEVES } from '../context/ConcreteContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const Step2Granulometry: React.FC = () => {
  const {
    brita2, setBrita2,
    brita1, setBrita1,
    brita0, setBrita0,
    areiaGrossa, setAreiaGrossa,
    areiaMedia, setAreiaMedia,
    areiaFina, setAreiaFina,
    propSands, setPropSands,
    propGravels, setPropGravels,
    calculateGranulometry,
    getMesclaGranulometry,
    setStep,
  } = useConcrete();

  const [activeTab, setActiveTab] = useState<'areia' | 'brita'>('areia');
  const [activeSubTab, setActiveSubTab] = useState<string>('areia-media');

  // NBR 7211 limits for sand
  const sandLimits: { [key: string]: { min: number; max: number } } = {
    '9.5': { min: 100, max: 100 },
    '4.8': { min: 95, max: 100 },
    '2.4': { min: 80, max: 100 },
    '1.2': { min: 50, max: 90 },
    '0.6': { min: 25, max: 85 },
    '0.3': { min: 10, max: 46 },
    '0.15': { min: 0, max: 15 },
  };

  // Get active aggregates lists
  const getActiveSands = () => {
    const list = [];
    if (areiaGrossa.active) list.push({ id: 'areia-grossa', label: 'Areia Grossa', state: areiaGrossa, setter: setAreiaGrossa });
    if (areiaMedia.active) list.push({ id: 'areia-media', label: 'Areia Média', state: areiaMedia, setter: setAreiaMedia });
    if (areiaFina.active) list.push({ id: 'areia-fina', label: 'Areia Fina', state: areiaFina, setter: setAreiaFina });
    return list;
  };

  const getActiveGravels = () => {
    const list = [];
    if (brita2.active) list.push({ id: 'brita-2', label: 'Brita 2', state: brita2, setter: setBrita2 });
    if (brita1.active) list.push({ id: 'brita-1', label: 'Brita 1', state: brita1, setter: setBrita1 });
    if (brita0.active) list.push({ id: 'brita-0', label: 'Brita 0', state: brita0, setter: setBrita0 });
    return list;
  };

  const activeSands = getActiveSands();
  const activeGravels = getActiveGravels();

  const currentList = activeTab === 'areia' ? activeSands : activeGravels;

  const handleWeightChange = (setter: any, state: any, sieveSize: string, val: number) => {
    const nextSieve = { ...state.sieveData, [sieveSize]: val };
    setter({ ...state, sieveData: nextSieve });
  };

  const handlePropChange = (field: string, val: number) => {
    if (activeTab === 'areia') {
      setPropSands({ ...propSands, [field]: val });
    } else {
      setPropGravels({ ...propGravels, [field]: val });
    }
  };

  // Validate proportions sum to 100%
  const getProportionsSum = () => {
    if (activeTab === 'areia') {
      let sum = 0;
      if (areiaGrossa.active) sum += propSands.grossa;
      if (areiaMedia.active) sum += propSands.media;
      if (areiaFina.active) sum += propSands.fina;
      return sum;
    } else {
      let sum = 0;
      if (brita2.active) sum += propGravels.brita2;
      if (brita1.active) sum += propGravels.brita1;
      if (brita0.active) sum += propGravels.brita0;
      return sum;
    }
  };

  const propSum = getProportionsSum();
  const isPropValid = currentList.length <= 1 || Math.abs(propSum - 100) < 0.01;

  // Chart data generation
  const getChartData = () => {
    const sortedSieves = [...SIEVES].sort((a,b)=>b.size - a.size);
    if (activeSubTab === 'mescla') {
      const mescla = getMesclaGranulometry(activeTab === 'areia');
      return sortedSieves.map(s => {
        const key = s.size.toString();
        const item: any = {
          name: s.label,
          'Curva da Mescla': mescla.passante[key] || 0,
        };
        if (activeTab === 'areia' && sandLimits[key]) {
          item['Limite Inferior (NBR 7211)'] = sandLimits[key].min;
          item['Limite Superior (NBR 7211)'] = sandLimits[key].max;
        }
        return item;
      });
    } else {
      const match = currentList.find(c => c.id === activeSubTab);
      if (!match) return [];
      const calcs = calculateGranulometry(match.state.sieveData);
      return sortedSieves.map(s => {
        const key = s.size.toString();
        const item: any = {
          name: s.label,
          'Curva Individual': calcs.passanteAcumulada[key] || 0,
        };
        if (activeTab === 'areia' && sandLimits[key]) {
          item['Limite Inferior (NBR 7211)'] = sandLimits[key].min;
          item['Limite Superior (NBR 7211)'] = sandLimits[key].max;
        }
        return item;
      });
    }
  };

  const getSubTabCalcs = () => {
    if (activeSubTab === 'mescla') {
      const mescla = getMesclaGranulometry(activeTab === 'areia');
      return {
        acumulada: mescla.acumulada,
        passante: mescla.passante,
        mf: mescla.mf,
        dmc: mescla.dmc,
        isMescla: true,
      };
    } else {
      const match = currentList.find(c => c.id === activeSubTab);
      if (!match) return null;
      const calcs = calculateGranulometry(match.state.sieveData);
      return {
        acumulada: calcs.retidaAcumulada,
        passante: calcs.passanteAcumulada,
        mf: calcs.mf,
        dmc: calcs.dmc,
        isMescla: false,
        state: match.state,
        setter: match.setter,
      };
    }
  };

  const currentCalcs = getSubTabCalcs();
  const chartData = getChartData();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">2. Composição Granulométrica</h2>
        <p className="text-slate-500 text-sm mt-1">
          Informe a massa retida em cada peneira para calibrar as curvas granulométricas individuais de cada material.
        </p>
      </div>

      {/* Tabs Principais */}
      <div className="flex border border-slate-200/50 p-1 bg-slate-100/50 rounded-xl max-w-sm">
        <button
          onClick={() => { setActiveTab('areia'); setActiveSubTab(getActiveSands()[0]?.id || 'mescla'); }}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'areia'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-250/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Areias (Agregado Miúdo)
        </button>
        <button
          onClick={() => { setActiveTab('brita'); setActiveSubTab(getActiveGravels()[0]?.id || 'mescla'); }}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'brita'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-250/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Britas (Agregado Graúdo)
        </button>
      </div>

      {/* Proporções da Mescla Granulométrica */}
      {currentList.length > 1 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Definição de Proporções da Mistura (%)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
            {activeTab === 'areia' ? (
              <>
                {areiaGrossa.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Areia Grossa (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propSands.grossa}
                      onChange={(e) => handlePropChange('grossa', Number(e.target.value))}
                    />
                  </div>
                )}
                {areiaMedia.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Areia Média (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propSands.media}
                      onChange={(e) => handlePropChange('media', Number(e.target.value))}
                    />
                  </div>
                )}
                {areiaFina.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Areia Fina (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propSands.fina}
                      onChange={(e) => handlePropChange('fina', Number(e.target.value))}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {brita2.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Brita 2 (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propGravels.brita2}
                      onChange={(e) => handlePropChange('brita2', Number(e.target.value))}
                    />
                  </div>
                )}
                {brita1.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Brita 1 (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propGravels.brita1}
                      onChange={(e) => handlePropChange('brita1', Number(e.target.value))}
                    />
                  </div>
                )}
                {brita0.active && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Brita 0 (%)</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                      value={propGravels.brita0}
                      onChange={(e) => handlePropChange('brita0', Number(e.target.value))}
                    />
                  </div>
                )}
              </>
            )}
            <div className="flex flex-col justify-end">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Soma das Proporções:</div>
              <div className={`text-sm font-bold ${isPropValid ? 'text-emerald-600' : 'text-red-500'}`}>
                {propSum.toFixed(1)}% {isPropValid ? '✓' : '(Deve somar exatamente 100%)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-2">
        {currentList.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
              activeSubTab === item.id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:text-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
        {currentList.length > 1 && (
          <button
            onClick={() => setActiveSubTab('mescla')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
              activeSubTab === 'mescla'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-200 hover:border-slate-350 text-slate-650 bg-white hover:text-slate-800'
            }`}
          >
            Curva da Mescla
          </button>
        )}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tabela de Peneiras */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                {activeSubTab === 'mescla' ? 'Mescla Calculada' : `Peneiras: ${currentList.find(c=>c.id === activeSubTab)?.label}`}
              </h4>
              <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">
                SÉRIE ABNT NBR NM ISO 3310-1
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3 font-bold text-[10px]">Abertura (mm)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-[10px]">Retida (g)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-[10px]">Acumulada (%)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-[10px]">Passante (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIEVES.map((sieve) => {
                    const key = sieve.size.toString();
                    const isNormal = sieve.isNormal;
                    const hasData = currentCalcs && !currentCalcs.isMescla && currentCalcs.state;
                    
                    return (
                      <tr key={key} className={`border-b border-slate-100 hover:bg-slate-50/30 transition-colors ${isNormal ? 'font-semibold bg-slate-50/15' : 'text-slate-500'}`}>
                        <td className="py-2 px-3 text-slate-700 font-semibold">
                          {sieve.label}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {activeSubTab === 'mescla' ? (
                            <span className="text-slate-300">-</span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              className="w-24 border border-slate-200 text-right px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white"
                              value={hasData ? (currentCalcs.state.sieveData[key] ?? 0) : 0}
                              onChange={(e) => {
                                if (hasData && currentCalcs.setter) {
                                  handleWeightChange(currentCalcs.setter, currentCalcs.state, key, Number(e.target.value));
                                }
                              }}
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-650">
                          {currentCalcs?.acumulada[key] ?? '0.00'}%
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-800">
                          {currentCalcs?.passante[key] ?? '100.00'}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consolidação */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4 bg-slate-50/50 rounded-xl p-4">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Módulo de Finura (MF)</span>
              <span className="text-xl font-black text-slate-800 font-mono">{currentCalcs?.mf ?? '0.00'}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">D.M.C. (Abertura Máxima)</span>
              <span className="text-xl font-black text-slate-800 font-mono">
                {currentCalcs?.dmc ? `${currentCalcs.dmc} mm` : '0 mm'}
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase text-xs tracking-wider">
              Curva Granulométrica vs Normas
            </h4>
            <div className="w-full h-[360px] text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip formatter={(value) => [`${value}%`]} />
                  <Legend verticalAlign="top" height={36} iconType="plainline" />
                  
                  {activeTab === 'areia' && (
                    <Line
                      type="monotone"
                      dataKey="Limite Superior (NBR 7211)"
                      stroke="#cbd5e1"
                      strokeDasharray="4 4"
                      dot={false}
                      strokeWidth={1.5}
                      activeDot={false}
                    />
                  )}
                  {activeTab === 'areia' && (
                    <Line
                      type="monotone"
                      dataKey="Limite Inferior (NBR 7211)"
                      stroke="#cbd5e1"
                      strokeDasharray="4 4"
                      dot={false}
                      strokeWidth={1.5}
                      activeDot={false}
                    />
                  )}
                  
                  <Line
                    type="monotone"
                    dataKey={activeSubTab === 'mescla' ? 'Curva da Mescla' : 'Curva Individual'}
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1, fill: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 leading-relaxed bg-slate-50/50 rounded-xl p-4 border border-slate-100/50">
            {activeTab === 'areia' ? (
              <span>
                <strong>Nota Técnica (Areia)</strong>: Os limites normativos tracejados representam a zona ótima e utilizável de agregados miúdos (ABNT NBR 7211).
              </span>
            ) : (
              <span>
                <strong>Nota Técnica (Brita)</strong>: Curvas de agregados graúdos mostram a graduação granulométrica das britas individuais.
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-350 px-5 py-2.5 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all bg-white cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Materiais
        </button>
        <button
          onClick={() => isPropValid && setStep(3)}
          disabled={!isPropValid}
          className="bg-indigo-600 hover:bg-indigo-755 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-sm hover:-translate-y-px active:translate-y-0 disabled:opacity-45 disabled:pointer-events-none cursor-pointer uppercase tracking-wider flex items-center gap-1"
        >
          Avançar para Empacotamento <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
