import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useConntedUser } from "../../utils/ConnectedUserContext";
import { Platform } from "react-native";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "#253334",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#7C9A92",
          height: Platform.OS === "ios" ? 80 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Articles",
          tabBarIcon: ({ color }) => <Icon size={20} source="home" color={color} />,
          headerShown: false,
          popToTopOnBlur: true,
          tabBarActiveTintColor: "#FFF",
        }}
      />
      <Tabs.Screen
        name="(article)"
        options={{
          href: null,
          title: "",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(exercise)"
        options={{
          title: "Exercices",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon size={20} source="camera-timer" color={color} />,
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(citizen)"
        options={{
          title: "Compte",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon size={20} source="account" color={color} />,
          popToTopOnBlur: true,
        }}
      />
    </Tabs>
  );
}
