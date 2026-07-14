import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Calculator } from './src/components/Calculator';

export default function App() {
  return (
    <SafeAreaProvider>
      <Calculator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
