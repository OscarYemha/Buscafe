import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { ReviewDraftProvider } from "./src/context/ReviewDraftContext";
import { AuthProvider } from "./src/context/AuthContext";
import { ReviewsProvider } from "./src/context/ReviewsContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReviewsProvider>
          <ReviewDraftProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ReviewDraftProvider>
        </ReviewsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}