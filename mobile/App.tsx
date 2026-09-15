import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { ReviewDraftProvider } from "./src/context/ReviewDraftContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReviewDraftProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ReviewDraftProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}