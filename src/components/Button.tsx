import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'clear';
  tall?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'default',
  tall = false,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        tall && styles.tall,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      testID={`button-${label}`}
      accessibilityLabel={label}
    >
      <Text style={[styles.text, variant !== 'default' && styles[`${variant}Text`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {},
  defaultText: {},
  button: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tall: {
    aspectRatio: undefined,
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  operator: {
    backgroundColor: '#ff9f0a',
  },
  operatorText: {
    color: '#fff',
  },
  equals: {
    backgroundColor: '#ff9f0a',
  },
  equalsText: {
    color: '#fff',
  },
  clear: {
    backgroundColor: '#a5a5a5',
  },
  clearText: {
    color: '#fff',
  },
});
