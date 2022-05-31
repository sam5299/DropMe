import { StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Box, Stack, Text, Image, Spinner } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  useEffect(() => {
    let mounted = true;
    async function loadDetails() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let profile = await axios.get(url + "/user/loadProfile", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setUserDetails(profile.data);
          setPageLoading(false);
        }
      } catch (ex) {
        console.log("Exception in profile", ex.response.data);
      }
    }

    loadDetails();
    return () => (mounted = false);
  }, []);
  if (pageLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"} bg="#F0F8FF">
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} bg={"#F0F8FF"} justifyContent="center">
        <Box
          alignItems={"center"}
          m="5"
          p="2"
          borderColor="coolGray.200"
          borderRadius={10}
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
          height={"50%"}
        ></Box>
      </Box>
    );
  }
};

export default UserProfile;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
