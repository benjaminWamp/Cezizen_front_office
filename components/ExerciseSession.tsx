import { Card, Text } from "react-native-paper";
import { parseStringDate, parseStringHour } from "../utils/functions/datesFunction";
import { StyleSheet } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { ExerciseSessionType } from "../utils/types/ExerciseSession.types";

interface CommentCardProps {
  exerciseSession: ExerciseSessionType;
}

const CommentCard = (props: CommentCardProps) => {
  const { connectedUser } = useConntedUser();
  const { exerciseSession } = props;
  const isCurrentUser = connectedUser?.id === exerciseSession.user.id;

  return (
    <Card key={exerciseSession.id} style={[styles.card]}>
      <Card.Title
        title={`Titre : ${exerciseSession.exercise.label}`}
        subtitle={`Description : ${exerciseSession.exercise.description} `}
        titleStyle={[styles.title, isCurrentUser && styles.currentUserText]}
        subtitleStyle={[styles.subtitle, isCurrentUser && styles.currentUserText]}
      />
      <Card.Content>
        {exerciseSession.notes && (
          <Text variant="bodyMedium" style={[styles.description, isCurrentUser && styles.currentUserText]}>
            Notes : {exerciseSession.notes}
          </Text>
        )}
        <Text variant="bodyMedium" style={[styles.description, isCurrentUser && styles.currentUserText]}>
          {`Fait le ${parseStringDate(new Date(exerciseSession.endDate).toISOString())} à ${parseStringHour(new Date(exerciseSession.endDate).toISOString())} `}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 4,
    height: "25%",
    marginRight: 16,
    backgroundColor: "#7C9A92",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  currentUserText: {
    color: "#ffffff",
  },
});

export default CommentCard;
