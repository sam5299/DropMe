import { View } from "react-native";
import { React, useState, useEffect, useContext } from "react";
import { Box, Stack, Image, Text, Button, ScrollView } from "native-base";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewVehicles = () => {
  const [vehicleDetails, setVehicle] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    async function getVehicleDetails() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);

        let result = await axios.get(url + "/vehicle/getVehicleList", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setVehicle(result.data);
          setToken(parseUser.userToken);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
      }
    }

    getVehicleDetails();
    return () => (mounted = false);
  }, []);

  async function removeVehicle(vehicle) {
    try {
      let result = await axios.delete(
        `${url}/vehicle/deleteVehicle/${vehicle.vehicleNumber}`,
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      );

      let newVehicle = vehicleDetails.filter(
        (vehicleObj) => vehicleObj._id != vehicle._id
      );
      setVehicle(newVehicle);
    } catch (ex) {
      console.log(ex.response.data);
    }
  }

  function getVehicle() {
    return (
      <ScrollView>
        {vehicleDetails.map((vehicle) => (
          <Stack
            key={vehicle._id}
            direction={"column"}
            m={5}
            alignItems={"center"}
            bg={"#F0F8FF"}
            p={5}
            borderColor="coolGray.200"
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
          >
            <Box>
              <Image
                source={{
                  uri: vehicle.vehicleImage,
                }}
                alt="Image not available"
                size={"2xl"}
                borderRadius={20}
              />
            </Box>
            <Text fontSize={20} fontWeight="bold" p={1}>
              {vehicle.vehicleName}
            </Text>
            <Text fontSize={20} fontWeight="bold" p={1}>
              {vehicle.vehicleNumber}
            </Text>
            <Button borderRadius={10} onPress={() => removeVehicle(vehicle)}>
              Remove Vehicle
            </Button>
          </Stack>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box alignItems={"center"} bg={"#F0F8FF"}>
      {vehicleDetails.length ? getVehicle() : <Text>Please add vehicle</Text>}
    </Box>
  );
};

export default ViewVehicles;
