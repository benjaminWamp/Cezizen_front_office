import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Chip, PaperProvider, Text, Card } from "react-native-paper";
import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Article } from "../../../utils/types/Articles.types";
import { getArticle } from "../../../services/articles.service";

import { customTheme } from "../../../utils/theme/theme";

const ArticleDetails = () => {
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
      getDatas();
    }, [id])
  );

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
                      <Text style={styles.categoryText}>{article.category.label}</Text>
                    </Chip>
                  </View>

                  <Text variant="bodyLarge" style={styles.description}>
                    {article.description}
                  </Text>
                  <Text variant="bodyLarge" style={styles.content}>
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
    backgroundColor: "#253334",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
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
    backgroundColor: "#7C9A92",
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});
