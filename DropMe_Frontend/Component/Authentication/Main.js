import React, { useMemo, useState, useReducer, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../Screens/Home";
import Login from "./Login";
import Registration from "./Registration";
import Splash from "../Splash";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const Main = () => {
  // const [userToken, setUserToken] = useState(null);

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
      signIn: async (userName, password) => {
        let userToken = null;
        if (userName === "12" && password === "pass") {
          userToken = "abc";
          try {
            await AsyncStorage.setItem("userToken", userToken);
          } catch (e) {
            console.log(e);
          }
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken", null);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      signUp: () => {},
    }),
    []
  );

  useEffect(() => {
    let mounted = true;
    let userToken = null;
    setTimeout(async () => {
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
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
        </Stack.Navigator>
      ) : (
        <Home />
      )}
    </AuthContext.Provider>
  );
};

export default Main;
