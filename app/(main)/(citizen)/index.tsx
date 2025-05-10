import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text as RNText, ScrollView } from "react-native";
import { Title, Divider, IconButton, Text, PaperProvider } from "react-native-paper";
import { useRouter, Redirect, useFocusEffect } from "expo-router";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { SignOutButton } from "../../../components/SignOutButton";
import { customTheme } from "../../../utils/theme/theme";
import { ExerciseSessionType } from "../../../utils/types/ExerciseSession.types";
import { getExerciseSessions } from "../../../services/exercise-session.service";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ExerciseSession from "../../../components/ExerciseSession";

const UserPage = () => {
  const { userChoseToUnconnect, connectedUser } = useConntedUser();
  const [exerciseSessions, setExerciseSessions] = useState<ExerciseSessionType[]>([]);

  const router = useRouter();

  if (userChoseToUnconnect || !connectedUser) {
    console.log(userChoseToUnconnect, connectedUser);

    return <Redirect href="/unConnectedUserPage" />;
  }

  const handleGoToRessource = (ressourceId: string) => {
    router.push(`/(ressource)/${ressourceId}`);
  };

  useEffect(() => {
    getExerciseSessions()
      .then((response) => {
        console.log("Exercise sessions", response.data);
        setExerciseSessions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching exercise sessions:", error);
      });
  }, []);

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Title style={styles.greeting}>Bonjour {connectedUser.firstname} 👋</Title>
          <IconButton icon="cog-outline" size={24} onPress={() => router.push("/accountSettings")} />
        </View>
        <FlatList
          data={exerciseSessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExerciseSession exerciseSession={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={<Text style={styles.empty}>Aucun exercice de fait</Text>}
        />

        <SignOutButton />
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  lists: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 10,
    paddingRight: 10,
  },
  divider: {
    marginVertical: 20,
  },
  empty: {
    fontStyle: "italic",
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 10,
  },
  section: {
    paddingVertical: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default UserPage;
