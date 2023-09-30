import type { IScryfallColor } from 'scryfall-types';

export type colorShort = 'w' | 'u' | 'b' | 'g' | 'r';
export type manaTypeShort = colorShort | 'c';
export type colorShortUpper = 'W' | 'U' | 'B' | 'G' | 'R';
export type manaTypeShortUpper = colorShortUpper | 'C';
export type colorFull = 'white' | 'blue' | 'black' | 'green' | 'red';
export type manaTypeFull = colorFull | 'colorless';
export type colorFullUpeer = 'White' | 'Blue' | 'Black' | 'Green' | 'Red';
export type manaTypeFullUpeer = colorFullUpeer | 'Colorless';
export type color = colorShort | colorShortUpper | colorFull | colorFullUpeer;
export type manaType = manaTypeShort | manaTypeShortUpper | manaTypeFull | manaTypeFullUpeer;

export const colorFix = (_color: string): manaTypeShort | undefined => {
  const color = _color.toLowerCase();
  switch (color) {
    case 'w':
    case 'white':
      return 'w';
    case 'u':
    case 'blue':
      return 'u';
    case 'b':
    case 'black':
      return 'b';
    case 'g':
    case 'green':
      return 'g';
    case 'r':
    case 'red':
      return 'r';
    case 'c':
    case 'colorless':
      return 'c';
  }
};

export type twoColor = 'wu' | 'ub' | 'br' | 'rg' | 'gw' | 'wb' | 'ur' | 'bg' | 'rw' | 'gu';
export type twoColorUpper = 'WU' | 'UB' | 'BR' | 'RG' | 'GW' | 'WB' | 'UR' | 'BG' | 'RW' | 'GU';
export type twoColorSlashed = twoColor extends `${infer A}${infer B}` ? `${A}/${B}` : never;
export type twoColorUppperSlashed = twoColorUpper extends `${infer A}${infer B}` ? `${A}/${B}` : never;
export type twoColorFull = `${colorFull},${colorFull}` | `${colorFull}/${colorFull}`;
export type twoColorFullUpper = `${colorFullUpeer},${colorFullUpeer}` | `${colorFullUpeer}/${colorFullUpeer}`;
export type twoColorAll =
  | twoColor
  | twoColorUpper
  | twoColorSlashed
  | twoColorUppperSlashed
  | twoColorFull
  | twoColorFullUpper;

export type monoHybrid = '2w' | '2u' | '2b' | '2r' | '2g';
export type monoHybridUpper = '2W' | '2U' | '2B' | '2R' | '2G';
export type monoHybridSlash = monoHybrid extends `${infer A}${infer B}` ? `${A}/${B}` : never;
export type monoHybridUpperSlash = monoHybridUpper extends `${infer A}${infer B}` ? `${A}/${B}` : never;
export type monoHybridAll = monoHybrid | monoHybridUpper | monoHybridSlash | monoHybridUpperSlash;

export type phyrexian = `${colorShort | twoColor}p`;
export type phyrexianUpper = `${colorShortUpper | twoColorUpper}P`;
export type phyrexianSlashed = `${colorShort | twoColorSlashed}/p`;
export type phyrexianUpperSlashed = `${colorShortUpper | twoColorUppperSlashed}/P`;
export type phyrexianAll = phyrexian | phyrexianUpper | phyrexianSlashed | phyrexianUpperSlashed;

export const phyrexiaFix = (str: string) => {
  return str === 'p' || str === 'P' || str === 'phyrexia' || str === 'Phyrexia' ? 'p' : undefined;
};
export const twoColorFix = (
  _color: string | [string, string] | [string, string, string]
): twoColor | monoHybrid | phyrexian | undefined => {
  if (typeof _color === 'string') {
    if (_color.indexOf('/') !== -1 && _color.indexOf(',') !== -1 && (_color.length === 2 || _color.length === 3))
      return twoColorFix([..._color] as [string, string] | [string, string, string]);
    const colors = _color.match(/^(.*)[\n\r\s\t]*[,/][\n\r\s\t]*(.*)$/)?.slice(1);
    if (colors?.length === 2 || colors?.length === 3)
      return twoColorFix(colors as [string, string] | [string, string, string]);
    return undefined;
  }
  const set = new Set(
    [
      _color[0] === '2' ? '2' : colorFix(_color[0]) || phyrexiaFix(_color[0]),
      _color[1] === '2' ? '2' : colorFix(_color[1]) || phyrexiaFix(_color[1]),
      _color[2] !== undefined ? (_color[2] === '2' ? '2' : colorFix(_color[2])) || phyrexiaFix(_color[2]) : undefined
    ].filter((e) => e !== undefined)
  );
  if (set.has('p')) {
    if (_color.length === 3) {
      set.delete('p');
      return (twoColorFix([...set] as [string, string] | [string, string, string]) + 'p') as phyrexian;
    }
    set.delete('p');
    switch ([...set][0]) {
      case 'w':
        return 'wp';
      case 'u':
        return 'up';
      case 'b':
        return 'bp';
      case 'r':
        return 'rp';
      case 'g':
        return 'gp';
      default:
        return undefined;
    }
  }
  if (set.has('2')) {
    if (set.has('w')) return '2w';
    if (set.has('u')) return '2u';
    if (set.has('b')) return '2b';
    if (set.has('r')) return '2r';
    if (set.has('g')) return '2g';
  }
  if (set.has('w')) {
    if (set.has('u')) return 'wu';
    if (set.has('b')) return 'wb';
    if (set.has('r')) return 'rw';
    if (set.has('g')) return 'gw';
  }
  if (set.has('u')) {
    if (set.has('b')) return 'ub';
    if (set.has('r')) return 'ur';
    if (set.has('g')) return 'gu';
  }
  if (set.has('b')) {
    if (set.has('r')) return 'br';
    if (set.has('g')) return 'bg';
  }
  if (set.has('r') && set.has('g')) return 'rg';
  return undefined;
};

