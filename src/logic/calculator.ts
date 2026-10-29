export type Operator = '+' | '-' | '*' | '/';

export interface TapeEntry {
  id: number;
  expression: string;
  result: string;
}

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operator: Operator | null;
  isNewEntry: boolean;
  expression: string;
  tape: TapeEntry[];
}

export type CalculatorAction =
  | { type: 'INPUT'; value: string }
  | { type: 'OPERATOR'; value: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'PERCENT' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'CLEAR_TAPE' };

export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  isNewEntry: true,
  expression: '',
  tape: [],
};

const MAX_DECIMALS = 10;
export const MAX_TAPE_ENTRIES = 100;

export const OPERATOR_SYMBOLS: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = parseFloat(value.toFixed(MAX_DECIMALS));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
}

function normalizeEntry(value: string): string {
  if (value.endsWith('.')) {
    return value.slice(0, -1);
  }
  return value;
}

function applyOperation(
  left: string,
  right: string,
  operator: Operator
): string {
  const a = parseFloat(left);
  const b = parseFloat(right);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return 'Error';
  }

  let result: number;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        return 'Error';
      }
      result = a / b;
      break;
    default:
      return 'Error';
  }

  return formatNumber(result);
}

function addToTape(
  tape: TapeEntry[],
  expression: string,
  result: string
): TapeEntry[] {
  const id = tape.length > 0 ? tape[tape.length - 1].id + 1 : 1;
  return [...tape, { id, expression, result }].slice(-MAX_TAPE_ENTRIES);
}

export function calculate(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  if (action.type === 'CLEAR') {
    return { ...initialState, tape: state.tape };
  }

  if (action.type === 'CLEAR_TAPE') {
    return { ...state, tape: [] };
  }

  if (state.display === 'Error') {
    if (action.type === 'INPUT') {
      return {
        ...initialState,
        tape: state.tape,
        display: action.value === '.' ? '0.' : action.value,
        isNewEntry: false,
      };
    }
    if (action.type === 'OPERATOR') {
      return {
        ...initialState,
        tape: state.tape,
        previousValue: '0',
        operator: action.value,
        expression: `0 ${OPERATOR_SYMBOLS[action.value]}`,
        isNewEntry: true,
      };
    }
    return { ...state };
  }

  if (action.type === 'INPUT') {
    const input = action.value;

    if (state.isNewEntry) {
      if (input === '.') {
        return {
          ...state,
          display: '0.',
          isNewEntry: false,
        };
      }
      return {
        ...state,
        display: input,
        isNewEntry: false,
      };
    }

    if (input === '.') {
      if (state.display.includes('.')) {
        return { ...state };
      }
      return {
        ...state,
        display: state.display + '.',
      };
    }

    if (state.display === '0') {
      return {
        ...state,
        display: input,
      };
    }

    if (state.display === '-0') {
      return {
        ...state,
        display: '-' + input,
      };
    }

    return {
      ...state,
      display: state.display + input,
    };
  }

  if (action.type === 'BACKSPACE') {
    if (state.isNewEntry) {
      return { ...state };
    }
    const trimmed = state.display.slice(0, -1);
    const display = trimmed === '' || trimmed === '-' ? '0' : trimmed;
    return { ...state, display };
  }

  if (action.type === 'TOGGLE_SIGN') {
    if (state.isNewEntry && state.operator !== null) {
      return { ...state, display: '-0', isNewEntry: false };
    }
    if (normalizeEntry(state.display) === '0') {
      return { ...state };
    }
    const display = state.display.startsWith('-')
      ? state.display.slice(1)
      : '-' + state.display;
    return { ...state, display };
  }

  if (action.type === 'PERCENT') {
    const current = parseFloat(state.display);
    if (Number.isNaN(current)) {
      return { ...state };
    }
    const isAddOrSubtract =
      state.previousValue !== null &&
      (state.operator === '+' || state.operator === '-');
    const value = isAddOrSubtract
      ? (parseFloat(state.previousValue as string) * current) / 100
      : current / 100;
    return { ...state, display: formatNumber(value), isNewEntry: false };
  }

  if (action.type === 'OPERATOR') {
    const symbol = OPERATOR_SYMBOLS[action.value];

    if (state.previousValue === null) {
      const entry = normalizeEntry(state.display);
      return {
        ...state,
        display: entry,
        previousValue: entry,
        operator: action.value,
        expression: `${entry} ${symbol}`,
        isNewEntry: true,
      };
    }

    if (state.isNewEntry) {
      return {
        ...state,
        operator: action.value,
        expression: state.expression.replace(/\S+$/, symbol),
        isNewEntry: true,
      };
    }

    const entry = normalizeEntry(state.display);
    const result = applyOperation(
      state.previousValue,
      entry,
      state.operator as Operator
    );

    return {
      ...state,
      display: result,
      previousValue: result,
      operator: action.value,
      expression: `${state.expression} ${entry} ${symbol}`,
      isNewEntry: true,
    };
  }

  if (action.type === 'EQUALS') {
    if (state.previousValue === null || state.operator === null) {
      return { ...state, isNewEntry: true };
    }

    const entry = normalizeEntry(state.display);
    const result = applyOperation(state.previousValue, entry, state.operator);

    return {
      ...initialState,
      display: result,
      tape: addToTape(state.tape, `${state.expression} ${entry}`, result),
    };
  }

  return { ...state };
}

export function formatForDisplay(value: string): string {
  if (!/^-?\d*\.?\d*$/.test(value) || value === '' || value === '-') {
    return value;
  }
  const negative = value.startsWith('-');
  const unsigned = negative ? value.slice(1) : value;
  const [whole, fraction] = unsigned.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = fraction !== undefined ? `${grouped}.${fraction}` : grouped;
  return negative ? `-${body}` : body;
}

export function formatExpression(expression: string): string {
  return expression
    .split(' ')
    .map((token) => formatForDisplay(token))
    .join(' ');
}
