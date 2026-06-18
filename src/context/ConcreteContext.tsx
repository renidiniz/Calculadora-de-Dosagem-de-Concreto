import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Sieve {
  size: number;
  label: string;
  isNormal: boolean;
}

export const SIEVES: Sieve[] = [
  { size: 75.0, label: '75 mm (3")', isNormal: true },
  { size: 63.0, label: '63 mm (2.1/2")', isNormal: false },
  { size: 50.0, label: '50 mm (2")', isNormal: false },
  { size: 37.5, label: '37.5 mm (1.1/2")', isNormal: true },
  { size: 25.0, label: '25 mm (1")', isNormal: false },
  { size: 19.0, label: '19 mm (3/4")', isNormal: true },
  { size: 12.5, label: '12.5 mm (1/2")', isNormal: false },
  { size: 9.5, label: '9.5 mm (3/8")', isNormal: true },
  { size: 6.3, label: '6.3 mm (1/4")', isNormal: false },
  { size: 4.8, label: '4.8 mm (#4)', isNormal: true },
  { size: 2.4, label: '2.4 mm (#8)', isNormal: true },
  { size: 1.2, label: '1.2 mm (#16)', isNormal: true },
  { size: 0.6, label: '0.6 mm (#30)', isNormal: true },
  { size: 0.3, label: '0.3 mm (#50)', isNormal: true },
  { size: 0.15, label: '0.15 mm (#100)', isNormal: true },
  { size: 0.075, label: '0.075 mm (#200)', isNormal: false },
  { size: 0.0375, label: '0.0375 mm', isNormal: false },
];

export interface SieveData {
  [sieveSize: string]: number; // mass retida in grams
}

export interface Material {
  nome: string;
  massaEspec: number; // kg/m³
  custo: number; // R$/kg
  active: boolean;
  sieveData: SieveData;
  massaTotalAmostra: number;
}

export interface Aditivo {
  nome: string;
  massaEspec: number;
  custo: number;
  dosagemPadrao: number; // % sobre peso de cimento
  ativo: boolean;
}

export interface PackingRow {
  propA: number; // % component A
  propB: number; // % component B
  pesoCheio: number; // kg
}

export interface PackingTable {
  id: number;
  title: string;
  compAName: string;
  compBName: string;
  rows: PackingRow[];
  optimalPropA: number; // % optimal A
  optimalPropB: number; // % optimal B
  optimalDensity: number; // kg/m³
  optimalVoids: number; // %
}

export interface CylinderTest {
  pVazio: number;
  pCheio: number;
}

export interface TrialMix {
  ac: number;
  m: number;
  fc: number;
  cyl1: CylinderTest;
  cyl2: CylinderTest;
  calculatedDensity?: number; // average fresh density
  calculatedC?: number; // calculated cement consumption (g / (1+m+ac))
}

interface RegressionResults {
  // Abrams: log10(fc) = B15 + B14 * (a/c)
  abramsSlope: number; // B14
  abramsIntercept: number; // B15
  r2Abrams: number;
  
  // Lyse: m = A + B * a/c
  lyseSlope: number; // Slope
  lyseIntercept: number; // Intercept
  r2Lyse: number;

  // Molinari: m = Slope * (1/C) + Intercept
  molinariSlope: number;
  molinariIntercept: number;
  r2Molinari: number;
}

interface ConcreteContextType {
  step: number;
  setStep: (step: number) => void;

  // Materials
  cimento: Material;
  setCimento: (m: Material) => void;
  agua: Material;
  setAgua: (m: Material) => void;
  aditivo: Aditivo;
  setAditivo: (a: Aditivo) => void;

  // Aggregates (6 fixed slots)
  brita2: Material;
  setBrita2: (m: Material) => void;
  brita1: Material;
  setBrita1: (m: Material) => void;
  brita0: Material;
  setBrita0: (m: Material) => void;
  areiaGrossa: Material;
  setAreiaGrossa: (m: Material) => void;
  areiaMedia: Material;
  setAreiaMedia: (m: Material) => void;
  areiaFina: Material;
  setAreiaFina: (m: Material) => void;

  // Active state lists
  activeAggregates: { [key: string]: Material };
  
