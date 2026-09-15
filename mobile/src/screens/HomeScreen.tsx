import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CafeIntent } from '../types/CafeIntent';

type Props = NativeStackScreenProps<RootStackParamlist, 'Home'>;

type IntentOption = {
    id: CafeIntent;
    icon: string;
    label: string;
};

const intentOptions: IntentOption[] = [
    { id: 'work', icon: '💻', label: 'Trabajar' },
    { id: 'date', icon: '❤️', label: 'Una cita' },
    { id: 'study', icon: '📚', label: 'Estudiar' },
    { id: 'coffee', icon: '☕', label: 'Buen café' },
    { id: 'pet-friendly', icon: '🐕', label: 'Pet friendly' },
    { id: 'food', icon: '🍰', label: 'Comer algo' },
];

export default function HomeScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.logo}>BusCafé</Text>
        <Text style={styles.subtitle}>
          Encontrá el café ideal para tu momento
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar zona o cafetería"
        placeholderTextColor="#8C7A6B"
      />

      <TouchableOpacity style={styles.locationButton}>
        <Text style={styles.locationButtonText}>
          📍 Cafés cerca de mí
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        ¿Qué estás buscando?
      </Text>

      <View style={styles.optionsContainer}>
        {intentOptions.map((option) => (
            <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() =>
                    navigation.navigate('Results', {
                        intent: option.id,
                    })
                }
            >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Cafés cerca
      </Text>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          Próximamente vamos a mostrar cafeterías acá.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1E7',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 20,
    marginBottom: 24,
  },

  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A2416',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#7A6254',
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2D4C3',
  },

  locationButton: {
    marginTop: 12,
    backgroundColor: '#6B3A22',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2416',
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  optionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E8D9C7',
  },

  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A2416',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8D9C7',
  },

  emptyText: {
    color: '#7A6254',
  },
});