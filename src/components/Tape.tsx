import React, { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatExpression, formatForDisplay, TapeEntry } from '../logic/calculator';
import { colors } from './theme';

interface TapeProps {
  entries: TapeEntry[];
  onClear: () => void;
}

const PERFORATION_DOTS = 28;

export function Tape({ entries, onClear }: TapeProps) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.paper}>
      <View style={styles.header}>
        <Text style={styles.title}>TAPE</Text>
        {entries.length > 0 && (
          <Pressable
            onPress={onClear}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear tape"
            testID="clear-tape"
          >
            <Text style={styles.clear}>Clear tape</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        testID="tape"
      >
        {entries.length === 0 ? (
          <Text style={styles.empty}>Your calculations print here.</Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.row} accessible>
              <Text style={styles.expression} numberOfLines={1}>
                {formatExpression(entry.expression)}
              </Text>
              <Text
                style={[styles.result, entry.result === 'Error' && styles.error]}
                numberOfLines={1}
              >
                = {formatForDisplay(entry.result)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.perforation}>
        {Array.from({ length: PERFORATION_DOTS }, (_, i) => (
          <View key={i} style={styles.hole} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.paperEdge,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.inkFaint,
  },
  clear: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  empty: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.inkFaint,
    textAlign: 'center',
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.rule,
  },
  expression: {
    flex: 1,
    fontSize: 17,
    color: colors.inkSoft,
    fontVariant: ['tabular-nums'],
  },
  result: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: colors.error,
  },
  perforation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    height: 8,
    alignItems: 'center',
  },
  hole: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
  },
});
