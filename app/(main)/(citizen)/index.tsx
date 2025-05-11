import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { Title, IconButton, Text, PaperProvider } from "react-native-paper";
import { useRouter, Redirect } from "expo-router";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { customTheme } from "../../../utils/theme/theme";
import { ExerciseSessionType } from "../../../utils/types/ExerciseSession.types";
import { getExerciseSessions } from "../../../services/exercise-session.service";
import ExerciseSession from "../../../components/ExerciseSession";
import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

const UserPage = () => {
  const { userChoseToUnconnect, connectedUser, handleNonConnectedUser } = useConntedUser();
  const [exerciseSessions, setExerciseSessions] = useState<ExerciseSessionType[]>([]);
  const { signOut } = useClerk();

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

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Title style={styles.greeting}>Bonjour {connectedUser.firstname} 👋</Title>
          <IconButton icon="exit-to-app" size={24} onPress={handleSignOut} iconColor={"#e0281b"} />
          <IconButton icon="cog-outline" size={24} onPress={() => router.push("/accountSettings")} iconColor={"#FFF"} />
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
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#253334",
    flexGrow: 1,
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
    color: "#FFF",
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
