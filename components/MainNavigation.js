
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../app/screens/Home";
import LoginScreen from "../app/screens/Login";
import DetailScreen from "../app/screens/Details";
import PlaceOrderScreen from "../app/screens/PlaceOrder";

const Stack = createStackNavigator();

export default function MainNavigation() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {(props) => <DetailScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="PlaceOrder">
            {(props) => <PlaceOrderScreen {...props} />}
          </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
