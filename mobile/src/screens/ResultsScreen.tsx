import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";
import { cafeIntents } from "../data/cafeIntents";
import { getNearbyCafes } from "../services/api";
import { CafeSummary } from "../types/CafeSummary";
import NearbyCafeCard from "../components/NearbyCafeCard";

type Props = NativeStackScreenProps<RootStackParamlist, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
    const {
        intent,
        latitude,
        longitude,
    } = route.params;

    const [cafes, setCafes] = useState<CafeSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadNearbyCafes() 
        {
            try
            {
                setLoading(true);
                setError(null);

                const nearbyCafes = await getNearbyCafes(
                    latitude,
                    longitude
                );

                setCafes(nearbyCafes);
            }
            catch (error)
            {
                console.error('Error al obtener las cafeterías cercanas: ', error);

                setError('No se pudieron cargar las cafeterías');
            }
            finally
            {
                setLoading(false);
            }
        }

        loadNearbyCafes();
    }, [latitude, longitude]);


    const intentOption = cafeIntents.find(
        (option) => option.id === intent
    );

    const title = intentOption
        ? `Cafés para ${intentOption.description}`
        : 'Cafeterías';

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>
                    Encontrá la cafetería ideal para tu momento.
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                >
                {loading && (
                    <Text style={styles.message}>
                        Buscando cafeterías...
                    </Text>
                )}

                {error && (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                )}

                {!loading && !error && cafes.map((cafe) => (
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F1E7',
        paddingHorizontal: 20,
    },

    title: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: '700',
        color: '#4A4216',
    },

    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: '#7A6254',
    },

    list: {
        gap: 14,
        paddingTop: 20,
        paddingBottom: 30,
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