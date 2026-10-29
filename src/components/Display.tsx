import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatExpression, formatForDisplay } from '../logic/calculator';
import { colors } from './theme';

interface DisplayProps {
  value: string;
  pending: string;
}

export function Display({ value, pending }: DisplayProps) {
  const isError = value === 'Error';

  return (
    <View style={styles.container}>
      <Text style={styles.pending} numberOfLines={1} testID="pending">
        {pending ? formatExpression(pending) : ' '}
      </Text>
      <Text
        style={[styles.value, isError && styles.error]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
        testID="display"
        accessibilityLiveRegion="polite"
      >
        {formatForDisplay(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'flex-end',
  },
  pending: {
    fontSize: 18,
    color: colors.inkSoft,
    fontVariant: ['tabular-nums'],
  },
  value: {
    fontSize: 60,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: colors.error,
  },
});
