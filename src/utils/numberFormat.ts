const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg'
];

export function formatNumber(value: number): string {
  if (value < 1000) return Math.floor(value).toString();
  
  const tier = Math.floor(Math.log10(value) / 3);
  
  if (tier === 0) return Math.floor(value).toString();
  
  const suffix = SUFFIXES[tier];
  if (!suffix) return value.toExponential(2);
  
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;
  
  return scaled.toFixed(2) + suffix;
}
