import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context";

const AcceptRejectRequest = ({ route, navigation }) => {
  const { rideId, token } = route.params;
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const getTripRequest = async () => {
      try {
        const requestList = await axios.get(
          `${url}/ride/getTripRequestList/${rideId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log(requestList.header);
      } catch (error) {
        console.log("Accept Reject Request: ", error.response.data);
      }
    };

    getTripRequest();

    return () => (mounted = false);
  });

  return (
    <View>
      <Text>AcceptRejectRequest</Text>
    </View>
  );
};

export default AcceptRejectRequest;
