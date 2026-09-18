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
import { getCurrentLocation } from '../services/location';

type Props = NativeStackScreenProps<RootStackParamlist, 'Home'>;



export default function HomeScreen({navigation}: Props) {
  const [cafes, setCafes] = useState<CafeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadNearbyCafes() {
    try
    {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();

      if (location === null)
      {
        setError(
          'Necesitamos tu ubicación para mostrar cafeterías cercanas.'
        );

        return;
      }

      const nearbyCafes = await getNearbyCafes(
        location.latitude,
        location.longitude
      );

      setCafes(nearbyCafes);
    }
    catch (error)
    {
      console.error(
        'Error al obtener las cafeterías cercanas:',
        error
      );

      setError(
        'No se pudieron cargar las cafeterías cercanas.'
      );
    }
    finally
    {
      setLoading(false);
    }
  }

  useEffect(() => {
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
          Cafés cerca de vos
        </Text>

        {loading && (
          <Text style={styles.message}>
            Buscando cafeterías cercanas...
          </Text>
        )}

        {error && (
          <View style={styles.locationCard}>
            <Text style={styles.error}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={loadNearbyCafes}
            >
              <Text style={styles.locationButtonText}>
                📍 Usar mi ubicación
              </Text>
            </TouchableOpacity>
          </View>
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

        {!loading && !error && cafes.length > 0 && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              console.log('Abrir mapa');
            }}
          >
            <Text style={styles.mapButtonText}>
              🗺️ Ver en el mapa
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>
          ¿Buscás en otro lugar?
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar zona o cafetería"
          placeholderTextColor="#8C7A6B"
        />
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
    marginTop: 14,
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

  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D9C7',
  },

  mapButton: {
    marginTop: 16,
    backgroundColor: '#6B3A22',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});