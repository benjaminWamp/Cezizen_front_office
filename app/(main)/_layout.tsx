import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { useConntedUser } from "../../utils/ConnectedUserContext";

export default function Layout() {
  const { isSignedIn } = useAuth();
  const { userChoseToUnconnect } = useConntedUser();

  if (!userChoseToUnconnect && !isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Articles",
          tabBarIcon: () => <Icon size={20} source="home" />,
          headerShown: false,
          popToTopOnBlur: true,
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
        name="(onGoingRessource)"
        options={{
          title: "Exercices",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="camera-timer" />,
          popToTopOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="(citizen)"
        options={{
          title: "Compte",
          headerShown: false,
          tabBarIcon: () => <Icon size={20} source="account" />,
          popToTopOnBlur: true,
        }}
      />
    </Tabs>
  );
}
