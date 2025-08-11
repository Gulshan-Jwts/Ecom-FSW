import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import RazorpayCheckout from "react-native-razorpay";
import useData from "../../hooks/useData";
import Icon from "react-native-vector-icons/Feather";
import { useIsLoggedIn } from "../../hooks/useLoggedIn";

const PlaceOrderScreen = ({ route, navigation }) => {
  const [accessToken, isLoggedIn, isLoading] = useIsLoggedIn();
  const { products, dbUser } = useData();

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      console.log(dbUser, "dbUser in PlaceOrderScreen");
      navigation.navigate("Login");
      Toast.show({
        type: "error",
        text1: "Not Logged In",
        text2: "Please log in to place an order.",
      });
    } else {
      console.log(accessToken, "Access Token in PlaceOrderScreen");
    }
  }, [isLoggedIn, isLoading]);

  const productId = route?.params?.productId ?? "E7F8A9B0";
  const [step, setStep] = useState(1); // 1: Order Summary, 2: Address & Phone
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState({
    fullName: dbUser?.username || "",
    email: dbUser?.email || "",
    phone: dbUser?.phone || "",
    streetAddress: dbUser?.address?.street || "",
    city: dbUser?.address?.city || "",
    state: dbUser?.address?.state || "",
    pincode: dbUser?.address?.pincode || "",
    country: dbUser?.address?.country || "India",
    landmark: dbUser?.address?.landmark || "",
    houseNo: dbUser?.address?.houseNo || "",
    district: dbUser?.address?.district || "",
  });

  const product = products.find((p) => p._id === productId) || {
    title: "Product",
    currentPrice: "0",
    images: { main: ["/images/placeholder.jpg"] },
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handlePlaceOrder = async () => {
    // Validate address fields
    const requiredFields = [
      "fullName",
      "phone",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    // const missingFields = requiredFields.filter(
    //   (field) => !address[field]?.trim()
    // );
    // if (missingFields.length > 0) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: `Please fill in: ${missingFields.join(", ")}`,
    //   });
    //   return;
    // }
    console.log("Placing order with address:");

    try {
      // Step 1: Create order via API
      const response = await fetch(
        "http://192.168.1.20:3000/api/payment/generate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount:parseInt(product.currentPrice || 0) * quantity
          }),
        }
      );

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      
      

      // Step 2: Initiate Razorpay payment
      const options = {
        description: `Order for ${product.title}`,
        image:
          "https://tse1.mm.bing.net/th/id/OIP.lLZrxda2aQxrK_pav6AJjQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        currency: "INR",
        key: orderData.key, // Replace with your Razorpay key
        amount: orderData.amount, // Convert to paise
        name: "FsWorld",
        order_id: orderData.orderId, // Assumes API returns Razorpay order ID
        prefill: {
          // email: address.email || dbUser.email,
          contact: address.phone,
          name: address.fullName,
        },
        theme: { color: "#73D5E8" },
      };

      RazorpayCheckout.open(options)
        .then((data) => {
          // Payment success
          Toast.show({
            type: "success",
            text1: "Order Placed",
            text2: `Order successful! Payment ID: ${data.razorpay_payment_id}`,
          });
          navigation.navigate("Home"); // Adjust to your home route
        })
        .catch((error) => {
          console.log("Creating order with API failied:", error);
          Toast.show({
            type: "error",
            text1: "Payment Failed",
            text2: error.description || "Payment could not be processed",
          });
        });
    } catch (error) {
      console.error("Error placing order:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order. Please try again.",
      });
    }
  };

  const total = parseInt(product.currentPrice || 0) * quantity;

  return (
    <ScrollView style={styles.container}>
      {/* Step Navigation */}
      <View style={styles.stepNav}>
        <TouchableOpacity
          style={[styles.stepBtn, step === 1 && styles.activeStep]}
          onPress={() => setStep(1)}
        >
          <Text style={[styles.stepText, step === 1 && styles.activeStepText]}>
            Order Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stepBtn, step === 2 && styles.activeStep]}
          onPress={() => setStep(2)}
        >
          <Text style={[styles.stepText, step === 2 && styles.activeStepText]}>
            Address & Phone
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step 1: Order Summary */}
      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderCard}>
            <Image
              source={{
                uri:
                  product.images?.main[0] || "https://via.placeholder.com/60",
              }}
              style={styles.orderImage}
            />
            <View style={styles.orderDetails}>
              <Text style={styles.productName}>{product.title}</Text>
              <Text style={styles.productPrice}>₹{product.currentPrice}</Text>
              <View style={styles.quantity}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Icon name="minus" size={14} color="#4b5563" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => handleQuantityChange(1)}
                >
                  <Icon name="plus" size={14} color="#4b5563" />
                </TouchableOpacity>
              </View>
              <Text style={styles.productTotal}>₹{total}</Text>
            </View>
          </View>
          <View style={styles.orderTotal}>
            <View>
              <Text style={styles.orderTotalText}>
                Subtotal: <Text style={styles.orderTotalAmount}>₹{total}</Text>
              </Text>
              <Text style={styles.orderTotalText}>
                Shipping: <Text style={styles.orderTotalAmount}>Free</Text>
                <Icon
                  name="info"
                  size={16}
                  color="#9ca3af"
                  style={styles.infoIcon}
                />
              </Text>
              <Text style={styles.orderTotalText}>
                Total: <Text style={styles.totalAmount}>₹{total}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={() => setStep(2)}>
            <Text style={styles.submitBtnText}>Proceed to Address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Address & Phone */}
      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address & Phone</Text>
          <View style={styles.shippingForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Icon
                  name="user"
                  size={16}
                  color="#9ca3af"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={address.fullName}
                  onChangeText={(text) =>
                    setAddress({ ...address, fullName: text })
                  }
                  placeholder="Enter your full name"
                />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="phone"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.phone}
                    onChangeText={(text) =>
                      setAddress({ ...address, phone: text })
                    }
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Street Address/Area</Text>
              <View style={styles.inputContainer}>
                <Icon
                  name="map-pin"
                  size={16}
                  color="#9ca3af"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={address.streetAddress}
                  onChangeText={(text) =>
                    setAddress({ ...address, streetAddress: text })
                  }
                  placeholder="Enter name of the area/colony/nagar"
                />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="home"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.city}
                    onChangeText={(text) =>
                      setAddress({ ...address, city: text })
                    }
                    placeholder="Enter your city/district"
                  />
                </View>
              </View>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>State</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="home"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.state}
                    onChangeText={(text) =>
                      setAddress({ ...address, state: text })
                    }
                    placeholder="Enter your state name"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>Landmark</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="home"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.landmark}
                    onChangeText={(text) =>
                      setAddress({ ...address, landmark: text })
                    }
                    placeholder="Nearest shop/park/area for landmark"
                  />
                </View>
              </View>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>House no.</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="home"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.houseNo}
                    onChangeText={(text) =>
                      setAddress({ ...address, houseNo: text })
                    }
                    placeholder="Enter your house no."
                  />
                </View>
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>PIN Code</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="map"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    value={address.pincode}
                    onChangeText={(text) =>
                      setAddress({ ...address, pincode: text })
                    }
                    placeholder="Enter your Pin code"
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              </View>
              <View style={[styles.formGroup, styles.formRowItem]}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.inputContainer}>
                  <Icon
                    name="globe"
                    size={16}
                    color="#9ca3af"
                    style={styles.icon}
                  />
                  <Picker
                    selectedValue={address.country}
                    onValueChange={(value) => {
                      console.log(value, "Selected Country");
                      setAddress({ ...address, country: value });
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select your country" value="" />
                    <Picker.Item label="India" value="India" />
                    <Picker.Item label="Nepal" value="Nepal" />
                    <Picker.Item label="Pakistan" value="Pakistan" />
                    <Picker.Item label="Shri Lanka" value="ShriLanka" />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.submitBtnContainer}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handlePlaceOrder}
              >
                <Icon name="credit-card" size={18} color="#fff" />
                <Text style={styles.submitBtnText}>Pay Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoBtn}>
                <Icon name="info" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  stepNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stepBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeStep: {
    backgroundColor: "#73D5E8",
  },
  stepText: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay-Regular",
    color: "#111827",
  },
  activeStepText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Cinzel-Regular",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  productPrice: {
    fontSize: 14,
    color: "#4b5563",
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
  },
  productTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#73D5E8",
  },
  orderTotal: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  orderTotalText: {
    fontSize: 14,
    color: "#4b5563",
  },
  orderTotalAmount: {
    fontWeight: "600",
    color: "#111827",
  },
  totalAmount: {
    fontSize: 16,
    color: "#6d28d9",
  },
  infoIcon: {
    marginLeft: 4,
  },
  shippingForm: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formRowItem: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 4,
    fontFamily: "PlayfairDisplay-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#111827",
  },
  picker: {
    flex: 1,
    height: 40,
    color: "#111827",
  },
  icon: {
    marginRight: 8,
  },
  submitBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#73D5E8",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  submitBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "PlayfairDisplay-Regular",
    marginLeft: 8,
  },
  infoBtn: {
    padding: 12,
  },
});

export default PlaceOrderScreen;