  // Granulometry custom proportions
  propSands: { grossa: number; media: number; fina: number };
  setPropSands: (p: { grossa: number; media: number; fina: number }) => void;
  propGravels: { brita2: number; brita1: number; brita0: number };
  setPropGravels: (p: { brita2: number; brita1: number; brita0: number }) => void;

  // Packing
  pesoVazioRecipiente: number;
  setPesoVazioRecipiente: (w: number) => void;
  volRecipiente: number;
  setVolRecipiente: (v: number) => void;
  packingTables: PackingTable[];
  setPackingTableRows: (tableId: number, rows: PackingRow[]) => void;
  
  // Final aggregate fractions relative to TOTAL AGGREGATE
  finalFractions: {
    brita2: number;
    brita1: number;
    brita0: number;
    areiaGrossa: number;
    areiaMedia: number;
    areiaFina: number;
  };

  // Trial Mixes (3t or 4t)
  numMixes: 3 | 4;
  setNumMixes: (n: 3 | 4) => void;
  trialMixes: TrialMix[];
  setTrialMixes: (mixes: TrialMix[]) => void;
  cylinderDiameter: number; // cm
  setCylinderDiameter: (d: number) => void;
  cylinderHeight: number; // cm
  setCylinderHeight: (h: number) => void;
  regression: RegressionResults | null;

  // Final Target Dosage
  fcj: number;
  setFcj: (f: number) => void;
  alpha: number; // Mortar content %
  setAlpha: (a: number) => void;
  dosagemVolumeAjustado: number;
  setDosagemVolumeAjustado: (v: number) => void;
  dosagemTipoAjuste: 'm3' | 'betoneira' | 'saco';
  setDosagemTipoAjuste: (t: 'm3' | 'betoneira' | 'saco') => void;

  // Helpers
  calculateGranulometry: (sieveData: SieveData) => {
    totalMass: number;
    retidaSimples: { [key: string]: number };
    retidaAcumulada: { [key: string]: number };
    passanteAcumulada: { [key: string]: number };
    mf: number;
    dmc: number;
  };
  getMesclaGranulometry: (isSand: boolean) => {
    acumulada: { [key: string]: number };
    passante: { [key: string]: number };
    mf: number;
    dmc: number;
  };
}

const ConcreteContext = createContext<ConcreteContextType | undefined>(undefined);

