import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const { handleNonConnectedUser } = useConntedUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      handleNonConnectedUser(false);
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#7C9A92",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      width: "100%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.buttonText}>Se déconnecter</Text>
    </TouchableOpacity>
  );
};
