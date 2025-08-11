import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Svg, { Path, G, Line, Rect, Circle } from "react-native-svg";
import useData from "../../hooks/useData";
import BottomNav from "../../components/BottomNav";
import { useIsLoggedIn } from "../../hooks/useLoggedIn";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const App = () => {
  const { categories, products } = useData();
  // const [accessToken, isLoggedIn,isLoading] = useIsLoggedIn();
  const navigation = useNavigation();

  // const setTemp = async () => {
  //   try {
  //     console.log("Setting temporary data");
  //     await SecureStore.setItemAsync(
  //       "accessToken", // spelling fix bhi note karo
  //       JSON.stringify({
  //         token:
  //           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcnRsaW5lMDMzQGdtYWlsLmNvbSIsIl9pZCI6IjY4N2U0NjNhNGVjN2M5NzlmNjQxMzFkMiIsImlhdCI6MTc1Mzk3MDEyMiwiZXhwIjoxNzU2NTYyMTIyfQ.4OYJhkdjMSMXodSCPhWihGnW8cD8lVDEgCCn11gOe_A",
  //         expiry: "1756562122555",
  //       })
  //     );
  //     console.log("✅ Data set successfully");
  //   } catch (err) {
  //     console.error("❌ Failed to set token in SecureStore:", err);
  //   }
  // };
  // setTemp();

  // useEffect(() => {}, []);

  const categoryImage = {
    "Mens Wear": require("../../assets/homeImages/mensCat.png"),
    "Womens Wear": require("../../assets/homeImages/womensCat.png"),
    Kids: require("../../assets/homeImages/kidsCat.jpg"),
  };
  const renderCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryImage}>
        <Image source={categoryImage[item.name]} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  const renderProduct = ({ item }) => (
    <Pressable
      key={item.__id}
      onPress={() =>
        navigation.navigate("Details", { productId: item._id, affilatorId: "" })
      }
      style={styles.productCard}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{
            uri: item.images.main[0] || "https://placeholder.com/172x208",
          }}
          style={styles.productImage}
        />
        <TouchableOpacity style={styles.heartIcon}>
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
          >
            <G strokeWidth="0"></G>
            <G strokeLinecap="round" strokeLinejoin="round"></G>
            <G>
              <Path
                d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H13M19 15.5H17"
                stroke="#000000"
                strokeWidth={0.5}
                strokeLinecap="round"
              />
              <Path
                d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
                stroke="#000000"
                strokeWidth={0.5}
              />
              <Path
                d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
                stroke="#000000"
                strokeWidth={0.5}
              />
              <Path
                d="M5 6H8M5.5 13H16.0218C16.9812 13 17.4609 13 17.8366 12.7523C18.2123 12.5045 18.4013 12.0636 18.7792 11.1818L19.2078 10.1818C20.0173 8.29294 20.4221 7.34853 19.9775 6.67426C19.5328 6 18.5054 6 16.4504 6H12"
                stroke="#000000"
                strokeWidth={0.5}
                strokeLinecap="round"
              />
            </G>
          </Svg>
        </TouchableOpacity>
        {item.tag !== "None" && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{item.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.productContent}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.currentPrice}</Text>
          <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
        </View>
        <View style={styles.delivery}>
          <Svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FBC886"
            strokeWidth={2}
          >
            <Path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <Path d="M15 18H9" />
            <Path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <Circle cx="7" cy="18" r="2" />
            <Circle cx="17" cy="18" r="2" />
            <Path d="M2 8h3" />
            <Path d="M2 11h2" />
          </Svg>
          <Text style={styles.deliveryText}>Free Delivery</Text>
        </View>
      </View>
    </Pressable>
  );

  const sections = [
    {
      key: "categories",
      render: () => (
        <View style={styles.categories}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          />
        </View>
      ),
    },
    {
      key: "featuredProducts",
      render: () => (
        <View style={styles.products}>
          <View style={styles.productHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.filter((p) => p.inStock)}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.productGrid}
            scrollEnabled={false}
          />
        </View>
      ),
    },
    {
      key: "newArrivals",
      render: () => (
        <View style={styles.products}>
          <View style={styles.productHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.filter((p) => p.shiningEffect)}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.productGrid}
            scrollEnabled={false}
          />
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={sections}
          renderItem={({ item }) => item.render()}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.main}
        />
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9d8ca",
    maxWidth: 500,
    minWidth: Dimensions.get("window").width,
    alignSelf: "center",
  },
  main: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  categories: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: 80,
    alignItems: "center",
    marginRight: 16,
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
  },
  categoryText: {
    fontSize: 12,
    color: "#374151",
    marginTop: 8,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    padding: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
  },
  filterPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxWidth: 360,
    height: "50%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  options: {
    flexDirection: "column",
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#73D5E8",
    borderRadius: 4,
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  genderImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 3,
  },
  sliderContainer: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginBottom: 4,
  },
  rangeFill: {
    height: 10,
    width: "80%",
    backgroundColor: "#73D5E8",
    borderRadius: 5,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  optionDivider: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 8,
  },
  filterSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  products: {
    marginBottom: 24,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#73D5E8",
  },
  productGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 208,
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  newBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#73D5E8",
    padding: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 12,
    color: "#ffffff",
  },
  productContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#73D5E8",
  },
  oldPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  delivery: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deliveryText: {
    fontSize: 12,
    color: "#FBC886",
  },
});