export const ConcreteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);

  // Cimento e Aditivos
  const [cimento, setCimento] = useState<Material>({
    nome: 'Cimento CP II-F-32',
    massaEspec: 3100,
    custo: 0.50, // R$/kg
    active: true,
    sieveData: {},
    massaTotalAmostra: 0,
  });
  const [agua, setAgua] = useState<Material>({
    nome: 'Água',
    massaEspec: 1000,
    custo: 0.0,
    active: true,
    sieveData: {},
    massaTotalAmostra: 0,
  });
  const [aditivo, setAditivo] = useState<Aditivo>({
    nome: 'Aditivo Plastificante',
    massaEspec: 1150,
    custo: 10.0,
    dosagemPadrao: 0.4,
    ativo: true,
  });

  // 6 Agregados Fixos
  const [brita2, setBrita2] = useState<Material>({
    nome: 'Brita 2',
    massaEspec: 3000,
    custo: 0.038,
    active: true,
    massaTotalAmostra: 2547.8,
    sieveData: { '75': 0, '63': 0, '50': 0, '37.5': 0, '31.5': 0, '25': 0, '19': 98.7, '12.5': 124, '9.5': 459.4, '6.3': 512, '4.8': 286.7, '2.4': 356, '1.2': 441, '0.6': 0, '0.3': 270, '0.15': 0, '0.075': 0, '0.0375': 0 }
  });
  const [brita1, setBrita1] = useState<Material>({
    nome: 'Brita 1',
    massaEspec: 2830,
    custo: 0.035,
    active: true,
    massaTotalAmostra: 2547.8,
    sieveData: { '75': 0, '63': 0, '50': 0, '37.5': 0, '31.5': 0, '25': 0, '19': 98.7, '12.5': 124, '9.5': 459.4, '6.3': 512, '4.8': 286.7, '2.4': 356, '1.2': 441, '0.6': 0, '0.3': 270, '0.15': 0, '0.075': 0, '0.0375': 0 }
  });
  const [brita0, setBrita0] = useState<Material>({
    nome: 'Brita 0',
    massaEspec: 2600,
    custo: 0.033,
    active: true,
    massaTotalAmostra: 2547.8,
    sieveData: { '75': 0, '63': 0, '50': 0, '37.5': 0, '31.5': 0, '25': 0, '19': 98.7, '12.5': 124, '9.5': 459.4, '6.3': 512, '4.8': 286.7, '2.4': 356, '1.2': 441, '0.6': 0, '0.3': 270, '0.15': 0, '0.075': 0, '0.0375': 0 }
  });
  const [areiaGrossa, setAreiaGrossa] = useState<Material>({
    nome: 'Areia Grossa',
    massaEspec: 2630,
    custo: 0.027,
    active: true,
    massaTotalAmostra: 359.5,
    sieveData: { '9.5': 14.5, '6.3': 41, '4.8': 71.5, '2.4': 116, '1.2': 64.5, '0.6': 52, '0.3': 0, '0.15': 0 }
  });
  const [areiaMedia, setAreiaMedia] = useState<Material>({
    nome: 'Areia Média',
    massaEspec: 2630,
    custo: 0.025,
    active: true,
    massaTotalAmostra: 580.0,
    sieveData: { '4.8': 7.5, '2.4': 53, '1.2': 101.5, '0.6': 103, '0.3': 209, '0.15': 94.5, '0.075': 9.5, '0.0375': 2 }
  });
  const [areiaFina, setAreiaFina] = useState<Material>({
    nome: 'Areia Fina',
    massaEspec: 2630,
    custo: 0.023,
    active: true,
    massaTotalAmostra: 562.5,
    sieveData: { '0.3': 13, '0.15': 408, '0.075': 140.5, '0.0375': 1 }
  });

  const activeAggregates = {
    brita2, brita1, brita0, areiaGrossa, areiaMedia, areiaFina
  };

  // Proporções manuais para curvas combinadas no Passo 2 (Peneiramento)
  const [propSands, setPropSands] = useState({ grossa: 35, media: 40, fina: 25 });
  const [propGravels, setPropGravels] = useState({ brita2: 0, brita1: 25, brita0: 75 });

  // Recipiente e Vazios
  const [pesoVazioRecipiente, setPesoVazioRecipiente] = useState(3.915); // kg
  const [volRecipiente, setVolRecipiente] = useState(15.625); // L

  // 5 Tabelas de empacotamento em cascata preenchidas com os pesos da planilha
  const [packingTables, setPackingTables] = useState<PackingTable[]>([
    {
      id: 1,
      title: 'Determinação da massa unitária compactada da Brita 2 e Brita 1',
      compAName: 'Brita 2',
      compBName: 'Brita 1',
      optimalPropA: 70, optimalPropB: 30, optimalDensity: 2949, optimalVoids: 44.29,
      rows: [
        { propA: 100, propB: 0, pesoCheio: 28.520 },
        { propA: 90, propB: 10, pesoCheio: 28.635 },
        { propA: 80, propB: 20, pesoCheio: 29.140 },
        { propA: 70, propB: 30, pesoCheio: 29.585 },
        { propA: 65, propB: 35, pesoCheio: 28.600 },
        { propA: 60, propB: 40, pesoCheio: 29.300 },
        { propA: 50, propB: 50, pesoCheio: 29.024 },
        { propA: 40, propB: 60, pesoCheio: 28.635 },
        { propA: 30, propB: 70, pesoCheio: 28.000 },
        { propA: 20, propB: 80, pesoCheio: 28.000 },
        { propA: 0, propB: 100, pesoCheio: 28.000 }
      ]
    },
    {
      id: 2,
      title: 'Determinação da massa unitária compactada da Brita 2/Brita 1 e Brita 0',
      compAName: 'B2/B1 Ótimo',
      compBName: 'Brita 0',
      optimalPropA: 65, optimalPropB: 35, optimalDensity: 2669.8, optimalVoids: 31.58,
      rows: [
        { propA: 100, propB: 0, pesoCheio: 29.545 },
        { propA: 90, propB: 10, pesoCheio: 31.230 },
        { propA: 80, propB: 20, pesoCheio: 32.356 },
        { propA: 70, propB: 30, pesoCheio: 32.998 },
        { propA: 65, propB: 35, pesoCheio: 33.455 },
        { propA: 60, propB: 40, pesoCheio: 31.556 },
        { propA: 55, propB: 45, pesoCheio: 33.200 },
        { propA: 50, propB: 50, pesoCheio: 32.500 },
        { propA: 40, propB: 60, pesoCheio: 31.300 },
        { propA: 30, propB: 70, pesoCheio: 32.567 },
        { propA: 20, propB: 80, pesoCheio: 32.456 }
      ]
    },
    {
      id: 3,
      title: 'Determinação da massa unitária compactada da Brita 2/Brita 1/Brita 0 e Areia Grossa',
      compAName: 'B2/B1/B0 Ótimo',
      compBName: 'Areia Grossa',
      optimalPropA: 50, optimalPropB: 50, optimalDensity: 2651.89, optimalVoids: 23.17,
      rows: [
        { propA: 100, propB: 0, pesoCheio: 29.545 },
        { propA: 90, propB: 10, pesoCheio: 31.230 },
        { propA: 80, propB: 20, pesoCheio: 32.356 },
        { propA: 70, propB: 30, pesoCheio: 32.998 },
        { propA: 65, propB: 35, pesoCheio: 33.455 },
        { propA: 60, propB: 40, pesoCheio: 33.556 },
        { propA: 55, propB: 45, pesoCheio: 35.750 },
        { propA: 50, propB: 50, pesoCheio: 32.800 },
        { propA: 40, propB: 60, pesoCheio: 33.750 },
        { propA: 30, propB: 70, pesoCheio: 34.567 },
        { propA: 20, propB: 80, pesoCheio: 32.456 }
      ]
    },
    {
      id: 4,
      title: 'Determinação da massa unitária compactada da Brita 2/Brita 1/Brita 0/Areia Grossa e Areia Média',
      compAName: 'Gravel/AG Ótimo',
      compBName: 'Areia Média',
      optimalPropA: 60, optimalPropB: 40, optimalDensity: 2644.23, optimalVoids: 22.05,
      rows: [
        { propA: 100, propB: 0, pesoCheio: 29.545 },
        { propA: 90, propB: 10, pesoCheio: 31.230 },
        { propA: 80, propB: 20, pesoCheio: 32.356 },
        { propA: 70, propB: 30, pesoCheio: 32.998 },
        { propA: 65, propB: 35, pesoCheio: 33.455 },
        { propA: 60, propB: 40, pesoCheio: 33.556 },
        { propA: 50, propB: 50, pesoCheio: 35.000 },
        { propA: 40, propB: 60, pesoCheio: 36.120 },
        { propA: 30, propB: 70, pesoCheio: 35.780 },
        { propA: 20, propB: 80, pesoCheio: 34.567 },
        { propA: 0, propB: 100, pesoCheio: 32.456 }
      ]
    },
    {
      id: 5,
      title: 'Determinação da massa unitária compactada da Brita 2/Brita 1/Brita 0/Areia Grossa/Areia Média e Areia Fina',
      compAName: 'Gravel/AG/AM Ótimo',
      compBName: 'Areia Fina',
      optimalPropA: 90, optimalPropB: 10, optimalDensity: 2642.81, optimalVoids: 19.58,
      rows: [
        { propA: 100, propB: 0, pesoCheio: 34.998 },
        { propA: 95, propB: 5, pesoCheio: 36.789 },
        { propA: 90, propB: 10, pesoCheio: 37.123 },
        { propA: 85, propB: 15, pesoCheio: 36.813 },
        { propA: 80, propB: 20, pesoCheio: 36.189 },
        { propA: 70, propB: 30, pesoCheio: 37.000 }
      ]
    }
  ]);

  const setPackingTableRows = (tableId: number, rows: PackingRow[]) => {
    setPackingTables(
      packingTables.map(t => (t.id === tableId ? { ...t, rows } : t))
    );
  };

  // Frações finais calculadas em cascata
  const [finalFractions, setFinalFractions] = useState({
    brita2: 0.225, brita1: 0.096, brita0: 1.287,
    areiaGrossa: 1.316, areiaMedia: 1.575, areiaFina: 0.5
  });

  // Passo 4: Traços piloto e cilindros
  const [numMixes, setNumMixes] = useState<3 | 4>(3);
  const [cylinderDiameter, setCylinderDiameter] = useState(10); // 10cm
  const [cylinderHeight, setCylinderHeight] = useState(20); // 20cm
  const [trialMixes, setTrialMixes] = useState<TrialMix[]>([
    {
      ac: 0.45, m: 3, fc: 57,
      cyl1: { pVazio: 1.9, pCheio: 5.5 },
      cyl2: { pVazio: 2.1, pCheio: 6.1 }
    },
    {
      ac: 0.57, m: 5, fc: 36,
      cyl1: { pVazio: 1.9, pCheio: 5.7 },
      cyl2: { pVazio: 2.1, pCheio: 5.95 }
    },
    {
      ac: 0.68, m: 7, fc: 15,
      cyl1: { pVazio: 1.9, pCheio: 5.65 },
      cyl2: { pVazio: 2.1, pCheio: 5.95 }
    }
  ]);
  const [regression, setRegression] = useState<RegressionResults | null>(null);

  // Passo 5: Traço final e redimensionamento
  const [fcj, setFcj] = useState(30.0);
  const [alpha, setAlpha] = useState(54.0); // Teor de argamassa (%)
  const [dosagemVolumeAjustado, setDosagemVolumeAjustado] = useState(150);
  const [dosagemTipoAjuste, setDosagemTipoAjuste] = useState<'m3' | 'betoneira' | 'saco'>('m3');

  // 1. Cascading Packing Calculations
  useEffect(() => {
    // Recipient Volume:
    const vol = volRecipiente;

    // Helper to calculate row calculations
    const getRowVoids = (pesoCheio: number, propA: number, propB: number, densA: number, densB: number) => {
      const netWeight = pesoCheio - pesoVazioRecipiente;
      const unitWtKgM3 = vol > 0 ? (netWeight / vol) * 1000 : 0;
      const blendDensity = (propA * densA + propB * densB) / 100;
      const voids = blendDensity > 0 ? (1 - (unitWtKgM3 / blendDensity)) * 100 : 0;
      return { unitWtKgM3, blendDensity, voids };
    };

    // Table 1: B2 vs B1
    let optA1 = 100, optB1 = 0, optDens1 = brita2.massaEspec, optVoids1 = 100;
    if (brita2.active && brita1.active) {
      const table = packingTables[0];
      table.rows.forEach(r => {
        const { blendDensity, voids } = getRowVoids(r.pesoCheio, r.propA, r.propB, brita2.massaEspec, brita1.massaEspec);
        if (voids < optVoids1) {
          optVoids1 = voids;
          optA1 = r.propA;
          optB1 = r.propB;
          optDens1 = blendDensity;
        }
      });
    } else if (brita1.active) {
      optA1 = 0; optB1 = 100; optDens1 = brita1.massaEspec; optVoids1 = 45; // average default
    } else if (brita2.active) {
      optA1 = 100; optB1 = 0; optDens1 = brita2.massaEspec; optVoids1 = 45;
    }

    // Table 2: B21 vs B0
    let optA2 = 100, optB2 = 0, optDens2 = optDens1, optVoids2 = optVoids1;
    if ((brita2.active || brita1.active) && brita0.active) {
      const table = packingTables[1];
      table.rows.forEach(r => {
        const { blendDensity, voids } = getRowVoids(r.pesoCheio, r.propA, r.propB, optDens1, brita0.massaEspec);
        if (voids < optVoids2) {
          optVoids2 = voids;
          optA2 = r.propA;
          optB2 = r.propB;
          optDens2 = blendDensity;
        }
      });
    } else if (brita0.active) {
      optA2 = 0; optB2 = 100; optDens2 = brita0.massaEspec; optVoids2 = 45;
    }

    // Table 3: B210 vs AG
    let optA3 = 100, optB3 = 0, optDens3 = optDens2, optVoids3 = optVoids2;
    if (areiaGrossa.active) {
      const table = packingTables[2];
      table.rows.forEach(r => {
        const { blendDensity, voids } = getRowVoids(r.pesoCheio, r.propA, r.propB, optDens2, areiaGrossa.massaEspec);
        if (voids < optVoids3) {
          optVoids3 = voids;
          optA3 = r.propA;
          optB3 = r.propB;
          optDens3 = blendDensity;
        }
      });
    }

    // Table 4: Gravel/AG vs AM
    let optA4 = 100, optB4 = 0, optDens4 = optDens3, optVoids4 = optVoids3;
    if (areiaMedia.active) {
      const table = packingTables[3];
      table.rows.forEach(r => {
        const { blendDensity, voids } = getRowVoids(r.pesoCheio, r.propA, r.propB, optDens3, areiaMedia.massaEspec);
        if (voids < optVoids4) {
          optVoids4 = voids;
          optA4 = r.propA;
          optB4 = r.propB;
          optDens4 = blendDensity;
        }
      });
    }

    // Table 5: Gravel/AG/AM vs AF
    let optA5 = 100, optB5 = 0, optDens5 = optDens4, optVoids5 = optVoids4;
    if (areiaFina.active) {
      const table = packingTables[4];
      table.rows.forEach(r => {
        const { blendDensity, voids } = getRowVoids(r.pesoCheio, r.propA, r.propB, optDens4, areiaFina.massaEspec);
        if (voids < optVoids5) {
          optVoids5 = voids;
          optA5 = r.propA;
          optB5 = r.propB;
          optDens5 = blendDensity;
        }
      });
    }

    // Back-calculate fractions of all 6 aggregates relative to TOTAL AGGREGATE
    // fractions:
    let wAF = areiaFina.active ? optB5 / 100 : 0;
    let wAM = areiaMedia.active ? (optB4 / 100) * (1 - wAF) : 0;
    let wAG = areiaGrossa.active ? (optB3 / 100) * (1 - wAF - wAM) : 0;
    let wB0 = brita0.active ? (optB2 / 100) * (1 - wAF - wAM - wAG) : 0;
    
    let wPrevGravel = 1 - wAF - wAM - wAG - wB0;
    let wB1 = brita1.active ? (optB1 / 100) * wPrevGravel : 0;
    let wB2 = brita2.active ? (optA1 / 100) * wPrevGravel : 0;

    // Normalize weights to sum exactly to 1.0 (handling roundoffs)
    const sum = wAF + wAM + wAG + wB0 + wB1 + wB2;
    if (sum > 0) {
      wAF /= sum;
      wAM /= sum;
      wAG /= sum;
      wB0 /= sum;
      wB1 /= sum;
      wB2 /= sum;
    }

    setFinalFractions({
      brita2: wB2,
      brita1: wB1,
      brita0: wB0,
      areiaGrossa: wAG,
      areiaMedia: wAM,
      areiaFina: wAF
    });

    // Update optimal indicators inside state tables to display to user
    setPackingTables(prev => prev.map(t => {
      if (t.id === 1) return { ...t, optimalPropA: optA1, optimalPropB: optB1, optimalDensity: optDens1, optimalVoids: optVoids1 };
      if (t.id === 2) return { ...t, optimalPropA: optA2, optimalPropB: optB2, optimalDensity: optDens2, optimalVoids: optVoids2 };
      if (t.id === 3) return { ...t, optimalPropA: optA3, optimalPropB: optB3, optimalDensity: optDens3, optimalVoids: optVoids3 };
      if (t.id === 4) return { ...t, optimalPropA: optA4, optimalPropB: optB4, optimalDensity: optDens4, optimalVoids: optVoids4 };
      if (t.id === 5) return { ...t, optimalPropA: optA5, optimalPropB: optB5, optimalDensity: optDens5, optimalVoids: optVoids5 };
      return t;
    }));

  }, [
    packingTables.map(t => t.rows.map(r => r.pesoCheio).join(',')).join('|'),
    volRecipiente,
    pesoVazioRecipiente,
    brita2.active, brita1.active, brita0.active,
    areiaGrossa.active, areiaMedia.active, areiaFina.active
  ]);

  // 2. Trial Mix calculations and Regressions
  useEffect(() => {
    // Cylinder Volume in m³
    // Vol = PI * D^2 * H / (4 * 1000000)
    const d = cylinderDiameter;
    const h = cylinderHeight;
    const volCilindro = (Math.PI * Math.pow(d, 2) * h) / 4000000;

    const nextMixes = trialMixes.map((mix, idx) => {
      if (idx >= numMixes) return mix;
      const dens1 = volCilindro > 0 ? (mix.cyl1.pCheio - mix.cyl1.pVazio) / volCilindro : 0;
      const dens2 = volCilindro > 0 ? (mix.cyl2.pCheio - mix.cyl2.pVazio) / volCilindro : 0;
      const avgDens = (dens1 + dens2) / 2;
      const calC = avgDens / (1 + mix.m + mix.ac);
      return {
        ...mix,
        calculatedDensity: Number(avgDens.toFixed(2)),
        calculatedC: Number(calC.toFixed(2))
      };
    });

    // Run Regressions if enough points are available
    const activePoints = nextMixes.slice(0, numMixes);
    
    // Regression helper
    const getRegression = (xs: number[], ys: number[]) => {
      const n = xs.length;
      const meanX = xs.reduce((a,b)=>a+b,0) / n;
      const meanY = ys.reduce((a,b)=>a+b,0) / n;
      let num = 0;
      let den = 0;
      for (let i = 0; i < n; i++) {
        num += (xs[i] - meanX) * (ys[i] - meanY);
        den += Math.pow(xs[i] - meanX, 2);
      }
      const slope = den !== 0 ? num / den : 0;
      const intercept = meanY - slope * meanX;

      let ssr = 0, sst = 0;
      for (let i = 0; i < n; i++) {
        const pred = intercept + slope * xs[i];
        ssr += Math.pow(ys[i] - pred, 2);
        sst += Math.pow(ys[i] - meanY, 2);
      }
      const r2 = sst > 0 ? 1 - (ssr / sst) : 0;

      return { slope, intercept, r2 };
    };

    // Fit Abrams: log10(fc) vs a/c
    const acs = activePoints.map(m => m.ac);
    const logFcs = activePoints.map(m => Math.log10(m.fc));
    const abramsReg = getRegression(acs, logFcs);

    // Fit Lyse: m vs a/c
    const ms = activePoints.map(m => m.m);
    const lyseReg = getRegression(acs, ms);

    // Fit Molinari: m vs 1/C
    const invCs = activePoints.map(m => m.calculatedC ? 1 / m.calculatedC : 0);
    const molinariReg = getRegression(invCs, ms);

    setRegression({
      abramsSlope: abramsReg.slope,
      abramsIntercept: abramsReg.intercept,
      r2Abrams: abramsReg.r2,
      lyseSlope: lyseReg.slope,
      lyseIntercept: lyseReg.intercept,
      r2Lyse: lyseReg.r2,
      molinariSlope: molinariReg.slope,
      molinariIntercept: molinariReg.intercept,
      r2Molinari: molinariReg.r2
    });

  }, [trialMixes, numMixes, cylinderDiameter, cylinderHeight]);

  // 3. Sieve Calculations (MF / DMC)
  const calculateGranulometry = (sieveData: SieveData) => {
    let totalMass = 0;
    const sortedSieves = [...SIEVES].sort((a,b)=>b.size - a.size);

    sortedSieves.forEach(s => {
      totalMass += sieveData[s.size.toString()] || 0;
    });
    totalMass += sieveData['fundo'] || 0;

    const retidaSimples: { [key: string]: number } = {};
    const retidaAcumulada: { [key: string]: number } = {};
    const passanteAcumulada: { [key: string]: number } = {};

    if (totalMass === 0) {
      sortedSieves.forEach(s => {
        const key = s.size.toString();
        retidaSimples[key] = 0;
        retidaAcumulada[key] = 0;
        passanteAcumulada[key] = 100;
      });
      return { totalMass, retidaSimples, retidaAcumulada, passanteAcumulada, mf: 0, dmc: 0 };
    }

    let accum = 0;
    sortedSieves.forEach(s => {
      const key = s.size.toString();
      const weight = sieveData[key] || 0;
      const simple = (weight / totalMass) * 100;
      retidaSimples[key] = Number(simple.toFixed(2));
      accum += weight;
      const accumPct = (accum / totalMass) * 100;
      retidaAcumulada[key] = Number(accumPct.toFixed(2));
      passanteAcumulada[key] = Number((100 - accumPct).toFixed(2));
    });

    // Módulo de finura (série normal)
    let normalSum = 0;
    sortedSieves.forEach(s => {
      if (s.isNormal) {
        normalSum += retidaAcumulada[s.size.toString()] || 0;
      }
    });
    const mf = Number((normalSum / 100).toFixed(2));

    // DMC
    let dmc = 0;
    const eligible = sortedSieves.filter(s => {
      const acc = retidaAcumulada[s.size.toString()] || 0;
      return acc <= 5.0;
    });
    if (eligible.length > 0) {
      dmc = eligible[eligible.length - 1].size;
    } else {
      dmc = sortedSieves[0].size;
    }

    return { totalMass, retidaSimples, retidaAcumulada, passanteAcumulada, mf, dmc };
  };

  // Weighted average of granulometry
  const getMesclaGranulometry = (isSand: boolean) => {
    const list = isSand ? [areiaGrossa, areiaMedia, areiaFina] : [brita2, brita1, brita0];
    const props = isSand 
      ? [propSands.grossa, propSands.media, propSands.fina] 
      : [propGravels.brita2, propGravels.brita1, propGravels.brita0];

    const combinedAcumulada: { [key: string]: number } = {};
    const combinedPassante: { [key: string]: number } = {};

    const calcs = list.map(m => calculateGranulometry(m.sieveData));

    SIEVES.forEach(s => {
      const key = s.size.toString();
      let weightedAccum = 0;
      calcs.forEach((c, idx) => {
        weightedAccum += (c.retidaAcumulada[key] || 0) * (props[idx] / 100);
      });
      combinedAcumulada[key] = Number(weightedAccum.toFixed(2));
      combinedPassante[key] = Number((100 - weightedAccum).toFixed(2));
    });

    let normalSum = 0;
    SIEVES.forEach(s => {
      if (s.isNormal) {
        normalSum += combinedAcumulada[s.size.toString()] || 0;
      }
    });
    const mf = Number((normalSum / 100).toFixed(2));

    let dmc = 0;
    const sorted = [...SIEVES].sort((a,b)=>b.size-a.size);
    const eligible = sorted.filter(s => {
      const acc = combinedAcumulada[s.size.toString()] || 0;
      return acc <= 5.0;
    });
    if (eligible.length > 0) {
      dmc = eligible[eligible.length - 1].size;
    } else {
      dmc = sorted[0].size;
    }

    return { acumulada: combinedAcumulada, passante: combinedPassante, mf, dmc };
  };

  return (
    <ConcreteContext.Provider
      value={{
        step, setStep,
        cimento, setCimento,
        agua, setAgua,
        aditivo, setAditivo,
        brita2, setBrita2,
        brita1, setBrita1,
        brita0, setBrita0,
        areiaGrossa, setAreiaGrossa,
        areiaMedia, setAreiaMedia,
        areiaFina, setAreiaFina,
        activeAggregates,
        propSands, setPropSands,
        propGravels, setPropGravels,
        pesoVazioRecipiente, setPesoVazioRecipiente,
        volRecipiente, setVolRecipiente,
        packingTables, setPackingTableRows,
        finalFractions,
        numMixes, setNumMixes,
        trialMixes, setTrialMixes,
        cylinderDiameter, setCylinderDiameter,
        cylinderHeight, setCylinderHeight,
        regression,
        fcj, setFcj,
        alpha, setAlpha,
        dosagemVolumeAjustado, setDosagemVolumeAjustado,
        dosagemTipoAjuste, setDosagemTipoAjuste,
        calculateGranulometry,
        getMesclaGranulometry
      }}
    >
      {children}
    </ConcreteContext.Provider>
  );
};

export const useConcrete = () => {
  const context = useContext(ConcreteContext);
  if (!context) {
    throw new Error('useConcrete must be used within a ConcreteProvider');
  }
  return context;
};
