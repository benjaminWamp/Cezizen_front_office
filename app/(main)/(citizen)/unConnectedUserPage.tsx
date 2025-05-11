import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SignInButton } from "../../../components/SignInButton";

const unConnectedUserPage = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#253334",
      padding: 12,
    },
    text: {
      fontSize: 16,
      color: "#FFF",
      textAlign: "center",
      marginBottom: 10,
    },
    button: {
      marginTop: 20,
      backgroundColor: "#7C9A92",
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur l'application de suivi de votre activité physique</Text>
      <Text style={styles.text}>Pour commencer, veuillez vous connecter à votre compte</Text>
      <Text style={styles.text}>Vous pourrez ensuite suivre vos progrès et accéder à vos exercices</Text>
      <Text style={styles.text}>Si vous n'avez pas de compte, vous pouvez en créer un gratuitement</Text>
      <SignInButton />
    </View>
  );
};

export default unConnectedUserPage;