export type numericStrict =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '100'
  | '1000000';
export const checkNumericStrict = (str: string): str is numericStrict => {
  switch (str) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
    case '11':
    case '12':
    case '13':
    case '14':
    case '15':
    case '16':
    case '17':
    case '18':
    case '19':
    case '20':
    case '100':
    case '1000000':
      return true;
    default:
      return false;
  }
};
export type numericHalf = '1-2' | '1/2';
export const numericHalfFix = (_half: string): numericHalf | undefined => {
  switch (_half) {
    case '1-2':
    case '1/2':
      return '1-2';
  }
};
export type numericInfinity = 'infinity' | 'Infinity' | 'inf' | 'Inf' | '∞';
export const numericInfinityFix = (_inf: string): numericInfinity | undefined => {
  const inf = _inf.toLowerCase();
  switch (inf) {
    case 'infinity':
    case 'Infinity':
    case 'inf':
    case 'Inf':
    case '∞':
      return 'infinity';
  }
};

export type numericGeneric = 'x' | 'y' | 'z';
export type numericGenericUpper = 'X' | 'Y' | 'Z';
export const numericGenericFix = (_gen: string): numericGeneric | undefined => {
  const gen = _gen.toLowerCase();
  if (gen === 'x' || gen === 'y' || gen === 'z') return gen;
};

export type snowMana = 's' | 'S' | 'snow' | 'Snow';
export const snowManaFix = (str: string): str is snowMana => {
  if (str === 's' || str === 'S' || str === 'snow' || str === 'Snow') return true;
  return false;
};

export type allManaSymbol =
  | manaType
  | twoColorAll
  | monoHybridAll
  | phyrexianAll
  | numericStrict
  | numericHalf
  | numericInfinity
  | numericGeneric
  | numericGenericUpper
  | snowMana;

export const fixMana = (str: string) => {
  if (colorFix(str)) return colorFix(str);
  if (twoColorFix(str)) return twoColorFix(str);
  if (checkNumericStrict(str)) return str;
  if (numericHalfFix(str)) return numericHalfFix(str);
  if (numericInfinityFix(str)) return numericInfinityFix(str);
  if (numericGenericFix(str)) return numericGenericFix(str);
  if (snowManaFix(str)) return 's';
  return undefined;
};

export const fixColor = (str: IScryfallColor[]) => {
  if (str.length === 0) return 'c';
  if (str.length === 5) return 'wubrg';
  const set = new Set(str);
  if (str.length === 4) {
    if (!set.has('W')) return 'rgwu';
    if (!set.has('U')) return 'brgw';
    if (!set.has('B')) return 'rgwu';
    if (!set.has('R')) return 'gwub';
    if (!set.has('G')) return 'wubr';
    return undefined;
  } else if (str.length === 3) {
    if (!set.has('W')) {
      if (!set.has('U')) return 'brg';
      if (!set.has('B')) return 'gur';
      if (!set.has('R')) return 'bgu';
      if (!set.has('G')) return 'ubr';
      return undefined;
    }
    if (!set.has('U')) {
      if (!set.has('B')) return 'rgw';
      if (!set.has('R')) return 'wbg';
      if (!set.has('G')) return 'rwb';
      return undefined;
    }
    if (!set.has('B')) {
      if (!set.has('R')) return 'gwu';
      if (!set.has('G')) return 'urw';
      return undefined;
    }
    if (!set.has('R') && !set.has('G')) return 'wub';
    return undefined;
  } else if (str.length === 2) {
    if (set.has('W')) {
      if (set.has('U')) return 'wu';
      if (set.has('B')) return 'wb';
      if (set.has('R')) return 'rw';
      if (set.has('G')) return 'gw';
      return undefined;
    }
    if (set.has('U')) {
      if (set.has('B')) return 'ub';
      if (set.has('R')) return 'ur';
      if (set.has('G')) return 'gu';
      return undefined;
    }
    if (set.has('B')) {
      if (set.has('R')) return 'br';
      if (set.has('G')) return 'bg';
    }
    if (set.has('R') && set.has('G')) return 'rg';
    return undefined;
  } else {
    if (set.has('W')) return 'w';
    if (set.has('U')) return 'u';
    if (set.has('B')) return 'b';
    if (set.has('R')) return 'r';
    if (set.has('G')) return 'g';
    return undefined;
  }
  return undefined;
};
