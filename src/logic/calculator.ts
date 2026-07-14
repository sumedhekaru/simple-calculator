export type Operator = '+' | '-' | '*' | '/';

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operator: Operator | null;
  isNewEntry: boolean;
}

export type CalculatorAction =
  | { type: 'INPUT'; value: string }
  | { type: 'OPERATOR'; value: Operator }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' };

export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  isNewEntry: true,
};

const MAX_DECIMALS = 10;

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = parseFloat(value.toFixed(MAX_DECIMALS));
  return rounded.toString();
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

export function calculate(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  if (action.type === 'CLEAR') {
    return { ...initialState };
  }

  if (state.display === 'Error') {
    if (action.type === 'INPUT') {
      return {
        ...initialState,
        display: action.value === '.' ? '0.' : action.value,
        isNewEntry: false,
      };
    }
    if (action.type === 'OPERATOR') {
      return {
        ...initialState,
        previousValue: '0',
        operator: action.value,
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

    return {
      ...state,
      display: state.display + input,
    };
  }

  if (action.type === 'OPERATOR') {
    if (state.previousValue === null || state.isNewEntry) {
      return {
        ...state,
        previousValue: state.display,
        operator: action.value,
        isNewEntry: true,
      };
    }

    const result = applyOperation(
      state.previousValue,
      state.display,
      state.operator as Operator
    );

    return {
      ...state,
      display: result,
      previousValue: result,
      operator: action.value,
      isNewEntry: true,
    };
  }

  if (action.type === 'EQUALS') {
    if (state.previousValue === null || state.operator === null) {
      return { ...state, isNewEntry: true };
    }

    const result = applyOperation(
      state.previousValue,
      state.display,
      state.operator
    );

    return {
      ...initialState,
      display: result,
    };
  }

  return { ...state };
}
