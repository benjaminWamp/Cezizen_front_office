import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button, Chip, Divider, PaperProvider, Text, Card } from "react-native-paper";
import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Article } from "../../../utils/types/Articles.types";
import { getArticle } from "../../../services/articles.service";

import { useAuth } from "@clerk/clerk-expo";
import { useForm } from "react-hook-form";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { customTheme } from "../../../utils/theme/theme";

const ArticleDetails = () => {
  const { isSignedIn } = useAuth();
  const { connectedUser } = useConntedUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { id } = useLocalSearchParams<Record<string, string>>();
  const [article, setArticle] = useState<Article | undefined>(undefined);

  const getDatas = async () => {
    const response = await getArticle(id);
    if (response) {
      setArticle(response.data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      getDatas();

      return () => {
        isActive = false;
      };
    }, [id])
  );

  const onSubmit = async (data: { title: string; description: string }) => {
    if (connectedUser) {
      const comment = {
        ...data,
        citizenId: connectedUser?.id,
        articleId: id,
      };
      try {
        reset();
        getDatas();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <PaperProvider theme={customTheme}>
        <View style={{ flex: 1 }}>
          {article && (
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
              <Card style={styles.card}>
                <Card.Content>
                  <Image
                    source={
                      article.articleImages[0]?.path
                        ? { uri: `http://192.168.1.89:3000${article.articleImages[0].path}` }
                        : require("../../../assets/image.png")
                    }
                    style={styles.image}
                  />
                  <Text variant="titleLarge" style={styles.title}>
                    {article.label}
                  </Text>

                  <View style={styles.badgeContainer}>
                    <Chip icon="tag" style={styles.categoryChip}>
                      {article.category.label}
                    </Chip>
                  </View>

                  <Text variant="bodyLarge" style={styles.description}>
                    {article.description}
                  </Text>
                  <Text variant="bodyLarge" style={styles.description}>
                    {article.content}
                  </Text>
                </Card.Content>
              </Card>
            </ScrollView>
          )}
        </View>
      </PaperProvider>
    </>
  );
};

export default ArticleDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    color: "#555",
  },
  divider: {
    marginVertical: 12,
  },
  button: {
    marginTop: 0,
  },
  description: {
    marginTop: 16,
    lineHeight: 20,
    color: "#333",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: "#e3f2fd",
    alignSelf: "flex-start",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});
