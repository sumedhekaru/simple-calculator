import { calculate, initialState } from '../calculator';

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
