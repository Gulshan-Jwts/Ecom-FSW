import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";
import { Animated } from "react-native"; // Use Animated from react-native
import RenderHtml from "react-native-render-html";
import Svg, { Path } from "react-native-svg";
import useData from "../../hooks/useData";
import TopBar from "../../components/TopBar";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const DetailScreen = ({ route, navigation }) => {
  const productId = route?.params?.productId ?? "E7F8A9B0";
  const affilatorId = route?.params?.affilatorId ?? "";
  const scrollRef = useRef(null);
  const { products } = useData();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentVariant, setCurrentVariant] = useState("main");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; // Define slideAnim
  const swiperRef = useRef(null);

  const product = products?.find((p) => p._id === productId) || {};
  const currentImages = Array.isArray(product.images?.[currentVariant])
    ? product.images[currentVariant]
    : [];
  const recommendedProducts =
    products
      ?.filter((p) => p.category === product.category && p._id !== productId)
      .slice(0, 4) || [];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.scrollTo(index);
    }
  };

  const handleVariantChange = (variant) => {
    setCurrentVariant(variant);
    setSelectedImageIndex(0);
    if (swiperRef.current) {
      swiperRef.current.scrollTo(0);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

  const renderRecommendation = ({ item }) => {
    const recImage =
      Array.isArray(item.images?.main) && item.images.main.length > 0
        ? item.images.main[0]
        : "https://via.placeholder.com/150";
    return (
      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => navigation.push("Details", { productId: item._id })}
      >
        <Image source={{ uri: recImage }} style={styles.recommendationImage} />
        <View style={styles.recommendationCardContent}>
          <Text style={styles.recommendationTitle}>
            {item.title || "Recommended Product"}
          </Text>
          <Text style={styles.recommendationPrice}>
            ₹{item.currentPrice || "4,999"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <TopBar navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.main}
        ref={scrollRef}
      >
        <View style={styles.main}>
          <Animated.View
            style={[
              styles.productContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Image Gallery */}
            <View style={styles.productGallery}>
              {currentImages.length > 0 ? (
                <Swiper
                  ref={swiperRef}
                  style={styles.galleryContainer}
                  loop={currentImages.length > 1}
                  showsPagination={true}
                  paginationStyle={styles.pagination}
                  dotColor="#e5e7eb"
                  activeDotColor="#73D5E8"
                  onIndexChanged={(index) => setSelectedImageIndex(index)}
                >
                  {currentImages.map((img, index) => (
                    <View key={index} style={styles.gallerySlide}>
                      <Image
                        source={{
                          uri: img || "https://via.placeholder.com/600x540",
                        }}
                        style={styles.galleryImage}
                      />
                    </View>
                  ))}
                </Swiper>
              ) : (
                <View style={styles.galleryContainer}>
                  <Text style={styles.errorText}>No images available</Text>
                </View>
              )}
              <View style={styles.galleryThumbnails}>
                {currentImages.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.thumbnailSelected,
                    ]}
                    onPress={() => handleThumbnailClick(index)}
                  >
                    <Image
                      source={{ uri: img || "https://via.placeholder.com/100" }}
                      style={styles.thumbnailImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productBrand}>TFW</Text>
              <Text style={styles.productTitle}>
                {product.title || "Premium Silk Saree"}
              </Text>
              <View style={styles.productPrice}>
                <Text style={styles.priceCurrent}>
                  ₹{product.currentPrice || "5,999"}
                </Text>
                <Text style={styles.priceOriginal}>
                  ₹{product.oldPrice || "7,999"}
                </Text>
              </View>

              {/* Color Variants */}
              <View style={styles.colorVariants}>
                {Object.keys(product.images || {}).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.colorOption,
                      currentVariant === key && styles.colorOptionSelected,
                    ]}
                    onPress={() => handleVariantChange(key)}
                  >
                    <Image
                      source={{
                        uri:
                          product.images[key][0] ||
                          "https://via.placeholder.com/80",
                      }}
                      style={styles.colorOptionImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Size Selector */}
              <View style={styles.sizeSelector}>
                <Text style={styles.sizeLabel}>Select Size</Text>
                <View style={styles.sizeOptions}>
                  {(product.sizes || ["S", "M", "L"]).map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeOption,
                        selectedSize === size && styles.sizeOptionSelected,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={[
                          styles.sizeOptionText,
                          selectedSize === size &&
                            styles.sizeOptionTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantity Selector */}
              <View style={styles.quantitySelector}>
                <Text style={styles.quantityLabel}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => handleQuantityChange("decrease")}
                  >
                    <Text style={styles.quantityBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityInput}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => handleQuantityChange("increase")}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {!affilatorId && (
                  <TouchableOpacity style={styles.addToCart}>
                    <Svg
                      width={22}
                      height={22}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </Svg>
                    <Text style={styles.actionButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("PlaceOrder", { productId: product._id })
                  }
                  style={styles.buyNow}
                >
                  <Svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </Svg>
                  <Text style={styles.actionButtonText}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn}>
                  <Svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </Svg>
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>

              {/* Product Description */}
              <View style={styles.productDescription}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <RenderHtml
                  contentWidth={width - 64}
                  source={{
                    html: product.description || "No description available.",
                  }}
                  baseStyle={styles.descriptionText}
                  tagsStyles={{
                    h2: {
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#111827",
                      marginVertical: 8,
                    },
                    h3: {
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#111827",
                      marginVertical: 8,
                    },
                    p: {
                      fontSize: 14,
                      color: "#374151",
                      lineHeight: 22,
                      marginVertical: 4,
                    },
                    ul: { marginLeft: 16, paddingLeft: 16 },
                    ol: { marginLeft: 16, paddingLeft: 16 },
                    li: { fontSize: 14, color: "#374151", marginBottom: 4 },
                    table: {
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      marginVertical: 8,
                    },
                    th: {
                      backgroundColor: "#f3f4f6",
                      padding: 8,
                      fontWeight: "600",
                      color: "#111827",
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      padding: 8,
                      color: "#374151",
                    },
                  }}
                />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Product Recommendations */}
        <View style={styles.productRecommendations}>
          <Text style={styles.recommendationsTitle}>You May Also Like</Text>
          <FlatList
            data={recommendedProducts}
            renderItem={renderRecommendation}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsGrid}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    maxWidth: 360,
    alignSelf: "center",
  },
  main: { padding: 16 },
  productContainer: { flexDirection: "column", gap: 24 },
  productGallery: { marginBottom: 24 },
  galleryContainer: {
    height: 540,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  gallerySlide: { flex: 1 },
  galleryImage: { width: "100%", height: "100%", borderRadius: 16 },
  pagination: { bottom: 10 },
  galleryThumbnails: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  thumbnailSelected: { borderColor: "#73D5E8" },
  thumbnailImage: { width: "100%", height: "100%", borderRadius: 10 },
  productInfo: { flexDirection: "column", gap: 16 },
  productBrand: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  productTitle: { fontSize: 24, fontWeight: "700", color: "#111827" },
  productPrice: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceCurrent: { fontSize: 20, fontWeight: "700", color: "#73D5E8" },
  priceOriginal: {
    fontSize: 16,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  colorVariants: { flexDirection: "row", gap: 12, marginVertical: 16 },
  colorOption: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  colorOptionSelected: { borderColor: "#73D5E8" },
  colorOptionImage: { width: "100%", height: "100%", borderRadius: 10 },
  sizeSelector: { flexDirection: "column", gap: 8, marginBottom: 16 },
  sizeLabel: { fontSize: 14, fontWeight: "500", color: "#374151" },
  sizeOptions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  sizeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  sizeOptionSelected: { borderColor: "#73D5E8", backgroundColor: "#73D5E8" },
  sizeOptionText: { fontSize: 14, fontWeight: "500", color: "#374151" },
  sizeOptionTextSelected: { color: "#ffffff" },
  quantitySelector: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  quantityLabel: { fontSize: 14, fontWeight: "500", color: "#374151" },
  quantityControls: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  quantityBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  quantityBtnText: { fontSize: 16, fontWeight: "600", color: "#111827" },
  quantityInput: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
    width: 50,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  addToCart: {
    flex: 1,
    minWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#111827",
    borderRadius: 12,
  },
  buyNow: {
    flex: 1,
    minWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#73D5E8",
    borderRadius: 12,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  productDescription: { marginVertical: 16 },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  descriptionText: { fontSize: 14, color: "#374151", lineHeight: 22 },
  productRecommendations: { paddingVertical: 24, backgroundColor: "#f5f5f5" },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  recommendationsGrid: { paddingHorizontal: 16, gap: 16 },
  recommendationCard: {
    width: 150,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  recommendationImage: { width: "100%", height: 100 },
  recommendationCardContent: { padding: 8 },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  recommendationPrice: { fontSize: 14, fontWeight: "600", color: "#73D5E8" },
});

export default DetailScreen;
