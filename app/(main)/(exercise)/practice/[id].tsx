// app/(Exercise)/practice/[id].tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, ActivityIndicator, Title, TextInput } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getExercise } from "../../../../services/exercise.service";
import { ExerciseType } from "../../../../utils/types/Exercise.types";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor, Easing } from "react-native-reanimated";
import { createExerciseSession } from "../../../../services/exercise-session.service";
import { useConntedUser } from "../../../../utils/ConnectedUserContext";

type Phase = "countdown" | "inspire" | "apnea" | "expire" | "done";

export default function PracticePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("countdown");
  const [timer, setTimer] = useState(3);
  const [notes, setNotes] = useState("");
  const { connectedUser } = useConntedUser();
  if (!connectedUser) {
    return (
      <View style={[styles.center, styles.container]}>
        <Title style={styles.title}>Vous devez être connecté·e pour faire cet exercice</Title>
        <Button mode="contained" onPress={() => router.push("/sign-in")} style={styles.button}>
          Se connecter
        </Button>
      </View>
    );
  }

  const progress = useSharedValue(0);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const res = await getExercise(+id);
        setExercise(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!exercise || loading) return;
    let duration = 0;

    switch (phase) {
      case "countdown":
        duration = 3000;
        break;
      case "inspire":
        duration = exercise.inspiration * 1000;
        progress.value = withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });
        break;
      case "apnea":
        duration = exercise.apnea * 1000;
        progress.value = withTiming(1, { duration });
        break;
      case "expire":
        duration = exercise.expiration * 1000;
        progress.value = withTiming(0, { duration, easing: Easing.inOut(Easing.ease) });
        break;
      case "done":
        progress.value = withTiming(0, { duration: 500 });
        break;
    }

    let count =
      phase === "countdown"
        ? 3
        : phase === "inspire"
          ? exercise.inspiration
          : phase === "apnea"
            ? exercise.apnea
            : phase === "expire"
              ? exercise.expiration
              : 0;

    const tick = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(tick);
        setPhase((prev) =>
          prev === "countdown" ? "inspire" : prev === "inspire" ? "apnea" : prev === "apnea" ? "expire" : prev === "expire" ? "done" : "done"
        );
      }
      setTimer(count > 0 ? count : 0);
    }, 1000);

    return () => {
      clearInterval(tick);
    };
  }, [phase, exercise, loading]);

  const restart = useCallback(() => {
    setPhase("countdown");
    setTimer(3);
    progress.value = 0;
  }, []);

  const validateSession = useCallback(() => {
    if (!exercise) return;
    if (connectedUser) {
      const session = {
        exerciseId: exercise.id,
        userId: Number(connectedUser.id),
        endDate: new Date(),
        notes: notes,
      };
      createExerciseSession(session).then((res) => {
        router.back();
      });
    }
  }, []);

  const circleStyle = useAnimatedStyle(() => {
    const scale = 1 + progress.value * 0.5;
    const backgroundColor = interpolateColor(progress.value, [0, 1], ["#82ca9d", "#8884d8"]);
    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text>Exercice introuvable</Text>
        <Button onPress={() => router.back()}>← Retour</Button>
      </View>
    );
  }

  const labels: Record<Phase, string> = {
    countdown: "Préparez-vous…",
    inspire: "Inspirez",
    apnea: "Retenez",
    expire: "Expirez",
    done: "Terminé !",
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#253334" }}>
      <View style={styles.container}>
        <Title style={styles.title}>{exercise.label}</Title>

        <View style={{ flex: 1, marginVertical: 32 }}>
          <Animated.View style={[styles.circle, circleStyle]} />
        </View>

        <Text variant="displayLarge" style={styles.timer}>
          {timer}
        </Text>
        <Text variant="headlineSmall" style={styles.phaseText}>
          {labels[phase]}
        </Text>

        {phase === "done" && (
          <>
            <Button mode="contained" onPress={restart} style={styles.button}>
              Recommencer
            </Button>
            <View style={{ width: "100%" }}>
              <Text variant="headlineSmall" style={styles.phaseText}>
                Laisser un commentaire
              </Text>
              <TextInput label="Note" mode="outlined" value={notes} onChangeText={setNotes} multiline style={{ height: 100, maxHeight: 200, width: "100%" }} />
            </View>
            <Button mode="contained" onPress={validateSession} style={styles.button}>
              Valider
            </Button>
          </>
        )}

        <Button onPress={() => router.back()} style={styles.backButton} textColor="#FFF">
          ← Retour
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#253334",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
    color: "#FFF",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  timer: {
    marginBottom: 12,
    color: "#FFF",
  },
  phaseText: {
    marginBottom: 24,
    color: "#FFF",
  },
  button: {
    marginVertical: 16,
    backgroundColor: "#7C9A92",
  },
  backButton: {
    marginTop: 8,
    backgroundColor: "#7C9A92",
    color: "#FFF",
  },
});
