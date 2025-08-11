import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      const acessToken = JSON.parse(
        await SecureStore.getItemAsync("acessToken")
      );
      // if (acessToken) {
      //   console.log(acessToken.token,"accessToken");
      //   console.log(acessToken.expiry,"expiry");
      // }

      if (!acessToken) return setIsLoggedIn(false);
      console.log("token found")

      const expiryTime = parseInt(acessToken.expiry);
      const now = Date.now();

      if (now > expiryTime) {
        await SecureStore.deleteItemAsync("accessToken");
        setIsLoggedIn(false);
        return;
      }
      console.log("token in LoggedIn not expired")
      setAccessToken(acessToken.token);

      try {
        console.log("Checking login status with backend...");
        const res = await fetch(
          "http://192.168.1.20:3000/api/user/login/verify",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${acessToken.token}` },
          }
        );

        if (res.ok) {

          setIsLoggedIn(true);
          setisLoading(false);
          console.log("Login check successful");
        } else {
          setisLoading(false);
          console.log("Login check failed:", res.statusText);
          setIsLoggedIn(false);
        }
      } catch (err) {
        setisLoading(false);
        console.error("Login check failed:", err.message);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  return [accessToken, isLoggedIn,isLoading];
};
