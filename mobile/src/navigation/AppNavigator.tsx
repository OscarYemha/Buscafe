import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import { CafeIntent } from "../types/CafeIntent";
import CafeDetailScreen from "../screens/CafeDetailScreen";
import AddReviewScreen from "../screens/AddReviewScreen";
import LoginScreen from "../screens/LoginScreen";

export type RootStackParamlist = {
    Home: undefined;
    Results: {
        intent: CafeIntent;
        latitude: number;
        longitude: number;
    };
    CafeDetail: {
        cafeId: string;
    };
    AddReview: {
        cafeId: string;
    };
    Login: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamlist>();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Results"
                component={ResultsScreen}
                options={{
                    title: 'Resultados',
                }}
            />
            <Stack.Screen
                name="CafeDetail"
                component={CafeDetailScreen}
                options={{
                    title: 'Cafetería'
                }}
            />
            <Stack.Screen
                name="AddReview"
                component={AddReviewScreen}
                options={{
                    title: 'Escribir reseña'
                }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Iniciar sesión'
                }}
            />
        </Stack.Navigator>
    );
}