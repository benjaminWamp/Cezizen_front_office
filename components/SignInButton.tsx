import { Text, TouchableOpacity } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { useRouter } from "expo-router";

export const SignInButton = () => {
  const { handleNonConnectedUser } = useConntedUser();
  const router = useRouter();

  const handleSignIn = async () => {
    handleNonConnectedUser(false);
    router.navigate("/sign-in");
  };

  const styles = {
    button: {
      backgroundColor: "#7C9A92",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  };

  return (
    <TouchableOpacity onPress={handleSignIn} style={styles.button}>
      <Text style={styles.buttonText}>Me connecter</Text>
    </TouchableOpacity>
  );
};
