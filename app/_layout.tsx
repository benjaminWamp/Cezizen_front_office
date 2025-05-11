import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Slot, SplashScreen } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ConnectedUserProvider } from "../utils/ConnectedUserContext";
import { ThemeProvider } from "react-native-paper";
import { customTheme } from "../utils/theme/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();

  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#253334",
      paddingTop: 0,
      paddingBottom: 0,
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <ConnectedUserProvider>
            <SafeAreaView style={styles.container}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                style={{ flex: 1 }}
              >
                <Slot />
              </KeyboardAvoidingView>
            </SafeAreaView>
          </ConnectedUserProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}
