import React from 'react';
import { useConcrete } from '../context/ConcreteContext';
import type { Material } from '../context/ConcreteContext';

export const Step1Materials: React.FC = () => {
  const {
    cimento, setCimento,
    agua, setAgua,
    aditivo, setAditivo,
    brita2, setBrita2,
    brita1, setBrita1,
    brita0, setBrita0,
    areiaGrossa, setAreiaGrossa,
    areiaMedia, setAreiaMedia,
    areiaFina, setAreiaFina,
    setStep,
  } = useConcrete();

  const handleMaterialChange = (
    mat: Material,
    setMat: (m: Material) => void,
    field: keyof Material,
    value: any
  ) => {
    setMat({ ...mat, [field]: value });
  };

  const handleAditChange = (field: string, value: any) => {
    setAditivo({ ...aditivo, [field]: value });
  };

  // Helper to render material row
  const renderMaterialRow = (
    mat: Material,
    setMat: (m: Material) => void,
    isOptional = false
  ) => {
    return (
      <tr className={`border-b border-slate-100 hover:bg-slate-50/40 transition-colors ${!mat.active && isOptional ? 'opacity-35' : ''}`}>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            {isOptional && (
              <input
                type="checkbox"
                className="w-4.5 h-4.5 border-slate-200 rounded text-indigo-600 focus:ring-indigo-100 transition-all cursor-pointer"
                checked={mat.active}
                onChange={(e) => handleMaterialChange(mat, setMat, 'active', e.target.checked)}
              />
            )}
            <span className="font-semibold text-slate-800 text-sm">{mat.nome}</span>
          </div>
        </td>
        <td className="py-3.5 px-4">
          <input
            type="number"
            disabled={!mat.active}
            className="w-36 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
            value={mat.massaEspec}
            onChange={(e) => handleMaterialChange(mat, setMat, 'massaEspec', Number(e.target.value))}
          />
        </td>
        <td className="py-3.5 px-4">
          <input
            type="number"
            step="0.001"
            disabled={!mat.active}
            className="w-36 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-right focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
            value={mat.custo}
            onChange={(e) => handleMaterialChange(mat, setMat, 'custo', Number(e.target.value))}
          />
        </td>
      </tr>
    );
  };

  const isFormValid = () => {
    const hasSand = areiaFina.active || areiaMedia.active || areiaGrossa.active;
    const hasGravel = brita0.active || brita1.active || brita2.active;
    if (!hasSand || !hasGravel) return false;

    if (cimento.massaEspec <= 0 || cimento.custo < 0) return false;
    if (agua.massaEspec <= 0 || agua.custo < 0) return false;

    const mats = [brita2, brita1, brita0, areiaGrossa, areiaMedia, areiaFina];
    for (const m of mats) {
      if (m.active && (m.massaEspec <= 0 || m.custo < 0)) return false;
    }

    if (aditivo.ativo && (aditivo.massaEspec <= 0 || aditivo.custo < 0 || aditivo.dosagemPadrao < 0)) return false;

    return true;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">1. Cadastro de Materiais</h2>
        <p className="text-slate-500 text-sm mt-1">
          Defina as propriedades físicas (Massa Específica em kg/m³) e comerciais (Custo Unitário em R$/kg) de cada componente da dosagem.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">Tabela de Agregados e Aglomerantes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-bold tracking-wider">
                <th className="py-3 px-4 font-bold text-[10px]">Material</th>
                <th className="py-3 px-4 font-bold text-[10px]">Massa Específica (kg/m³)</th>
                <th className="py-3 px-4 font-bold text-[10px]">Custo Unitário (R$/kg)</th>
              </tr>
            </thead>
            <tbody>
              {renderMaterialRow(cimento, setCimento)}
              {renderMaterialRow(agua, setAgua)}
              
              <tr className="bg-slate-50/40 border-y border-slate-100">
                <td colSpan={3} className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agregados Graúdos (Britas)</td>
              </tr>
              {renderMaterialRow(brita2, setBrita2, true)}
              {renderMaterialRow(brita1, setBrita1, true)}
              {renderMaterialRow(brita0, setBrita0, true)}

              <tr className="bg-slate-50/40 border-y border-slate-100">
                <td colSpan={3} className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agregados Miúdos (Areias)</td>
              </tr>
              {renderMaterialRow(areiaGrossa, setAreiaGrossa, true)}
              {renderMaterialRow(areiaMedia, setAreiaMedia, true)}
              {renderMaterialRow(areiaFina, setAreiaFina, true)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADITIVO QUÍMICO */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aditivo Químico</h3>
            <span className="text-[10px] text-slate-400 font-semibold">(Plastificante / Superplastificante)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={aditivo.ativo}
              onChange={(e) => handleAditChange('ativo', e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ml-2 text-xs font-bold text-slate-500">{aditivo.ativo ? 'Ativo' : 'Inativo'}</span>
          </label>
        </div>

        {aditivo.ativo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-5 bg-slate-50/40 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Nome do Aditivo</label>
              <input
                type="text"
                className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all"
                value={aditivo.nome}
                onChange={(e) => handleAditChange('nome', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Massa Específica (kg/m³)</label>
              <input
                type="number"
                className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all text-right font-mono"
                value={aditivo.massaEspec}
                onChange={(e) => handleAditChange('massaEspec', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Custo Unitário (R$/kg)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all text-right font-mono"
                value={aditivo.custo}
                onChange={(e) => handleAditChange('custo', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Dosagem Padrão (% Cimento)</label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all text-right font-mono"
                value={aditivo.dosagemPadrao}
                onChange={(e) => handleAditChange('dosagemPadrao', Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      {!isFormValid() && (
        <div className="flex items-start gap-3 border border-amber-100 bg-amber-50/50 rounded-xl p-4 text-amber-800">
          <span className="text-xs font-bold">
            ⚠️ Configuração Inválida: Certifique-se de ativar pelo menos uma Areia e uma Brita. Os valores de Massa Específica devem ser maiores que zero.
          </span>
        </div>
      )}

      {/* Botões de Navegação */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => isFormValid() && setStep(2)}
          disabled={!isFormValid()}
          className="bg-indigo-600 hover:bg-indigo-755 active:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-all shadow-sm hover:-translate-y-px active:translate-y-0 disabled:opacity-45 disabled:pointer-events-none cursor-pointer uppercase tracking-wider"
        >
          Avançar para Granulometria
        </button>
      </div>
    </div>
  );
};
