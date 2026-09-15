import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";
import { mockCafes } from "../data/mockCafes";
import { cafeIntents } from "../data/cafeIntents";

type Props = NativeStackScreenProps<RootStackParamlist, 'CafeDetail'>;

export default function CafeDetailScreen({ route }: Props) 
{
    const { cafeId } = route.params;

    const cafe = mockCafes.find(
        (cafe) => cafe.id === cafeId
    );

    if(!cafe)
    {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    Cafetería no encontrada
                </Text>
            </SafeAreaView>
        );
    }

    const cafeIntentOptions = cafe.intents
        .map((intent) =>
            cafeIntents.find((option) => option.id === intent)
        )
        .filter((option) => option !== undefined);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>
                    {cafe.name}
                </Text>

                <Text style={styles.summary}>
                    ★ {cafe.rating} · {cafe.distanceKm} km ·{' '}
                    {'$'.repeat(cafe.priceLevel)}
                </Text>

                <View style={styles.section}>
                    <Text
                    style={[
                        styles.status,
                        cafe.isOpen ? styles.open : styles.closed,
                    ]}
                    >
                    {cafe.isOpen ? '● Abierto' : '● Cerrado'}
                    </Text>

                    <Text style={styles.info}>
                    🕐 {cafe.hours}
                    </Text>

                    <Text style={styles.info}>
                    📍 {cafe.address}
                    </Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                    Características
                    </Text>

                    <View style={styles.tagsContainer}>
                    {cafe.features.map((feature) => (
                        <View
                        key={feature}
                        style={styles.tag}
                        >
                        <Text style={styles.tagText}>
                            {feature}
                        </Text>
                        </View>
                    ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Ideal para
                    </Text>

                    <View style={styles.tagsContainer}>
                        {cafeIntentOptions.map((option) => (
                        <View
                            key={option.id}
                            style={styles.tag}
                        >
                            <Text style={styles.tagText}>
                            {option.icon} {option.label}
                            </Text>
                        </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity style={styles.directionsButton}>
                    <Text style={styles.directionsButtonText}>
                        📍 Cómo llegar
                    </Text>
                </TouchableOpacity>
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

    title: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: '700',
        color: '#4A2416',
    },

    summary: {
        marginTop: 8,
        fontSize: 16,
        color: '#7A6254',
    },

    section: {
        marginTop: 24,
    },

    sectionTitle: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: '700',
        color: '#4A2416',
    },

    status: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },

    open: {
        color: '#39734A',
    },

    closed: {
        color: '#A13D32',
    },

    info: {
        marginTop: 6,
        fontSize: 15,
        color: '#7A6254',
    },

    directionsButton: {
        marginTop: 24,
        backgroundColor: '#6B3A22',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    directionsButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    tag: {
        backgroundColor: '#F3E4C8',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    tagText: {
        fontSize: 13,
        color: '#6B3A22',
    },
});