import {
  calculate,
  formatExpression,
  formatForDisplay,
  initialState,
  MAX_TAPE_ENTRIES,
  Operator,
} from '../calculator';

describe('calculator logic', () => {
  it('starts with empty display', () => {
    expect(initialState.display).toBe('0');
    expect(initialState.previousValue).toBeNull();
    expect(initialState.operator).toBeNull();
  });

  it('inputs digits', () => {
    const state = calculate(initialState, { type: 'INPUT', value: '1' });
    expect(state.display).toBe('1');
  });

  it('chains digits', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'INPUT', value: '2' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    expect(state.display).toBe('123');
  });

  it('ignores leading zeros', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '0' });
    state = calculate(state, { type: 'INPUT', value: '0' });
    expect(state.display).toBe('0');
  });

  it('inputs decimal point once', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'INPUT', value: '.' });
    state = calculate(state, { type: 'INPUT', value: '5' });
    expect(state.display).toBe('1.5');

    state = calculate(state, { type: 'INPUT', value: '.' });
    expect(state.display).toBe('1.5');
  });

  it('starts new number with decimal point', () => {
    const state = calculate(initialState, { type: 'INPUT', value: '.' });
    expect(state.display).toBe('0.');
  });

  it('sets operator and continues input', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '5' });
    state = calculate(state, { type: 'OPERATOR', value: '+' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    expect(state.display).toBe('3');
    expect(state.previousValue).toBe('5');
    expect(state.operator).toBe('+');
  });

  it('calculates addition', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '2' });
    state = calculate(state, { type: 'OPERATOR', value: '+' });
    state = calculate(state, { type: 'INPUT', value: '2' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('4');
  });

  it('calculates subtraction', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '5' });
    state = calculate(state, { type: 'OPERATOR', value: '-' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('2');
  });

  it('calculates multiplication', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '4' });
    state = calculate(state, { type: 'OPERATOR', value: '*' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('12');
  });

  it('calculates division', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'INPUT', value: '0' });
    state = calculate(state, { type: 'OPERATOR', value: '/' });
    state = calculate(state, { type: 'INPUT', value: '2' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('5');
  });

  it('handles division by zero', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'OPERATOR', value: '/' });
    state = calculate(state, { type: 'INPUT', value: '0' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('Error');
  });

  it('chains operations', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '2' });
    state = calculate(state, { type: 'OPERATOR', value: '+' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    state = calculate(state, { type: 'OPERATOR', value: '*' });
    expect(state.display).toBe('5');
    expect(state.previousValue).toBe('5');
    expect(state.operator).toBe('*');
  });

  it('clears state', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '9' });
    state = calculate(state, { type: 'CLEAR' });
    expect(state.display).toBe('0');
    expect(state.previousValue).toBeNull();
    expect(state.operator).toBeNull();
  });

  it('limits decimal precision', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'OPERATOR', value: '/' });
    state = calculate(state, { type: 'INPUT', value: '3' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('0.3333333333');
  });

  it('replaces operator on repeated operator press', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '5' });
    state = calculate(state, { type: 'OPERATOR', value: '+' });
    state = calculate(state, { type: 'OPERATOR', value: '-' });
    expect(state.operator).toBe('-');
    expect(state.previousValue).toBe('5');
  });

  it('recovers from Error by pressing an operator', () => {
    let state = calculate(initialState, { type: 'INPUT', value: '1' });
    state = calculate(state, { type: 'OPERATOR', value: '/' });
    state = calculate(state, { type: 'INPUT', value: '0' });
    state = calculate(state, { type: 'EQUALS' });
    expect(state.display).toBe('Error');

    state = calculate(state, { type: 'OPERATOR', value: '+' });
    expect(state.display).toBe('0');
    expect(state.previousValue).toBe('0');
    expect(state.operator).toBe('+');
  });
});

function press(keys: string[], start = initialState) {
  return keys.reduce((state, key) => {
    if (key === '=') return calculate(state, { type: 'EQUALS' });
    if (key === 'C') return calculate(state, { type: 'CLEAR' });
    if (key === '<') return calculate(state, { type: 'BACKSPACE' });
    if (key === '%') return calculate(state, { type: 'PERCENT' });
    if (key === '±') return calculate(state, { type: 'TOGGLE_SIGN' });
    if (['+', '-', '*', '/'].includes(key)) {
      return calculate(state, { type: 'OPERATOR', value: key as Operator });
    }
    return calculate(state, { type: 'INPUT', value: key });
  }, start);
}

