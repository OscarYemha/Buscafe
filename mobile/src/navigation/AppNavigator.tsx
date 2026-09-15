import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import { CafeIntent } from "../types/CafeIntent";
import CafeDetailScreen from "../screens/CafeDetailScreen";

export type RootStackParamlist = {
    Home: undefined;
    Results: {
        intent: CafeIntent;
    };
    CafeDetail: {
        cafeId: string;
    }
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
        </Stack.Navigator>
    );
}