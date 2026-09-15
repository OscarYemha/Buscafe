import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";
import { mockCafes } from "../data/mockCafes";

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
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>
                    {cafe.name}
                </Text>

                <Text style={styles.subtitle}>
                    ★ {cafe.rating} · {cafe.distanceKm} km ·{' '}
                    {'$'.repeat(cafe.priceLevel)}
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

    title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '700',
    color: '#4A2416',
    },

    subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#7A6254',
    },
});