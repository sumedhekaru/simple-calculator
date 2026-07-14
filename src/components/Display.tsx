import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DisplayProps {
  value: string;
}

export function Display({ value }: DisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1} testID="display">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 64,
    fontWeight: '300',
    color: '#fff',
  },
});
