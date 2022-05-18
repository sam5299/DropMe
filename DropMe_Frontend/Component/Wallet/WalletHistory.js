import { Text, Box, ScrollView } from "native-base";
import React, { useEffect, useState, useContext } from "react";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WalletHistory = () => {
  let [historyList, setHistoryList] = useState([]);
  const { getUrl } = useContext(AuthContext);
  const [userToken, setToken] = useState(null);
  const url = getUrl();
  const [isLoaded, setIsLoaded] = useState(false);
   useEffect(()=>{
    async function loadHistory() {
        try {
            const User = await AsyncStorage.getItem("User");
            const userDetails = JSON.parse(User);
            setToken(userDetails.userToken);
            const allHistory = await axios.get(url + "/walletHistory/getWalletHistory", {
              headers: {
                "x-auth-token": userDetails.userToken,
              },
            });
            setHistoryList(allHistory.data);
             //console.log("@@@", allHistory.data);
            setIsLoaded(false);
          } catch (error) {
            console.log("Booked Rides Exception: ", error);
            setIsLoaded(true);
          }
          }
    loadHistory()
   },[isLoaded])

  function getHistory() {
    return (
      <ScrollView w={"100%"}>
        {historyList.map((transaction) => (
          <Box
            key={transaction._id}
            borderRadius={10}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            m={3}
            
            bg={"white"}
          >
            <Box padding={2} borderRadius={50}>
              {transaction.type === "Credit" ? (
                <MaterialCommunityIcons
                  name="bank-transfer-in"
                  size={50}
                  color="rgba(6,182,212,1.00)"
                />
              ) : (
                <MaterialCommunityIcons
                  name="bank-transfer-out"
                  size={50}
                  color="rgba(6,182,212,1.00)"
                />
              )}
            </Box>
            <Box overflow={"hidden"}>
              <Text fontWeight={"bold"} fontSize={18}>
                {transaction.message}
              </Text>
              <Text fontSize={12}>{transaction.date}</Text>
            </Box>
            <Text fontWeight={"bold"} fontSize={18} p={2}>
              <FontAwesome5 name="rupee-sign" size={18} color="black" />
              {transaction.amount}
            </Text>
          </Box>
        ))}
      </ScrollView>
    );
  }
  if (isLoaded)
    return (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  else
    return (
      <Box flex={1} bg={"#F0F8FF"}>
        <Box alignItems={"center"} >
          {historyList.length ? (
            getHistory()
          ) : (
            <Box justifyContent={"center"} alignItems={"center"}>
              <Text>No history found</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
};

export default WalletHistory;
