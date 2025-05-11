import { useCallback, useEffect, useState } from "react";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { Text, useTheme, PaperProvider, Title, Card, Paragraph, Chip, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FlatList, StyleSheet, View } from "react-native";
import { getExercises } from "../../../services/exercise.service";
import { Link, useRouter } from "expo-router";
import { customTheme } from "../../../utils/theme/theme";
import { ExerciseType } from "../../../utils/types/Exercise.types";
import { ApiResponse } from "../../../utils/types/Api.types";

const Exercise = () => {
  const [exercises, setExercises] = useState<ApiResponse<ExerciseType[]>>();
  const { connectedUser } = useConntedUser();
  const theme = useTheme();
  const { colors } = useTheme();

  const getDatas = useCallback(async () => {
    const exercises = await getExercises();
    if (exercises) {
      setExercises(exercises);
    }
  }, []);

  const router = useRouter();
  const handlePress = (id: number) => {
    console.log("ID", id);

    router.push({
      pathname: "practice/[id]",
      params: { id },
    });
  };

  useEffect(() => {
    getDatas();
  }, [getDatas]);
  return (
    <PaperProvider theme={customTheme}>
      <View style={styles.container}>
        <Title style={styles.greeting}>Retrouvez les exercices !</Title>
        {exercises && exercises.data.length > 0 ? (
          <View style={{ flex: 1 }}>
            <View style={styles.progressionContainer}>
              <FlatList
                data={exercises.data}
                keyExtractor={(item) => `${item.id}_card`}
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: "/practice/[id]",
                      params: { id: item.id },
                    }}
                    asChild
                  >
                    <Card style={styles.card} mode="elevated">
                      <Card.Content>
                        <View style={styles.header}>
                          <MaterialCommunityIcons name="run-fast" size={24} color={colors.secondary} />
                          <Title style={styles.title}>{item.label}</Title>
                        </View>
                        <Paragraph style={styles.description} numberOfLines={2}>
                          {item.description}
                        </Paragraph>

                        <View style={styles.footer}>
                          <Chip
                            icon={() => <MaterialCommunityIcons name="timer-outline" size={16} color="#555" />}
                            style={styles.chip}
                            textStyle={styles.chipText}
                          >
                            <Text style={{ margin: 0 }}>{item.times} sec</Text>
                          </Chip>
                        </View>
                      </Card.Content>
                    </Card>
                  </Link>
                )}
                contentContainerStyle={styles.listContent}
                style={styles.list}
              />
            </View>
          </View>
        ) : (
          <Text>Aucune exercice pour le moment !</Text>
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#253334",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#e3f2fd",
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
  },
  progressionContainer: {
    flex: 1,
  },
  progressionText: {
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 16,
    margin: 10,
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  signInText: {
    marginBottom: 16,
    fontSize: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    backgroundColor: "#253334",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    marginLeft: 8,
    fontSize: 18,
    flexShrink: 1,
  },
  description: {
    color: "#666",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8, // ajuste l'espace horizontal
    height: 30,
    alignSelf: "flex-start",
  },
  chipText: {},
});

export default Exercise;