describe('paper tape', () => {
  it('starts empty', () => {
    expect(initialState.tape).toEqual([]);
  });

  it('records a finished calculation', () => {
    const state = press(['1', '2', '.', '5', '*', '4', '=']);
    expect(state.display).toBe('50');
    expect(state.tape).toEqual([{ id: 1, expression: '12.5 × 4', result: '50' }]);
  });

  it('records chained calculations left to right', () => {
    const state = press(['2', '+', '3', '*', '4', '=']);
    expect(state.tape[0]).toEqual({ id: 1, expression: '2 + 3 × 4', result: '20' });
  });

  it('records the replaced operator, not the first one', () => {
    const state = press(['9', '+', '-', '4', '=']);
    expect(state.tape[0].expression).toBe('9 − 4');
    expect(state.display).toBe('5');
  });

  it('keeps earlier entries in order with increasing ids', () => {
    const state = press(['1', '+', '1', '=', '5', '/', '2', '=']);
    expect(state.tape.map((e) => e.id)).toEqual([1, 2]);
    expect(state.tape[1]).toEqual({ id: 2, expression: '5 ÷ 2', result: '2.5' });
  });

  it('records errors', () => {
    const state = press(['1', '/', '0', '=']);
    expect(state.tape[0]).toEqual({ id: 1, expression: '1 ÷ 0', result: 'Error' });
  });

  it('keeps the tape when clearing the entry', () => {
    const state = press(['2', '*', '3', '=', '7', 'C']);
    expect(state.display).toBe('0');
    expect(state.tape).toHaveLength(1);
  });

  it('clears the tape on request', () => {
    const state = calculate(press(['2', '*', '3', '=']), { type: 'CLEAR_TAPE' });
    expect(state.tape).toEqual([]);
    expect(state.display).toBe('6');
  });

  it('does not record a bare equals', () => {
    const state = press(['7', '=']);
    expect(state.tape).toEqual([]);
  });

  it('caps the tape length', () => {
    let state = initialState;
    for (let i = 0; i < MAX_TAPE_ENTRIES + 5; i++) {
      state = press(['1', '+', '1', '='], state);
    }
    expect(state.tape).toHaveLength(MAX_TAPE_ENTRIES);
    expect(state.tape[state.tape.length - 1].id).toBe(MAX_TAPE_ENTRIES + 5);
  });

  it('drops a trailing decimal point from recorded numbers', () => {
    const state = press(['3', '.', '+', '2', '=']);
    expect(state.tape[0].expression).toBe('3 + 2');
  });
});

describe('backspace', () => {
  it('removes the last digit', () => {
    expect(press(['1', '2', '3', '<']).display).toBe('12');
  });

  it('falls back to zero', () => {
    expect(press(['7', '<']).display).toBe('0');
    expect(press(['5', '±', '<', '<']).display).toBe('0');
  });

  it('does not edit a result', () => {
    expect(press(['2', '+', '2', '=', '<']).display).toBe('4');
  });
});

describe('sign and percent', () => {
  it('toggles the sign of the entry', () => {
    expect(press(['8', '±']).display).toBe('-8');
    expect(press(['8', '±', '±']).display).toBe('8');
  });

  it('leaves zero alone', () => {
    expect(press(['±']).display).toBe('0');
  });

  it('starts a negative entry after an operator', () => {
    const state = press(['1', '0', '+', '±', '3', '=']);
    expect(state.display).toBe('7');
    expect(state.tape[0].expression).toBe('10 + -3');
  });

  it('converts a lone number to a percentage', () => {
    expect(press(['5', '0', '%']).display).toBe('0.5');
  });

  it('takes a percentage of the running total for + and −', () => {
    expect(press(['2', '0', '0', '+', '1', '0', '%', '=']).display).toBe('220');
    expect(press(['2', '0', '0', '-', '1', '0', '%', '=']).display).toBe('180');
  });

  it('uses a plain percentage for × and ÷', () => {
    expect(press(['2', '0', '0', '*', '1', '0', '%', '=']).display).toBe('20');
  });
});

describe('display formatting', () => {
  it('groups thousands', () => {
    expect(formatForDisplay('1234567.891')).toBe('1,234,567.891');
    expect(formatForDisplay('-1234')).toBe('-1,234');
    expect(formatForDisplay('999')).toBe('999');
  });

  it('keeps partial entries and errors intact', () => {
    expect(formatForDisplay('1000.')).toBe('1,000.');
    expect(formatForDisplay('Error')).toBe('Error');
  });

  it('formats every number in an expression', () => {
    expect(formatExpression('12500 × 4')).toBe('12,500 × 4');
  });
});
