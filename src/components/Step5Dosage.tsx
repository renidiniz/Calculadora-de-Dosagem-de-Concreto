import React, { useState } from 'react';
import { useConcrete } from '../context/ConcreteContext';
import { ChevronLeft, Printer, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';

export const Step5Dosage: React.FC = () => {
  const {
    cimento,
    agua,
    aditivo,
    brita2,
    brita1,
    brita0,
    areiaGrossa,
    areiaMedia,
    areiaFina,
    finalFractions,
    regression,
    fcj,
    setFcj,
    alpha,
    setAlpha,
    dosagemVolumeAjustado,
    setDosagemVolumeAjustado,
    dosagemTipoAjuste,
    setDosagemTipoAjuste,
    setStep,
  } = useConcrete();

  // Print project details state
  const [nomeObra, setNomeObra] = useState('Residencial Parque das Flores');
  const [engenheiro, setEngenheiro] = useState('Eng. Alisson Diniz');
  const [dataCalculo] = useState(new Date().toLocaleDateString('pt-BR'));

  if (!regression) {
    return (
      <div className="text-center p-8 bg-amber-50 border border-amber-200 text-amber-800">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <h3 className="font-bold">Regressão Inválida</h3>
        <p className="text-sm">Por favor, retorne ao Passo 4 e insira dados de ensaio válidos para calibrar as equações.</p>
        <button onClick={() => setStep(4)} className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-semibold">
          Voltar ao Passo 4
        </button>
      </div>
    );
  }

  const {
    abramsSlope,
    abramsIntercept,
    lyseSlope,
    lyseIntercept,
    molinariSlope,
    molinariIntercept,
  } = regression;

  // 1. Calculate water-to-cement ratio (a/c)
  // log10(fc) = abramsIntercept + abramsSlope * ac => ac = (log10(fc) - abramsIntercept) / abramsSlope
  let acTarget = 0.50;
  let calculationError = false;
  let errorMsg = '';

  if (abramsSlope === 0 || isNaN(abramsSlope)) {
    calculationError = true;
    errorMsg = 'Erro: Inclinação de Abrams inválida ou nula.';
  } else {
    acTarget = (Math.log10(fcj) - abramsIntercept) / abramsSlope;
    if (acTarget < 0.25) {
      acTarget = 0.25;
      errorMsg = 'Aviso: Relação a/c calculada é extremamente baixa (< 0.25). Limitado ao mínimo prático de 0.25.';
    } else if (acTarget > 0.85) {
      acTarget = 0.85;
      errorMsg = 'Aviso: Relação a/c calculada é extremamente alta (> 0.85). Limitado ao máximo prático de 0.85.';
    }
  }

  // 2. Calculate aggregate-to-cement ratio (m)
  // m = lyseSlope * ac + lyseIntercept
  let mTarget = lyseSlope * acTarget + lyseIntercept;
  if (mTarget < 0) {
    mTarget = 0;
  }

  // 3. Cement Consumption (C) in kg/m³ using Molinari Equation
  // m = molinariSlope * (1/C) + molinariIntercept => C = molinariSlope / (m - molinariIntercept)
  let C = 0;
  const molinariDiv = mTarget - molinariIntercept;
  if (molinariSlope > 0 && molinariDiv > 0) {
    C = molinariSlope / molinariDiv;
  } else if (molinariSlope !== 0 && molinariDiv !== 0) {
    C = molinariSlope / molinariDiv;
  }

  if (C < 0 || isNaN(C)) {
    C = 0;
  }

  // 4. Split aggregates using mortar content (alpha)
  // a_total = alpha/100 * (1 + m) - 1
  // p_total = m - a_total
  const aVal = Math.max(0, (alpha / 100) * (1 + mTarget) - 1);
  const pVal = Math.max(0, mTarget - aVal);

  const sumSands =
    (areiaGrossa.active ? finalFractions.areiaGrossa : 0) +
    (areiaMedia.active ? finalFractions.areiaMedia : 0) +
    (areiaFina.active ? finalFractions.areiaFina : 0);

  const sumGravels =
    (brita2.active ? finalFractions.brita2 : 0) +
    (brita1.active ? finalFractions.brita1 : 0) +
    (brita0.active ? finalFractions.brita0 : 0);

  // Normalize packing fractions within categories
  const wAG_sand = areiaGrossa.active && sumSands > 0 ? finalFractions.areiaGrossa / sumSands : 0;
  const wAM_sand = areiaMedia.active && sumSands > 0 ? finalFractions.areiaMedia / sumSands : 0;
  const wAF_sand = areiaFina.active && sumSands > 0 ? finalFractions.areiaFina / sumSands : 0;

  const wB0_gravel = brita0.active && sumGravels > 0 ? finalFractions.brita0 / sumGravels : 0;
  const wB1_gravel = brita1.active && sumGravels > 0 ? finalFractions.brita1 / sumGravels : 0;
  const wB2_gravel = brita2.active && sumGravels > 0 ? finalFractions.brita2 / sumGravels : 0;

  // Traços unitários individuais (massa seca em relação ao cimento)
  const ratioAG = wAG_sand * aVal;
  const ratioAM = wAM_sand * aVal;
  const ratioAF = wAF_sand * aVal;
  const ratioB0 = wB0_gravel * pVal;
  const ratioB1 = wB1_gravel * pVal;
  const ratioB2 = wB2_gravel * pVal;
  const ratioAgua = acTarget;
  const ratioAditivo = aditivo.ativo ? aditivo.dosagemPadrao / 100 : 0;

  // 5. Mass calculations for 1 m³ (kg)
  const W_C = C;
  const W_AG = ratioAG * C;
  const W_AM = ratioAM * C;
  const W_AF = ratioAF * C;
  const W_B0 = ratioB0 * C;
  const W_B1 = ratioB1 * C;
  const W_B2 = ratioB2 * C;
  const W_W = ratioAgua * C;
  const W_Ad = ratioAditivo * C;

  // Scaling Factor
  let scaleFactor = 1.0;
  let adjustedLabel = '1 m³';

  if (dosagemTipoAjuste === 'betoneira') {
    scaleFactor = dosagemVolumeAjustado / 1000;
    adjustedLabel = `${dosagemVolumeAjustado} L`;
  } else if (dosagemTipoAjuste === 'saco') {
    scaleFactor = C > 0 ? (dosagemVolumeAjustado * 50) / C : 1.0;
    adjustedLabel = `${dosagemVolumeAjustado} Saco(s) de 50kg`;
  }

  // Cost calculations
  const getCosto = (weight: number, costoUnit: number) => weight * costoUnit;

  const costCimento = getCosto(W_C, cimento.custo);
  const costAG = areiaGrossa.active ? getCosto(W_AG, areiaGrossa.custo) : 0;
  const costAM = areiaMedia.active ? getCosto(W_AM, areiaMedia.custo) : 0;
  const costAF = areiaFina.active ? getCosto(W_AF, areiaFina.custo) : 0;
  const costB0 = brita0.active ? getCosto(W_B0, brita0.custo) : 0;
  const costB1 = brita1.active ? getCosto(W_B1, brita1.custo) : 0;
  const costB2 = brita2.active ? getCosto(W_B2, brita2.custo) : 0;
  const costAd = aditivo.ativo ? getCosto(W_Ad, aditivo.custo) : 0;
  const costAgua = getCosto(W_W, agua.custo);

  const costTotal =
    costCimento + costAG + costAM + costAF + costB0 + costB1 + costB2 + costAd + costAgua;

  const costPerMPa = fcj > 0 ? costTotal / fcj : 0;

  const totalWeight1m3 =
    W_C +
    W_W +
    W_Ad +
    (areiaGrossa.active ? W_AG : 0) +
    (areiaMedia.active ? W_AM : 0) +
    (areiaFina.active ? W_AF : 0) +
    (brita0.active ? W_B0 : 0) +
    (brita1.active ? W_B1 : 0) +
    (brita2.active ? W_B2 : 0);

  // Lists of active aggregates for display
  const activeSands = [
    { name: areiaGrossa.nome, active: areiaGrossa.active, specGrav: areiaGrossa.massaEspec, ratio: ratioAG, weight: W_AG, cost: costAG, unitCost: areiaGrossa.custo, pct: wAG_sand * 100 },
    { name: areiaMedia.nome, active: areiaMedia.active, specGrav: areiaMedia.massaEspec, ratio: ratioAM, weight: W_AM, cost: costAM, unitCost: areiaMedia.custo, pct: wAM_sand * 100 },
    { name: areiaFina.nome, active: areiaFina.active, specGrav: areiaFina.massaEspec, ratio: ratioAF, weight: W_AF, cost: costAF, unitCost: areiaFina.custo, pct: wAF_sand * 100 },
  ].filter(s => s.active);

  const activeGravels = [
    { name: brita0.nome, active: brita0.active, specGrav: brita0.massaEspec, ratio: ratioB0, weight: W_B0, cost: costB0, unitCost: brita0.custo, pct: wB0_gravel * 100 },
    { name: brita1.nome, active: brita1.active, specGrav: brita1.massaEspec, ratio: ratioB1, weight: W_B1, cost: costB1, unitCost: brita1.custo, pct: wB1_gravel * 100 },
    { name: brita2.nome, active: brita2.active, specGrav: brita2.massaEspec, ratio: ratioB2, weight: W_B2, cost: costB2, unitCost: brita2.custo, pct: wB2_gravel * 100 },
  ].filter(g => g.active);

  const sandPctOfAggregates = mTarget > 0 ? (aVal / mTarget) * 100 : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* SCREEN VIEW SECTION (no-print) */}
      <div className="no-print space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">5. Dosagem Final e Custos</h2>
          <p className="text-slate-500 text-sm mt-1">
            Defina a resistência característica de projeto do concreto (f_cj) e o teor de argamassa (α). O sistema computará as relações estequiométricas exatas pelo método IPT/ABCP, consumo de materiais e custos.
          </p>
        </div>

        {/* Inputs de Controle e Parâmetros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
          {/* Resistência Desejada */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Resistência Desejada f_cj aos 28 dias (MPa)
            </label>
            <input
              type="number"
              min="10"
              max="80"
              step="0.5"
              className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all font-bold text-slate-800 bg-white"
              value={fcj}
              onChange={(e) => setFcj(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 mt-1.5 block">
              Obs: f_cj = f_ck + 1.65 * s_d (Resistência de dosagem).
            </span>
          </div>

          {/* Teor de Argamassa */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Teor de Argamassa α (%)
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                min="45"
                max="65"
                step="0.5"
                className="w-2/3 accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
              <input
                type="number"
                min="40"
                max="70"
                step="0.1"
                className="w-1/3 border border-slate-200 px-2 py-1.5 rounded-lg text-xs text-center font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">
              Proporção de Areia nos Agregados: <strong className="text-slate-700">{sandPctOfAggregates.toFixed(1)}%</strong>.
            </span>
          </div>

          {/* Relações Calculadas */}
          <div className="flex flex-col justify-center bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between items-center text-xs font-bold text-indigo-900">
              <span>Relação a/c:</span>
              <span className="font-extrabold text-indigo-600 font-mono text-sm">{acTarget.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-indigo-900 mt-2 border-t border-indigo-100/30 pt-2">
              <span>Traço Unitário m:</span>
              <span className="font-extrabold text-indigo-600 font-mono text-sm">1 : {mTarget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-indigo-900 mt-2 border-t border-indigo-100/30 pt-2">
              <span>Consumo Cimento:</span>
              <span className="font-extrabold text-indigo-600 font-mono text-sm">{C.toFixed(1)} kg/m³</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className={`flex items-start gap-2.5 border p-4 rounded-xl ${calculationError ? 'border-red-100 bg-red-50/50 text-red-800' : 'border-amber-100 bg-amber-50/50 text-amber-800'}`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-bold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Commercial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all duration-200">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Custo do Concreto</span>
              <span className="text-xl font-extrabold text-slate-900">R$ {costTotal.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ m³</span></span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all duration-200">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Custo por MPa</span>
              <span className="text-xl font-extrabold text-slate-900">R$ {costPerMPa.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ MPa</span></span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-xs hover:border-slate-200 transition-all duration-200">
            <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Massa Fresca Estimada</span>
              <span className="text-xl font-extrabold text-slate-900">{totalWeight1m3.toFixed(0)} <span className="text-xs font-medium text-slate-400">kg/m³</span></span>
            </div>
          </div>
        </div>

        {/* Tabela de Receita do Concreto por m³ e Ajustada */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Tabela de Dosagem (Receita do Concreto)</h3>
              <span className="text-[10px] text-slate-450 font-medium mt-0.5 block">
                Traço unitário em massa seca: <strong className="text-slate-700">1 : {aVal.toFixed(2)} : {pVal.toFixed(2)} : {acTarget.toFixed(2)}</strong>
              </span>
            </div>

            {/* Redimensionador de Escala */}
            <div className="flex flex-wrap items-center gap-3 border border-slate-150 p-2 bg-slate-50/60 rounded-xl">
              <span className="text-xs font-bold text-slate-500 pl-1">Escalar Traço:</span>
              <select
                className="border border-slate-200 bg-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all font-semibold text-slate-700 cursor-pointer"
                value={dosagemTipoAjuste}
                onChange={(e) => {
                  setDosagemTipoAjuste(e.target.value as any);
                  setDosagemVolumeAjustado(e.target.value === 'saco' ? 1 : e.target.value === 'betoneira' ? 150 : 1000);
                }}
              >
                <option value="m3">1 m³ (Padrão)</option>
                <option value="betoneira">Capacidade do Misturador</option>
                <option value="saco">Sacos de Cimento (50kg)</option>
              </select>

              {dosagemTipoAjuste !== 'm3' && (
                <input
                  type="number"
                  min="0.1"
                  step={dosagemTipoAjuste === 'saco' ? '0.5' : '10'}
                  className="w-20 border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-center text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all font-bold text-slate-800"
                  value={dosagemVolumeAjustado}
                  onChange={(e) => setDosagemVolumeAjustado(Number(e.target.value))}
                />
              )}
              {dosagemTipoAjuste === 'betoneira' && <span className="text-xs font-bold text-slate-500">Litros</span>}
              {dosagemTipoAjuste === 'saco' && <span className="text-xs font-bold text-slate-500">Sacos</span>}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3 font-bold text-[10px]">Material</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px]">Densidade (kg/m³)</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px]">Proporção Seca (Massa)</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px]">Massa para 1 m³ (kg)</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px] text-slate-850 bg-slate-50/30">Massa Escalonada ({adjustedLabel}) (kg)</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px]">Custo Unitário</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px]">Custo / m³</th>
                  <th className="py-3 px-3 text-right font-bold text-[10px] text-emerald-800 bg-emerald-55/5">Custo Escalonado</th>
                </tr>
              </thead>
              <tbody>
                {/* CIMENTO */}
                <tr className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors font-medium">
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{cimento.nome}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{cimento.massaEspec}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">1.000</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">{W_C.toFixed(1)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-slate-900 bg-slate-50/30">
                    {(W_C * scaleFactor).toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">R$ {cimento.custo.toFixed(3)} /kg</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">R$ {costCimento.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50/10">
                    R$ {(costCimento * scaleFactor).toFixed(2)}
                  </td>
                </tr>

                {/* AREIAS */}
                {activeSands.map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-3 pl-6 text-slate-700 font-semibold">
                      <span className="text-slate-350 mr-1.5 font-normal">↳</span>
                      <span>{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1.5">({s.pct.toFixed(1)}% das areias)</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{s.specGrav}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{s.ratio.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">{s.weight.toFixed(1)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-slate-800 bg-slate-50/30">
                      {(s.weight * scaleFactor).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">R$ {s.unitCost.toFixed(3)} /kg</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">R$ {s.cost.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50/10">R$ {(s.cost * scaleFactor).toFixed(2)}</td>
                  </tr>
                ))}

                {/* BRITAS */}
                {activeGravels.map((g, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-3 pl-6 text-slate-700 font-semibold">
                      <span className="text-slate-355 mr-1.5 font-normal">↳</span>
                      <span>{g.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1.5">({g.pct.toFixed(1)}% das britas)</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{g.specGrav}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{g.ratio.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">{g.weight.toFixed(1)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-slate-800 bg-slate-50/30">
                      {(g.weight * scaleFactor).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">R$ {g.unitCost.toFixed(3)} /kg</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">R$ {g.cost.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50/10">R$ {(g.cost * scaleFactor).toFixed(2)}</td>
                  </tr>
                ))}

                {/* ADITIVO */}
                {aditivo.ativo && (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-3 text-slate-800 font-semibold">
                      {aditivo.nome}
                      <span className="text-[10px] text-slate-400 font-bold ml-1.5">({aditivo.dosagemPadrao}%)</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{aditivo.massaEspec}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{ratioAditivo.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">{W_Ad.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-slate-800 bg-slate-50/30">
                      {(W_Ad * scaleFactor).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">R$ {aditivo.custo.toFixed(3)} /kg</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">R$ {costAd.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50/10">R$ {(costAd * scaleFactor).toFixed(2)}</td>
                  </tr>
                )}

                {/* ÁGUA */}
                <tr className="border-b border-slate-200 hover:bg-slate-50/40 transition-colors font-medium">
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{agua.nome}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{agua.massaEspec}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">{acTarget.toFixed(3)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-600">{W_W.toFixed(1)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-slate-900 bg-slate-50/30">
                    {(W_W * scaleFactor).toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">R$ {agua.custo.toFixed(3)} /kg</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-650">R$ {costAgua.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50/10">R$ {(costAgua * scaleFactor).toFixed(2)}</td>
                </tr>

                {/* LINHA DE TOTAIS */}
                <tr className="bg-slate-55/70 font-bold border-t border-slate-300">
                  <td className="py-4 px-3 uppercase text-slate-600 text-[10px] tracking-wider" colSpan={3}>Massa Total Estimada / Custo Total</td>
                  <td className="py-4 px-3 text-right font-mono text-xs text-slate-700">
                    {totalWeight1m3.toFixed(1)} kg
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-sm text-slate-900 bg-slate-100/30">
                    {(totalWeight1m3 * scaleFactor).toFixed(1)} kg
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-[10px] text-slate-400">
                    -
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-xs text-slate-800">
                    R$ {costTotal.toFixed(2)}
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-sm text-emerald-800 bg-emerald-50/20 font-extrabold">
                    R$ {(costTotal * scaleFactor).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              Cálculo estequiométrico realizado pelo método <strong>IPT/ABCP</strong> com base nos volumes absolutos. Consumo de cimento de Molinari de <strong>{C.toFixed(1)} kg/m³</strong> e traço unitário seco correspondente de <strong>1 : {aVal.toFixed(2)} : {pVal.toFixed(2)}</strong>.
            </span>
          </div>
        </div>

        {/* Configurações do Relatório de Impressão */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-3 mb-5 uppercase tracking-wider">Exportar Memorial de Cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Identificação da Obra</label>
              <input
                type="text"
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white text-slate-800"
                value={nomeObra}
                onChange={(e) => setNomeObra(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Engenheiro Responsável</label>
              <input
                type="text"
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white text-slate-800"
                value={engenheiro}
                onChange={(e) => setEngenheiro(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={handlePrint}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-sm hover:-translate-y-px active:translate-y-0 cursor-pointer uppercase tracking-wider"
              >
                <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY VIEW SECTION */}
      <div className="hidden print:block print-container font-sans text-black p-4 space-y-6">
        {/* Print Header */}
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-black uppercase tracking-wider">Laudo Técnico de Dosagem de Concreto</h1>
          <p className="text-xs font-mono uppercase mt-1">Método ABCP/IPT — Associação Brasileira de Cimento Portland / Instituto de Pesquisas Tecnológicas</p>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-3 gap-4 border border-black p-4 text-xs font-medium">
          <div><strong>OBRA:</strong> {nomeObra}</div>
          <div><strong>RESPONSÁVEL TÉCNICO:</strong> {engenheiro}</div>
          <div><strong>DATA DO CÁLCULO:</strong> {dataCalculo}</div>
        </div>

        {/* Parâmetros e Equações */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-1">1. Parâmetros de Dosagem e Calibração</h2>
          <table className="w-full text-xs border border-black text-left">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-black">
                <th className="p-2">Variável</th>
                <th className="p-2">Fórmula / Modelo de Regressão</th>
                <th className="p-2 text-right">Valor Calibrado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Resistência Alvo (f_cj 28d)</td>
                <td className="p-2">Inserida pelo Engenheiro</td>
                <td className="p-2 text-right font-bold font-mono">{fcj} MPa</td>
              </tr>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Relação Água/Cimento (a/c)</td>
                <td className="p-2">a/c = (log10(f_cj) - {abramsIntercept.toFixed(4)}) / ({abramsSlope.toFixed(4)})</td>
                <td className="p-2 text-right font-bold font-mono">{acTarget.toFixed(3)}</td>
              </tr>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Traço Unitário (m)</td>
                <td className="p-2">m = {lyseSlope.toFixed(4)} * a/c + ({lyseIntercept.toFixed(4)})</td>
                <td className="p-2 text-right font-bold font-mono">1 : {mTarget.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Consumo de Cimento (C)</td>
                <td className="p-2">C = {molinariSlope.toFixed(1)} / (m - ({molinariIntercept.toFixed(4)}))</td>
                <td className="p-2 text-right font-bold font-mono">{C.toFixed(1)} kg/m³</td>
              </tr>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Teor de Argamassa (α)</td>
                <td className="p-2">Inserido pelo Engenheiro (Massa de argamassa sobre concreto total)</td>
                <td className="p-2 text-right font-bold font-mono">{alpha.toFixed(1)}%</td>
              </tr>
              <tr className="border-b border-black/20">
                <td className="p-2 font-semibold">Total Areia / Cimento (a)</td>
                <td className="p-2">a = α/100 * (1 + m) - 1</td>
                <td className="p-2 text-right font-bold font-mono">{aVal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Total Brita / Cimento (p)</td>
                <td className="p-2">p = m - a</td>
                <td className="p-2 text-right font-bold font-mono">{pVal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recipe Table (Print) */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-1">2. Consumo de Materiais Secos e Custos Estimados</h2>
          <p className="text-[10px] italic">Traço unitário em massa seca: <strong>1 : {aVal.toFixed(2)} : {pVal.toFixed(2)} : {acTarget.toFixed(2)}</strong></p>
          <table className="w-full text-xs border border-black text-left">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-black">
                <th className="p-2">Material</th>
                <th className="p-2 text-right">Proporção Seca (Massa)</th>
                <th className="p-2 text-right">Peso por 1 m³ (kg)</th>
                <th className="p-2 text-right">Peso Escalonado ({adjustedLabel}) (kg)</th>
                <th className="p-2 text-right">Custo / m³</th>
              </tr>
            </thead>
            <tbody>
              {/* Cement */}
              <tr className="border-b border-black/20">
                <td className="p-2 font-bold">{cimento.nome}</td>
                <td className="p-2 text-right font-mono">1.000</td>
                <td className="p-2 text-right font-mono">{W_C.toFixed(1)}</td>
                <td className="p-2 text-right font-mono font-bold">{(W_C * scaleFactor).toFixed(1)}</td>
                <td className="p-2 text-right font-mono">R$ {costCimento.toFixed(2)}</td>
              </tr>

              {/* Sands */}
              {activeSands.map((s, idx) => (
                <tr key={idx} className="border-b border-black/20">
                  <td className="p-2 pl-4">↳ {s.name} ({s.pct.toFixed(1)}%)</td>
                  <td className="p-2 text-right font-mono">{s.ratio.toFixed(3)}</td>
                  <td className="p-2 text-right font-mono">{s.weight.toFixed(1)}</td>
                  <td className="p-2 text-right font-mono font-bold">{(s.weight * scaleFactor).toFixed(1)}</td>
                  <td className="p-2 text-right font-mono">R$ {s.cost.toFixed(2)}</td>
                </tr>
              ))}

              {/* Gravels */}
              {activeGravels.map((g, idx) => (
                <tr key={idx} className="border-b border-black/20">
                  <td className="p-2 pl-4">↳ {g.name} ({g.pct.toFixed(1)}%)</td>
                  <td className="p-2 text-right font-mono">{g.ratio.toFixed(3)}</td>
                  <td className="p-2 text-right font-mono">{g.weight.toFixed(1)}</td>
                  <td className="p-2 text-right font-mono font-bold">{(g.weight * scaleFactor).toFixed(1)}</td>
                  <td className="p-2 text-right font-mono">R$ {g.cost.toFixed(2)}</td>
                </tr>
              ))}

              {/* Additive */}
              {aditivo.ativo && (
                <tr className="border-b border-black/20">
                  <td className="p-2">{aditivo.nome} ({aditivo.dosagemPadrao}%)</td>
                  <td className="p-2 text-right font-mono">{ratioAditivo.toFixed(3)}</td>
                  <td className="p-2 text-right font-mono">{W_Ad.toFixed(2)}</td>
                  <td className="p-2 text-right font-mono font-bold">{(W_Ad * scaleFactor).toFixed(2)}</td>
                  <td className="p-2 text-right font-mono">R$ {costAd.toFixed(2)}</td>
                </tr>
              )}

              {/* Water */}
              <tr className="border-b border-black">
                <td className="p-2">{agua.nome}</td>
                <td className="p-2 text-right font-mono">{acTarget.toFixed(3)}</td>
                <td className="p-2 text-right font-mono">{W_W.toFixed(1)}</td>
                <td className="p-2 text-right font-mono font-bold">{(W_W * scaleFactor).toFixed(1)}</td>
                <td className="p-2 text-right font-mono">R$ {costAgua.toFixed(2)}</td>
              </tr>

              {/* Total */}
              <tr className="bg-slate-100 font-bold border-t border-black">
                <td className="p-2 text-left">TOTAIS (Massa Fresca Estimada / Custo)</td>
                <td className="p-2 text-right font-mono">-</td>
                <td className="p-2 text-right font-mono">{totalWeight1m3.toFixed(1)} kg</td>
                <td className="p-2 text-right font-mono">{(totalWeight1m3 * scaleFactor).toFixed(1)} kg</td>
                <td className="p-2 text-right font-mono">R$ {costTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Indicadores Comerciais */}
        <div className="grid grid-cols-2 gap-4 border border-black p-4 text-xs font-semibold">
          <div>CUSTO ESTIMADO DO CONCRETO: <span className="font-mono text-sm font-black">R$ {costTotal.toFixed(2)} / m³</span></div>
          <div>CUSTO POR MPa DE RESISTÊNCIA: <span className="font-mono text-sm font-black">R$ {costPerMPa.toFixed(2)} / MPa</span></div>
        </div>

        {/* Technical signatures */}
        <div className="pt-16 grid grid-cols-2 gap-8 text-xs text-center print-break-inside-avoid">
          <div className="border-t border-black pt-2">
            <p><strong>Responsável Técnico</strong></p>
            <p className="mt-1">{engenheiro}</p>
          </div>
          <div className="border-t border-black pt-2">
            <p><strong>Fiscalização / Engenharia da Obra</strong></p>
            <p className="mt-1">{nomeObra}</p>
          </div>
        </div>
      </div>

      {/* Botões de Navegação (no-print) */}
      <div className="no-print flex justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setStep(4)}
          className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-350 px-5 py-2.5 rounded-lg text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all bg-white cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Regressão
        </button>
        <span className="text-xs text-slate-400 font-semibold self-center">
          Dosagem calculada com sucesso pelo método ABCP/IPT.
        </span>
      </div>
    </div>
  );
};
