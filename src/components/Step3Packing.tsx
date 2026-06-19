import React, { useState, useEffect } from 'react';
import { useConcrete } from '../context/ConcreteContext';
import type { PackingRow, PackingTable } from '../context/ConcreteContext';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export const Step3Packing: React.FC = () => {
  const {
    brita2, brita1, brita0,
    areiaGrossa, areiaMedia, areiaFina,
    pesoVazioRecipiente, setPesoVazioRecipiente,
    volRecipiente, setVolRecipiente,
    packingTables, setPackingTableRows,
    finalFractions,
    setStep,
  } = useConcrete();

  // Helper to determine if a table is active
  const isTableActive = (id: number) => {
    switch (id) {
      case 1:
        return brita2.active && brita1.active;
      case 2:
        return (brita2.active || brita1.active) && brita0.active;
      case 3:
        return (brita2.active || brita1.active || brita0.active) && areiaGrossa.active;
      case 4:
        return (brita2.active || brita1.active || brita0.active || areiaGrossa.active) && areiaMedia.active;
      case 5:
        return (brita2.active || brita1.active || brita0.active || areiaGrossa.active || areiaMedia.active) && areiaFina.active;
      default:
        return false;
    }
  };

  const activeTables = packingTables.filter(t => isTableActive(t.id));
  const [activeTableId, setActiveTableId] = useState<number>(1);

  // Default to first active table
  useEffect(() => {
    if (activeTables.length > 0) {
      const alreadyActive = activeTables.find(t => t.id === activeTableId);
      if (!alreadyActive) {
        setActiveTableId(activeTables[0].id);
      }
    }
  }, [activeTables.length]);

  // Helper to get component densities for a table
  const getTableDensities = (id: number) => {
    // A and B densities
    let densA = 3000;
    let densB = 2830;

    const t1 = packingTables[0];
    const t2 = packingTables[1];
    const t3 = packingTables[2];
    const t4 = packingTables[3];

    switch (id) {
      case 1:
        densA = brita2.massaEspec;
        densB = brita1.massaEspec;
        break;
      case 2:
        densA = t1.optimalDensity;
        densB = brita0.massaEspec;
        break;
      case 3:
        densA = t2.optimalDensity;
        densB = areiaGrossa.massaEspec;
        break;
      case 4:
        densA = t3.optimalDensity;
        densB = areiaMedia.massaEspec;
        break;
      case 5:
        densA = t4.optimalDensity;
        densB = areiaFina.massaEspec;
        break;
    }
    return { densA, densB };
  };

  const handleWeightChange = (tableId: number, rowIndex: number, val: number) => {
    const table = packingTables.find(t => t.id === tableId);
    if (!table) return;
    const nextRows = [...table.rows];
    nextRows[rowIndex] = { ...nextRows[rowIndex], pesoCheio: val };
    setPackingTableRows(tableId, nextRows);
  };

  const getRowCalculations = (row: PackingRow, densA: number, densB: number) => {
    const netWeight = row.pesoCheio - pesoVazioRecipiente;
    const unitWt = volRecipiente > 0 ? netWeight / volRecipiente : 0;
    const unitWtKgM3 = unitWt * 1000;
    const blendDensity = (row.propA * densA + row.propB * densB) / 100;
    const voids = blendDensity > 0 ? (1 - (unitWtKgM3 / blendDensity)) * 100 : 0;
    return {
      unitWt: Number(unitWt.toFixed(3)),
      unitWtKgM3: Number(unitWtKgM3.toFixed(0)),
      blendDensity: Number(blendDensity.toFixed(0)),
      voids: Number(voids.toFixed(2))
    };
  };

  const isInputValid = () => {
    if (volRecipiente <= 0 || pesoVazioRecipiente < 0) return false;
    for (const t of activeTables) {
      for (const r of t.rows) {
        if (r.pesoCheio <= pesoVazioRecipiente) return false;
      }
    }
    return true;
  };

  const currentTable = packingTables.find(t => t.id === activeTableId);
  const densities = currentTable ? getTableDensities(currentTable.id) : { densA: 0, densB: 0 };

  // Helper to find optimal row index in current table
  const getOptimalRowIndex = (table: PackingTable) => {
    const { densA, densB } = getTableDensities(table.id);
    let minVoids = 100;
    let optIdx = -1;
    table.rows.forEach((r: PackingRow, idx: number) => {
      const calcs = getRowCalculations(r, densA, densB);
      if (calcs.voids < minVoids) {
        minVoids = calcs.voids;
        optIdx = idx;
      }
    });
    return optIdx;
  };

  const optRowIdx = currentTable ? getOptimalRowIndex(currentTable) : -1;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">3. Empacotamento de Agregados</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          A planilha calcula o índice de vazios mínimo em uma cascata sequencial de misturas. Preencha as pesagens dos recipientes para as etapas ativas de agregados.
        </p>
      </div>

      {/* Recipiente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-550 mb-1 uppercase tracking-wider">Volume do Recipiente Metálico (L)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-950/45 transition-all text-slate-800 dark:text-slate-100"
            value={volRecipiente}
            onChange={(e) => setVolRecipiente(Number(e.target.value))}
          />
          <span className="text-[10px] text-slate-450 mt-1.5 block">Típico: caixa de 25 x 25 x 25 cm = 15.625 L (ABNT NBR NM 45).</span>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-550 mb-1 uppercase tracking-wider">Peso do Recipiente Vazio (kg)</label>
          <input
            type="number"
            min="0"
            step="0.001"
            className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-950/45 transition-all text-slate-800 dark:text-slate-100"
            value={pesoVazioRecipiente}
            onChange={(e) => setPesoVazioRecipiente(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Se não houver tabelas ativas */}
      {activeTables.length === 0 ? (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 text-amber-850 dark:text-amber-300 text-xs">
          ⚠️ Não há ensaios de empacotamento ativos. Ative pelo menos dois agregados no Passo 1 para realizar os ensaios de mistura.
        </div>
      ) : (
        <>
          {/* Abas das Tabelas Ativas */}
          <div className="flex flex-wrap gap-2">
            {activeTables.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTableId(t.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                  activeTableId === t.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-650 dark:text-slate-300 bg-white dark:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                Etapa {idx + 1}: {t.compAName.split(' ')[0]} / {t.compBName.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Render Active Table */}
          {currentTable && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight">{currentTable.title}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  Densidades de Cálculo: {currentTable.compAName} = <strong className="text-slate-600 dark:text-slate-300">{densities.densA.toFixed(0)} kg/m³</strong> | {currentTable.compBName} = <strong className="text-slate-600 dark:text-slate-300">{densities.densB.toFixed(0)} kg/m³</strong>.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3 font-bold text-center text-[10px]">{currentTable.compAName} (%)</th>
                      <th className="py-2.5 px-3 text-center font-bold text-[10px]">{currentTable.compBName} (%)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-[10px]">Peso Cheio (kg)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-[10px]">Massa Utária (kg/L)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-[10px]">Massa Utária (kg/m³)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-[10px]">Índice de Vazios (%)</th>
                      <th className="py-2.5 px-3 text-center font-bold text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.rows.map((row, idx) => {
                      const isOpt = idx === optRowIdx;
                      const calcs = getRowCalculations(row, densities.densA, densities.densB);
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-slate-100 dark:border-slate-800/60 transition-colors ${
                            isOpt ? 'bg-emerald-50/20 dark:bg-emerald-950/15 border-l-4 border-l-emerald-500 font-bold' : 'hover:bg-slate-50/30 dark:hover:bg-slate-800/20'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{row.propA}%</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{row.propB}%</td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              step="0.001"
                              className="w-28 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-950/45 transition-all bg-white dark:bg-slate-955 text-right text-slate-800 dark:text-slate-100"
                              value={row.pesoCheio}
                              onChange={(e) => handleWeightChange(currentTable.id, idx, Number(e.target.value))}
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">{calcs.unitWt}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">{calcs.unitWtKgM3}</td>
                          <td className={`py-2.5 px-3 text-right font-mono text-xs font-semibold ${isOpt ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {calcs.voids}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isOpt ? (
                              <span className="inline-flex items-center gap-0.5 bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                                Ótimo ({row.propA}/{row.propB})
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">Ok</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Resumo da Etapa */}
              <div className="bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-center transition-colors">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Proporção Ótima</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                    {currentTable.optimalPropA}% / {currentTable.optimalPropB}%
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Densidade da Mescla</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">{currentTable.optimalDensity.toFixed(0)} kg/m³</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Vazios Mínimos</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{currentTable.optimalVoids.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Frações Finais dos Agregados */}
          <div className="bg-slate-900 dark:bg-slate-905 text-white p-6 md:p-8 rounded-2xl space-y-6 shadow-sm border border-transparent dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Frações Secas Finais dos Agregados Ótimos</h4>
              <p className="text-[10px] text-slate-450 font-semibold mt-1">Calculados em cascata a partir das proporções de menor índice de vazios de cada ensaio.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Brita 2</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.brita2 * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Brita 1</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.brita1 * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Brita 0</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.brita0 * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Areia Grossa</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.areiaGrossa * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Areia Média</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.areiaMedia * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-800 dark:border-slate-850">
                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Areia Fina</span>
                <span className="text-base font-extrabold font-mono mt-1 block">{(finalFractions.areiaFina * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-850 pt-4 flex items-center gap-1.5 justify-center font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              A soma das frações é exatamente 100% da massa seca dos agregados.
            </div>
          </div>
        </>
      )}

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 px-5 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all bg-white dark:bg-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Granulometria
        </button>
        <button
          onClick={() => isInputValid() && setStep(4)}
          disabled={!isInputValid()}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-sm hover:-translate-y-px active:translate-y-0 disabled:opacity-45 disabled:pointer-events-none cursor-pointer uppercase tracking-wider flex items-center gap-1"
        >
          Avançar para Regressão <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
