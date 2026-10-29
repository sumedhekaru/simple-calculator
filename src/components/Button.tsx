import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

export type KeyVariant = 'digit' | 'function' | 'operator' | 'equals';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: KeyVariant;
  accessibilityLabel?: string;
  active?: boolean;
  lastColumn?: boolean;
  lastRow?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'digit',
  accessibilityLabel,
  active = false,
  lastColumn = false,
  lastRow = false,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.key,
        styles[variant],
        lastColumn && styles.lastColumn,
        lastRow && styles.lastRow,
        pressed && (variant === 'equals' ? styles.equalsPressed : styles.pressed),
      ]}
      onPress={onPress}
      testID={`button-${label}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
      {active && <View style={styles.activeMarker} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    flex: 1,
    aspectRatio: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  lastColumn: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  digit: {
    backgroundColor: colors.paper,
  },
  function: {
    backgroundColor: colors.functionKey,
  },
  operator: {
    backgroundColor: colors.operatorKey,
  },
  equals: {
    backgroundColor: colors.ink,
  },
  pressed: {
    backgroundColor: colors.rule,
  },
  equalsPressed: {
    backgroundColor: colors.inkSoft,
  },
  text: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  digitText: {},
  functionText: {
    fontSize: 20,
    fontWeight: '600',
  },
  operatorText: {
    fontSize: 30,
    fontWeight: '400',
  },
  equalsText: {
    fontSize: 30,
    color: colors.paper,
  },
  activeMarker: {
    position: 'absolute',
    left: '30%',
    right: '30%',
    bottom: 10,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
