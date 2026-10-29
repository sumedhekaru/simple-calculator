import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculate, CalculatorAction, initialState, Operator } from '../logic/calculator';
import { Button, KeyVariant } from './Button';
import { Display } from './Display';
import { Tape } from './Tape';
import { colors, MAX_CONTENT_WIDTH } from './theme';

interface KeyDefinition {
  label: string;
  action: CalculatorAction;
  variant: KeyVariant;
  accessibilityLabel?: string;
}

const operatorKey = (label: string, value: Operator, accessibilityLabel: string): KeyDefinition => ({
  label,
  action: { type: 'OPERATOR', value },
  variant: 'operator',
  accessibilityLabel,
});

const digitKey = (label: string): KeyDefinition => ({
  label,
  action: { type: 'INPUT', value: label },
  variant: 'digit',
});

const KEY_ROWS: KeyDefinition[][] = [
  [
    { label: 'AC', action: { type: 'CLEAR' }, variant: 'function', accessibilityLabel: 'All clear' },
    { label: '⌫', action: { type: 'BACKSPACE' }, variant: 'function', accessibilityLabel: 'Delete' },
    { label: '%', action: { type: 'PERCENT' }, variant: 'function', accessibilityLabel: 'Percent' },
    operatorKey('÷', '/', 'Divide'),
  ],
  [digitKey('7'), digitKey('8'), digitKey('9'), operatorKey('×', '*', 'Multiply')],
  [digitKey('4'), digitKey('5'), digitKey('6'), operatorKey('−', '-', 'Subtract')],
  [digitKey('1'), digitKey('2'), digitKey('3'), operatorKey('+', '+', 'Add')],
  [
    digitKey('0'),
    { label: '.', action: { type: 'INPUT', value: '.' }, variant: 'digit', accessibilityLabel: 'Decimal point' },
    { label: '±', action: { type: 'TOGGLE_SIGN' }, variant: 'function', accessibilityLabel: 'Change sign' },
    { label: '=', action: { type: 'EQUALS' }, variant: 'equals', accessibilityLabel: 'Equals' },
  ],
];

export function Calculator() {
  const [state, setState] = useState(initialState);

  const dispatch = useCallback((action: CalculatorAction) => {
    setState((prev) => calculate(prev, action));
  }, []);

  const pending = state.operator ? state.expression : '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tapeArea}>
          <Tape entries={state.tape} onClear={() => dispatch({ type: 'CLEAR_TAPE' })} />
        </View>

        <Display value={state.display} pending={pending} />

        <View style={styles.keypad}>
          {KEY_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((key, columnIndex) => (
                <Button
                  key={key.label}
                  label={key.label}
                  variant={key.variant}
                  accessibilityLabel={key.accessibilityLabel}
                  onPress={() => dispatch(key.action)}
                  active={
                    key.action.type === 'OPERATOR' &&
                    state.isNewEntry &&
                    state.operator === key.action.value
                  }
                  lastColumn={columnIndex === row.length - 1}
                  lastRow={rowIndex === KEY_ROWS.length - 1}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
  },
  tapeArea: {
    flex: 1,
    paddingTop: 12,
  },
  keypad: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  row: {
    flexDirection: 'row',
  },
});
