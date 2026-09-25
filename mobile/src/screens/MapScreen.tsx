import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen()
{
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Mapa
                </Text>

                <Text style={styles.description}>
                    Próximamente vas a poder explorar cafeterías en el mapa.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F1E7',
    },

    content: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4A2416',
    },

    description: {
        marginTop: 8,
        fontSize: 15,
        color: '#7A6254',
    },
});