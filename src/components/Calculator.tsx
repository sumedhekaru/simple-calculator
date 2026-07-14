import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculate, initialState, Operator } from '../logic/calculator';
import { Button } from './Button';
import { Display } from './Display';

export function Calculator() {
  const [state, setState] = useState(initialState);

  const handleInput = useCallback((value: string) => {
    setState((prev) => calculate(prev, { type: 'INPUT', value }));
  }, []);

  const handleOperator = useCallback((value: Operator) => {
    setState((prev) => calculate(prev, { type: 'OPERATOR', value }));
  }, []);

  const handleEquals = useCallback(() => {
    setState((prev) => calculate(prev, { type: 'EQUALS' }));
  }, []);

  const handleClear = useCallback(() => {
    setState((prev) => calculate(prev, { type: 'CLEAR' }));
  }, []);

  const renderButton = (
    label: string,
    action: () => void,
    variant: 'default' | 'operator' | 'equals' | 'clear' = 'default',
    tall = false
  ) => (
    <Button key={label} label={label} onPress={action} variant={variant} tall={tall} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.displayContainer}>
        <Display value={state.display} />
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          {renderButton('C', handleClear, 'clear')}
          {renderButton('÷', () => handleOperator('/'), 'operator')}
          {renderButton('×', () => handleOperator('*'), 'operator')}
          {renderButton('−', () => handleOperator('-'), 'operator')}
        </View>

        <View style={styles.row}>
          {renderButton('7', () => handleInput('7'))}
          {renderButton('8', () => handleInput('8'))}
          {renderButton('9', () => handleInput('9'))}
          {renderButton('+', () => handleOperator('+'), 'operator')}
        </View>

        <View style={styles.body}>
          <View style={styles.bodyLeft}>
            <View style={styles.row}>
              {renderButton('4', () => handleInput('4'))}
              {renderButton('5', () => handleInput('5'))}
              {renderButton('6', () => handleInput('6'))}
            </View>

            <View style={styles.row}>
              {renderButton('1', () => handleInput('1'))}
              {renderButton('2', () => handleInput('2'))}
              {renderButton('3', () => handleInput('3'))}
            </View>

            <View style={styles.row}>
              {renderButton('0', () => handleInput('0'))}
              {renderButton('.', () => handleInput('.'))}
            </View>
          </View>

          <View style={styles.bodyRight}>
            {renderButton('=', handleEquals, 'equals', true)}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypad: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  body: {
    flexDirection: 'row',
  },
  bodyLeft: {
    flex: 3,
  },
  bodyRight: {
    flex: 1,
  },
});
