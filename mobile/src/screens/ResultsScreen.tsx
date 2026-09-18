import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";
import CafeCard from "../components/CafeCard";
import { mockCafes } from "../data/mockCafes";
import { rankCafeByIntent } from "../services/cafeRanking";
import { cafeIntents } from "../data/cafeIntents";
import { getCafes } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamlist, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {

    const { intent } = route.params;

    useEffect(() => {
        async function loadCafes() 
        {
            try
            {
                const cafes = await getCafes();

                console.log('Cafeterías recibidas desde el backend: ', cafes);
            }
            catch (error)
            {
                console.error('Error al obtener las cafeterías: ', error);
            }
        }

        loadCafes();
    }, []);

    const sortedCafes = rankCafeByIntent(
        mockCafes,
        intent
    );

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
                {sortedCafes.map((cafe) => (
                    <CafeCard
                        key={cafe.id}
                        cafe={cafe}
                        selectedIntent={intent}
                        onPress={() =>
                            navigation.navigate('CafeDetail', {
                                cafeId: cafe.id
                            })
                        }
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
});