import React, { useState } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button, Divider, useTheme, PaperProvider, Dialog, Portal } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { customTheme } from "../../../utils/theme/theme";
import { deleteUser, updateUser, updateUserCredtials } from "../../../services/user.service";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { useRouter } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "../../../components/SignOutButton";
import * as Linking from "expo-linking";

type FormData = {
  firstname: string;
  lastname: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const AccountSettings = () => {
  const theme = useTheme();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      firstname: "",
      lastname: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { user } = useUser();
  const { connectedUser, handleNonConnectedUser } = useConntedUser();

  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false); // état pour gérer la visibilité de la modale

  const onSubmitInfo = async (data: FormData) => {
    const dataToSend = {
      firstname: data.firstname,
      lastname: data.lastname,
      clerkId: user?.id,
    };
    console.log("Informations envoyées :", dataToSend);
    if (connectedUser) {
      console.log("Informations mises à jour :", dataToSend, connectedUser.id);

      const response = await updateUser(connectedUser.id, dataToSend);
      if (response.data) {
        router.back();
      }
    }
  };

  const onSubmitPassword = async (data: FormData) => {
    console.log("Mot de passe mis à jour :", data.oldPassword, data.newPassword);
    if (user) {
      const dataToSend = {
        clerkId: user.id,
        oldPassword: data.oldPassword,
        password: data.newPassword,
      };
      const response = await updateUserCredtials(dataToSend);
      if (response.data) {
        router.back();
      } else if (response.error) {
        return setError("oldPassword", {
          type: "manual",
          message: "Mot de passe actuel incorrect.",
        });
      }
    }
  };

  const { signOut } = useClerk();

  const handleDeleteUser = async () => {
    if (connectedUser) {
      const response = await deleteUser(connectedUser.id);
      if (!response.error) {
        try {
          await signOut();
          handleNonConnectedUser(false);
          Linking.openURL(Linking.createURL("/(home)"));
        } catch (err) {
          console.error(JSON.stringify(err, null, 2));
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1, backgroundColor: "#253334" }}
    >
      <PaperProvider theme={customTheme}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Modifier mes informations</Text>

          {/* Formulaire pour le nom et prénom */}
          <Controller
            control={control}
            name="firstname"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput label="Prénom" value={value} onChangeText={onChange} error={!!errors.firstname} style={styles.input} />
                {errors.firstname && <Text style={styles.error}>{errors.firstname.message}</Text>}
              </>
            )}
          />

          {/* Formulaire pour le nom */}
          <Controller
            control={control}
            name="lastname"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput label="Nom" value={value} onChangeText={onChange} error={!!errors.lastname} style={styles.input} />
                {errors.lastname && <Text style={styles.error}>{errors.lastname.message}</Text>}
              </>
            )}
          />

          {/* Bouton pour enregistrer les modifications */}
          <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmitInfo)}>
            Enregistrer les modifications
          </Button>

          <Divider style={styles.divider} />

          {/* Formulaire pour changer le mot de passe */}
          <Text style={styles.title}>Changer mon mot de passe</Text>

          <Controller
            name="oldPassword"
            control={control}
            rules={{
              validate: (value, formValues) => {
                if (formValues.newPassword || value) {
                  return value ? true : "Ancien mot de passe requis";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  label="Ancien mot de passe"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.oldPassword}
                  style={styles.input}
                />
                {errors.oldPassword && <Text style={styles.error}>{errors.oldPassword.message}</Text>}
              </>
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            rules={{
              validate: (value, formValues) => {
                if (formValues.oldPassword || value) {
                  return value ? true : "Nouveau mot de passe requis";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  label="Nouveau mot de passe"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.newPassword}
                  style={styles.input}
                />
                {errors.newPassword && <Text style={styles.error}>{errors.newPassword.message}</Text>}
              </>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              validate: (value) => {
                const newPassword = watch("newPassword");
                if (newPassword || value) {
                  if (!value) return "Confirmation requise";
                  if (value !== newPassword) return "Les mots de passe ne correspondent pas";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  label="Confirmer le mot de passe"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.confirmPassword}
                  style={styles.input}
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
              </>
            )}
          />

          <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmitPassword)}>
            Mettre à jour le mot de passe
          </Button>

          <Divider style={styles.divider} />

          <Text style={styles.title}>Compte</Text>
          <SignOutButton />

          {/* Bouton pour ouvrir la modale de suppression de compte */}
          <Button mode="text" textColor="#FFF" style={[styles.button, { backgroundColor: "#e0281b" }]} onPress={() => setDeleteDialogVisible(true)}>
            Supprimer mon compte
          </Button>

          {/* Modale de confirmation de suppression */}
          <Portal>
            <Dialog visible={isDeleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
              <Dialog.Title>Confirmer la suppression</Dialog.Title>
              <Dialog.Content>
                <Text>Cette action supprimera définitivement votre compte et toutes vos données. Êtes-vous sûr(e) ?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDeleteDialogVisible(false)}>Annuler</Button>
                <Button onPress={handleDeleteUser}>Supprimer</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#253334",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#FFF",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#7C9A92",
  },
  divider: {
    marginVertical: 25,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
});

export default AccountSettings;
