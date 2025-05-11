import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { createUser } from "../../services/user.service";
import { TextInput, Button, Title, Text, Card } from "react-native-paper";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        firstName: firstname,
        lastName: lastname,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const clerkUserID = signUpAttempt.createdUserId;

        try {
          await createUser(clerkUserID);
          router.replace("/");
        } catch (error) {
          console.log(error);
        }
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Vérification</Title>
            <TextInput label="Code de vérification" mode="outlined" value={code} onChangeText={setCode} style={styles.input} />
            <Button mode="contained" onPress={onVerifyPress} style={styles.button}>
              Vérifier
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Créer un compte</Title>

          <TextInput label="Prénom" mode="outlined" value={firstname} onChangeText={setFirstname} style={styles.input} />

          <TextInput label="Nom" mode="outlined" value={lastname} onChangeText={setLastname} style={styles.input} />

          <TextInput label="Email" mode="outlined" value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" style={styles.input} />

          <TextInput
            label="Mot de passe"
            mode="outlined"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            style={styles.input}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((prev) => !prev)} />}
          />

          <Button mode="contained" onPress={onSignUpPress} style={styles.button}>
            Continuer
          </Button>

          <View style={styles.signinContainer}>
            <Text>Déjà un compte ?</Text>
            <Link href="/sign-in">
              <Text style={styles.signinLink}>Se connecter</Text>
            </Link>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#253334",
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#7C9A92",
  },
  signinContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  signinLink: {
    color: "#7C9A92",
    marginLeft: 5,
  },
});
