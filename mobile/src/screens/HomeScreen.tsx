import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cafeIntents } from '../data/cafeIntents';
import NearbyCafeCard from '../components/NearbyCafeCard';
import { CafeSummary } from '../types/CafeSummary';
import { getNearbyCafes } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamlist, 'Home'>;



export default function HomeScreen({navigation}: Props) {
  const [cafes, setCafes] = useState<CafeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNearbyCafes() {
      try
      {
        setLoading(true);
        setError(null);

        const nearbyCafes = await getNearbyCafes(
          -34.6000,
          -58.4000
        );

        setCafes(nearbyCafes);
      }
      catch (error)
      {
        console.error('Error al obtener las cafeterías cercanas: ', error);

        setError('No se pudieron cargar las cafeterías cercanas');
      }
      finally
      {
        setLoading(false);
      }
    }

    loadNearbyCafes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
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
          {cafeIntents.map((option) => (
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

        {loading && (
          <Text style={styles.message}>
            Buscando cafeterías cercanas...
          </Text>
        )}

        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        {!loading && !error && (
          <View style={styles.cafesContainer}>
            {cafes.map((cafe) => (
              <NearbyCafeCard
                key={cafe.googlePlaceId}
                cafe={cafe}
                onPress={() => {
                  console.log(
                    'Cafetería seleccionada:',
                    cafe.name
                  );
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1E7',
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  cafesContainer: {
    gap: 14,
  },

  message: {
    fontSize: 16,
    color: '#7A6254',
  },

  error: {
    fontSize: 16,
    color: '#A13D32',
  },
});