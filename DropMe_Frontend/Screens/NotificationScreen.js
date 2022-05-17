import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, ScrollView,Button } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationScreen = () => {
  const [notificationList, setNotification] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    async function loadNotifications() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);

        let result = await axios.get(url + "/notification/getNotifications", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        console.log(result.data);
        if (mounted) {
          setNotification(result.data);
          setLoading(false);
          //setToken(parseUser.userToken);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setLoading(false);
      }
      return () => (mounted = false);
    }

    loadNotifications();
    return () => (mounted = false);
  }, []);

  function getNotification() {
    return (
      <ScrollView w={"100%"}>
        {notificationList.map((msg) => (
          <Stack
            key={msg._id}
            display={"flex"}
            //flexDirection={"column"}
            direction="column"
            p={2}
            m={2}
            borderRadius={20}
            w="100%"
            bg={"#F0F8FF"}
          >
            {/* <Box display={"flex"} justifyContent="flex-end" >
            <Button w="15%" onPress={alert("hii")}>
            <MaterialIcons
                name="cancel"
                size={15}
                color="rgba(6,182,212,1.00)"
              />
            </Button>
            </Box> */}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent="flex-start"
              maxW="95%"
              minWidth={"95%"}
            >
              {/* <MaterialCommunityIcons
                name="message-alert"
                size={25}
                color="rgba(6,182,212,1.00)"
              /> */}

              <Text fontSize={15}>{msg.message}</Text>
            </Box>
          </Stack>
        ))}
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box
        borderRadius={10}
        display="flex"
        flex={1}
        flexDirection={"column"}
        alignItems={"center"}
        bg={"white"}
      >
        {notificationList.length != 0 ? (
          getNotification()
        ) : (
          <Text>No new notification</Text>
        )}
      </Box>
    );
  }
};

export default NotificationScreen;
