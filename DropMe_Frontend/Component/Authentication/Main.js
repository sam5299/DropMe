import React, { useMemo, useState, useReducer, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../Screens/Home";
import Login from "./Login";
import Registration from "./Registration";
import Splash from "../Splash";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Forgot from "./Forgot";
import axios from "axios";

const Stack = createNativeStackNavigator();

const Main = () => {
  const url = "http://192.168.96.17:3100";

  const initialState = {
    userName: null,
    userToken: null,
    animating: true,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "RETRIVE_TOKEN":
        return {
          ...state,
          userToken: action.token,
          animating: false,
        };
      case "LOGIN":
        return {
          ...state,
          userName: action.id,
          userToken: action.token,
          animating: false,
        };
      case "LOGOUT":
        return {
          ...state,
          userName: null,
          userToken: null,
          animating: false,
        };
      case "REGISTER":
        return {
          ...state,
          userName: action.id,
          userToken: action.token,
          animating: false,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const authContext = useMemo(
    () => ({
      signIn: async (userName, userToken) => {
        try {
          const result = await axios.get(url + "/user/getUser", {
            headers: { "x-auth-token": userToken },
          });
          result["userToken"] = userToken;
          const data = JSON.stringify(result);
          await AsyncStorage.setItem("User", data);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.log(e.response.data);
        }
        dispatch({ type: "LOGOUT" });
      },
      getUrl: () => {
        return url;
      },
    }),
    []
  );

  useEffect(() => {
    let mounted = true;
    let userToken = null;
    setTimeout(async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        if (User !== null) {
          const parseUser = JSON.parse(User);
          userToken = parseUser.userToken;
        }
      } catch (e) {
        console.log(e.response.data);
      }
      if (mounted) {
        dispatch({ type: "RETRIVE_TOKEN", token: userToken });
      }
    }, 2000);
    return () => (mounted = false);
  }, []);

  if (state.animating) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      {state.userToken === null ? (
        <Stack.Navigator>
          <Stack.Screen name="DropMe" component={Login} />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{ headerStyle: { height: 10 } }}
          />
          <Stack.Screen name="Forgot Password" component={Forgot} />
        </Stack.Navigator>
      ) : (
        <Home />
      )}
    </AuthContext.Provider>
  );
};

export default Main;
