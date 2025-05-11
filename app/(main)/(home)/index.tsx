import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, PaperProvider, useTheme, Chip, ActivityIndicator, Title, Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";

import { Article } from "../../../utils/types/Articles.types";
import { getArticles } from "../../../services/articles.service";
import { customTheme } from "../../../utils/theme/theme";
import { getCategory } from "../../../services/category.service";

const RenderItem = ({ item }: { item: Article }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/(article)/[id]",
        params: { id: item.id, name: item.label },
      }}
      asChild
    >
      <Card style={styles.card} mode="elevated">
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Card.Cover
              source={item.articleImages.length > 0 ? { uri: `http://192.168.1.89:3000${item.articleImages[0].path}` } : require("../../../assets/image.png")}
              style={styles.cover}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {item.label}
            </Text>

            <View style={styles.badgeContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
                <Text style={styles.badgeText}>{item.category.label}</Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                {item.user ? <Text style={styles.badgeText}>{item.user.firstname + item.user.lastname}</Text> : <Text style={styles.badgeText}>Anonyme</Text>}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Link>
  );
};

export default function Page() {
  const [articles, setArticles] = useState<Article[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);

  const flatListRef = useRef<FlatList>(null);

  const getDatas = useCallback(async () => {
    setLoading(true);
    const [resArticles, resCategories] = await Promise.all([
      getArticles(page, pageSize), // Passe les paramètres page et pageSize
      getCategory(),
    ]);
    if (resArticles && resCategories) {
      setArticles(resArticles.data);
      setCategories(resCategories.data);
      if (resArticles.total) {
        setTotalPages(Math.ceil(resArticles.total / pageSize));
      } // Calcul du nombre de pages
    }
    setLoading(false);
  }, [page, pageSize]);

  const filteredRessources = articles ? (selectedCategory ? articles.filter((r) => r.category.id === selectedCategory) : articles) : [];

  const onRefresh = useCallback(() => {
    getDatas();
  }, [getDatas]);

  useEffect(() => {
    getDatas();
  }, [getDatas]);

  // Fonctions de pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Passe à la page suivante
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1); // Passe à la page précédente
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
    }
  };

  // Fonction pour changer de catégorie et revenir en haut
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
  };

  return (
    <PaperProvider theme={customTheme}>
      <View style={styles.container}>
        <Title style={styles.greeting}>Bienvenue dans CeziZen !</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Chip style={styles.chip} selected={!selectedCategory} onPress={() => handleCategoryChange(null)}>
            <Text style={styles.badgeText}>Toutes</Text>
          </Chip>
          {categories.map((cat) => (
            <Chip key={cat.id} style={styles.chip} selected={selectedCategory === cat.id} onPress={() => handleCategoryChange(cat.id)}>
              <Text style={styles.badgeText}>{cat.label}</Text>
            </Chip>
          ))}
        </ScrollView>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : filteredRessources.length > 0 ? (
          <FlatList
            data={filteredRessources}
            keyExtractor={(item) => `${item.id}${item.label}_card`}
            renderItem={({ item }) => <RenderItem item={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          />
        ) : (
          <Text style={styles.emptyText}>Aucune ressource disponible !</Text>
        )}
        <View style={styles.paginationContainer}>
          <Button onPress={handlePrevPage} disabled={page === 1} labelStyle={{ color: "#FFF" }}>
            Précédent
          </Button>
          <Text style={{ color: "#FFF" }}>{`Page ${page} sur ${totalPages}`}</Text>
          <Button onPress={handleNextPage} disabled={page === totalPages} labelStyle={{ color: "#FFF" }}>
            Suivant
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#253334",
    padding: 12,
  },
  titleContainer: {
    flex: 0,
    marginBottom: 16,
  },
  filterScroll: {
    marginBottom: 12,
    height: 50,
  },
  chip: {
    color: "#f4f6f8",
    backgroundColor: "#7C9A92",
    marginRight: 8,
    height: 30,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  imageContainer: {
    width: 115,
    height: 115,
    marginRight: 12,
  },
  cover: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 16,
  },
  Participant: {
    color: "#555",
    marginRight: 8,
  },
  Participant_progress: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#e3f2fd",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
