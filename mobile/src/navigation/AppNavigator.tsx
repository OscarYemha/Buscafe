import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

export type RootStackParamlist = {
    Home: undefined;
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
        </Stack.Navigator>
    );
}