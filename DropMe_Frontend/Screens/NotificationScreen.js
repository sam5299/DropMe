import { View } from "react-native";
import React, { useState, useEffect ,useContext} from "react";
import { Box, Text, Stack, ScrollView } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";


const NotificationScreen = () => {
  const [notificationList, setNotification] = useState([
    { message: "Credit added1", _id:1 }
  ]);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();


  useEffect(() => {
    let mounted = true;
    async function getNotification() {
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
          //setToken(parseUser.userToken);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
      }
      return ()=> (mounted=false)
    }

    getNotification();
    return () => (mounted = false);
  }, []);






  function getNotification() {
    return (
      <ScrollView w={"100%"}>
        {notificationList.map((msg) => (
          <Stack
            key={msg._id}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            p={2}
            m={2}
            borderRadius={10}
            w="100%"
            bg={"#F0F8FF"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent="flex-start"
              borderRadius={10}
              maxW="95%"
              minWidth={"95%"}
            
            >
              <MaterialCommunityIcons
                name="message-alert"
                size={25}
                color="rgba(6,182,212,1.00)"
              />
              <Text fontSize={20} >{msg.message}</Text>

              
            </Box>
          </Stack>
        ))}
      </ScrollView>
    );
  }

 
 
  return (
    <Box
      //mt={"10%"}
    //   w={"95%"}
    //   h={'90%'}
      borderRadius={10}
      display="flex"
      flex={1}
      flexDirection={"column"}
      alignItems={"center"}
      bg={"white"}
    >
      {notificationList.length!=0 ? (
        getNotification()
      ) : (
        <Text>No new notification</Text>
      )}
    </Box>
  );
};

export default NotificationScreen;
