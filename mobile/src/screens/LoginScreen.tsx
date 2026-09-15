import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamlist } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamlist, 'Login'>;

export default function LoginScreen( {navigation}: Props) {
    const { login } = useAuth();

    const hadleLogin = () => {
        login();
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Iniciar sesión
                </Text>

                <Text style={styles.description}>
                    Iniciá sesión para continuar en BusCafé.
                </Text>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={hadleLogin}
                >
                    <Text style={styles.loginButtonText}>
                        Iniciar sesión como usuario de prueba
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

    description: {
        marginTop: 8,
        fontSize: 15,
        color: '#7A6254',
    },

    loginButton: {
        marginTop: 28,
        backgroundColor: '#6B3A22',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});