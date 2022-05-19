import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, ScrollView, Button } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationScreen = () => {
  const [notificationList, setNotification] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isUpdated, setUpdated] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  async function markAllRead() {
    try {
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      // alert("markAllRead");
      let result = await axios.put(
        url + "/notification/markAllRead",
        {},
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      console.log(result.data);
      //alert("Done");
      setUpdated(true);
    } catch (ex) {
      console.log("Exception in mark all read notifications", ex.response);
      setUpdated(false);
    }
  }
  async function markReadNotification(notificationId) {
    try {
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      let result = await axios.put(
        url + "/notification/markAsRead",
        {
          notificationId,
        },
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      console.log(result.data);
      setUpdated(true);
    } catch (ex) {
      console.log("Exception in mark notification", ex.response);
      setUpdated(false);
    }
  }

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
        //console.log(result.data);
        if (mounted) {
          setNotification(result.data);
          setLoading(false);
          setUpdated(false);

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
  }, [isUpdated]);

  function getNotification() {
    return (
      <ScrollView w={"100%"}>
        {notificationList.map((msg) => (
          <Stack
            key={msg._id}
            //display={"flex"}
            //flexDirection={"column"}
            direction="row"
            p={3}
            m={2}
            borderRadius={10}
            bg={"white"}
            w="95%"
          >
            <Box
              alignItems={"center"}
              justifyContent="flex-start"
              maxW="90%"
              minWidth={"90%"}
            >
              <Text fontSize={15}>{msg.message}</Text>
            </Box>
            <MaterialIcons
              name="cancel"
              size={30}
              color="rgba(6,182,212,1.00)"
              //color='red'
              onPress={() => markReadNotification(msg._id)}
            />
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
        bg={"#F0F8FF"}
      >
        {notificationList.length != 0 ? (
          getNotification()
        ) : (
          <Box flex={1} justifyContent={"center"}>
            <Text>No new notification</Text>
          </Box>
        )}
        {notificationList.length > 0 && (
          <Button w={"40%"} p={2} m={4} onPress={markAllRead}>
            Mark all read
          </Button>
        )}
      </Box>
    );
  }
};

export default NotificationScreen;
