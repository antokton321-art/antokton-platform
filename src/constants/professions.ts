export const PROFESSIONS = [
  'Shofer',
  'Ndërtim',
  'Pastrues',
  'Kuzhinier',
  'Kamarier',
  'Magazinier',
  'Mekanik',
  'Elektricist',
  'Hidraulik',
  'Berber',
  'Kasier',
  'Shites',
  'Sanitare',
  'IT/Teknologji',
  'Kontabilist',
  'Mësues',
  'Translator',
  'Grafikë',
  'Fotograf',
  'Tjetër'
] as const;

export type Profession = (typeof PROFESSIONS)[number];