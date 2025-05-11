import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useNavigation } from "expo-router";
import { Stack } from "expo-router/stack";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { Button } from "react-native";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerStyle: {
          backgroundColor: "#7C9A92",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title: (route.params as { name?: string })?.name ?? "Détail de la ressource",
        })}
      />
    </Stack>
  );
}
