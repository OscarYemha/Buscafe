import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamlist } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamlist, 'Results'>;

export default function ResultsScreen({ route }: Props) {

    const { intent } = route.params;

    const intentTitles = {
        work: 'Cafés para trabajar',
        date: 'Cafés para una cita',
        study: 'Cafés para estudiar',
        coffee: 'Cafés con buen café',
        'pet-friendly': 'Cafés pet friendly',
        food: 'Cafés para comer algo',
    };

    const title = intentTitles[intent];

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>
                    Encontrá la cafetería ideal para tu momento.
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
        color: '#4A4216',
    },

    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: '#7A6254',
    }
});