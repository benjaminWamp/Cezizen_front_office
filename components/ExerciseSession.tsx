import { Card, Text } from "react-native-paper";
import { CommentType } from "../utils/types/Comment.types";
import { parseStringDate } from "../utils/functions/datesFunction";
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
    <Card key={exerciseSession.id} style={[styles.card, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
      <Card.Title
        title={exerciseSession.exercise.label}
        subtitle={`${exerciseSession.exercise.description} `}
        titleStyle={[styles.title, isCurrentUser && styles.currentUserText]}
        subtitleStyle={[styles.subtitle, isCurrentUser && styles.currentUserText]}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={[styles.description, isCurrentUser && styles.currentUserText]}>
          {exerciseSession.notes}
        </Text>
        <Text variant="bodyMedium" style={[styles.description, isCurrentUser && styles.currentUserText]}>
          {`Fait le ${exerciseSession.endDate} `}
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
  otherUserBubble: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 0,
  },
  currentUserBubble: {
    backgroundColor: "#f9921e",
    borderTopRightRadius: 0,
  },
  currentUserText: {
    color: "#ffffff",
  },
});

export default CommentCard;
