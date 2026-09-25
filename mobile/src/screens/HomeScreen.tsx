import { useEffect, useRef, useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamlist } from '../navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import {
  AppState,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cafeIntents } from '../data/cafeIntents';
import NearbyCafeCard from '../components/NearbyCafeCard';
import { CafeSummary } from '../types/CafeSummary';
import { getNearbyCafes, searchCafes } from '../services/api';
import { getCurrentLocation, UserLocation } from '../services/location';

type Props = CompositeScreenProps<
    BottomTabScreenProps<
        MainTabParamList,
        'Home'
    >,
    NativeStackScreenProps<RootStackParamlist>
>;


export default function HomeScreen({navigation}: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const waitingForLocationSettings = useRef(false);

  const [cafes, setCafes] = useState<CafeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [canAskLocationAgain, setCanAskLocationAgain] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<CafeSummary[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [resolvedQuery, setResolvedQuery] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  async function loadNearbyCafes() {
    try
    {
      setLoading(true);
      setError(null);

      const result = await getCurrentLocation();

      if (result.status === 'denied')
      {
        setUserLocation(null);
        setCanAskLocationAgain(result.canAskAgain);

        setError(
          result.canAskAgain
          ? 'Necesitamos tu ubicación para mostrar cafeterías cercanas.'
          : 'El acceso a tu ubicación está desactivado. Habilitalo desde los ajustes del teléfono para ver las cafeterías cercanas.'
        );

        return;
      }

      const location = result.location;

      setCanAskLocationAgain(true);
      setUserLocation(location);

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

  async function refreshNearbyCafes()
{
  try
  {
    setRefreshingLocation(true);
    setError(null);

    const result = await getCurrentLocation();

    if (result.status === 'denied')
    {
      setCanAskLocationAgain(result.canAskAgain);

      setError(
        result.canAskAgain
          ? 'Necesitamos tu ubicación para mostrar cafeterías cercanas.'
          : 'El acceso a tu ubicación está desactivado. Habilitalo desde los ajustes del teléfono para ver las cafeterías cercanas.'
      );

      return;
    }

    const location = result.location;

    setCanAskLocationAgain(true);
    setUserLocation(location);

    const nearbyCafes = await getNearbyCafes(
      location.latitude,
      location.longitude
    );

    setCafes(nearbyCafes);
  }
  catch (error)
  {
    console.error(
      'Error al actualizar las cafeterías cercanas:',
      error
    );

    setError(
      'No se pudieron actualizar las cafeterías cercanas.'
    );
  }
  finally
  {
    setRefreshingLocation(false);
  }
}

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        (nextAppState) => {
          if (
            nextAppState === 'active' &&
            waitingForLocationSettings.current
          )
          {
            waitingForLocationSettings.current = false;
            loadNearbyCafes();
          }
        }
      );

      return () => {
        subscription.remove();
      }
  }, []);

  useEffect(() => {
    loadNearbyCafes();
  }, [])

  useEffect(() => {
    const query =
      searchText.trim();

    if (query.length < 3)
    {
      setSearchResults([]);
      setNextPageToken(null);
      setResolvedQuery(null);
      setSearchLoading(false);
      setSearchError(null);

      return;
    }

    const timeoutId =
      setTimeout(async () => {
        try
        {
          setSearchLoading(true);
          setSearchError(null);

          const result =
            await searchCafes(
              query,
              undefined,
              undefined,
              userLocation?.latitude,
              userLocation?.longitude,
            );

          setSearchResults(
            result.cafes
          );
          
          setNextPageToken(result.nextPageToken);

          setResolvedQuery(result.resolvedQuery);
        }
        catch (error)
        {
          console.error(
            'Error al buscar cafeterías:',
            error
          );

          setSearchResults([]);
          setNextPageToken(null);
          setResolvedQuery(null);
          setSearchError(
            'No se pudieron buscar cafeterías.'
          );
        }
        finally
        {
          setSearchLoading(false);
        }
      }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText, userLocation]);

  async function loadMoreSearchResults()
  {
    const query = searchText.trim();
    
    if (
      !nextPageToken ||
      !resolvedQuery ||
      loadingMore
    )
    {
      return;
    }

    try
    {
      setLoadingMore(true);
      setSearchError(null);

      const result =
        await searchCafes(
          query,
          nextPageToken,
          resolvedQuery,
          userLocation?.latitude,
          userLocation?.longitude,
        );

      setSearchResults((currentResults) => [
        ...currentResults,
        ...result.cafes
      ]);

      setNextPageToken(result.nextPageToken);

      setResolvedQuery(result.resolvedQuery);
    }
    catch (error)
    {
      console.error('Error al cargar más cafeterías', error);

      setSearchError('No se pudieron cargar más cafeterías');
    }
    finally
    {
      setLoadingMore(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={(event) => {
          const offsetY =
            event.nativeEvent.contentOffset.y;

          setShowScrollTop(offsetY > 500);
        }}
        scrollEventThrottle={16}
      >
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.logo}>
              BusCafé
            </Text>

            <Image
              source={require('../../assets/buscafe-icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

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
                  onPress={() => {
                      if (!userLocation) {
                          return;
                      }

                      navigation.navigate('Results', {
                          intent: option.id,
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                      });
                  }}
              >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>
          ¿Dónde querés buscar?
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar zona o cafetería"
          placeholderTextColor="#8C7A6B"
          value={searchText}
          onChangeText={setSearchText}
        />

        {searchText.trim().length >= 3 ? (
          <Text style={styles.sectionTitle}>
            {`Resultados para "${searchText.trim()}"`}
          </Text>
        ) : (
          <View style={styles.nearbyHeader}>
            <Text style={styles.nearbyTitle}>
              Cafés cerca de vos
            </Text>

            {!loading && !error && (
              <TouchableOpacity
                style={[
                  styles.refreshButton,
                  refreshingLocation &&
                    styles.refreshButtonDisabled,
                ]}
                onPress={refreshNearbyCafes}
                disabled={refreshingLocation}
              >
                <Text style={styles.refreshButtonText}>
                  {refreshingLocation
                    ? 'Actualizando...'
                    : '↻  Actualizar cafés'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {searchText.trim().length >= 3 && searchLoading && (
          <Text style={styles.message}>
            Buscando cafeterías...
          </Text>
        )}

        {searchText.trim().length >= 3 && searchError && (
          <Text style={styles.error}>
            {searchError}
          </Text>
        )}

        {searchText.trim().length >= 3 &&
          !searchLoading &&
          !searchError && (
            <View style={styles.cafesContainer}>
              {searchResults.map((cafe) => (
                <NearbyCafeCard
                  key={cafe.googlePlaceId}
                  cafe={cafe}
                  onPress={() => {
                    navigation.navigate('CafeDetail', {
                      googlePlaceId: cafe.googlePlaceId,
                    });
                  }}
                />
              ))}
              {nextPageToken && (
                <TouchableOpacity
                  style={styles.showAllButton}
                  onPress={loadMoreSearchResults}
                  disabled={loadingMore}
                >
                  <Text style={styles.showAllButtonText}>
                    {loadingMore
                      ? 'Cargando...'
                      : 'Ver más'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
        )}

        {searchText.trim().length < 3 && loading && (
          <Text style={styles.message}>
            Buscando cafeterías cercanas...
          </Text>
        )}

        {searchText.trim().length < 3 && error && (
          <View style={styles.locationCard}>
            <Text style={styles.error}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                if (canAskLocationAgain)
                {
                  loadNearbyCafes();
                }
                else
                {
                  waitingForLocationSettings.current = true;
                  Linking.openSettings();
                }
              }}
            >
              <Text style={styles.locationButtonText}>
                {canAskLocationAgain
                  ? '📍 Usar mi ubicación'
                  : '⚙️ Abrir ajustes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {searchText.trim().length < 3 && !loading && !error && (
          <View style={styles.cafesContainer}>
            {cafes.slice(0, 5).map((cafe) => (
              <NearbyCafeCard
                key={cafe.googlePlaceId}
                cafe={cafe}
                onPress={() => {
                    navigation.navigate('CafeDetail', {
                        googlePlaceId: cafe.googlePlaceId,
                    });
                }}
              />
            ))}
          </View>
        )}
        {searchText.trim().length < 3 &&
          !loading && 
          !error && 
          cafes.length > 5 && 
          userLocation && (
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={() => {
              navigation.navigate('Results', {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              });
            }}
          >
            <Text style={styles.showAllButtonText}>
              Ver todos
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={() => {
            scrollViewRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <Text style={styles.scrollTopButtonText}>
            ↑ Ir arriba
          </Text>
        </TouchableOpacity>
      )}
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

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 14,
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

  showAllButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#6B3A22',
    borderRadius: 12,
  },

  showAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#6B3A22',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
  },

  scrollTopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

    nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
  },

  nearbyTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#4A2416',
  },

  refreshButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#6B3A22',
  },

  refreshButtonDisabled: {
    opacity: 0.6,
  },

  refreshButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});