//import { View,Alert } from "react-native";
import { React, useState, useEffect, useContext } from "react";
import { Alert as NewAlert } from "react-native";
import {
  Box,
  Stack,
  Image,
  Text,
  Icon,
  Button,
  ScrollView,
  // Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Fab,
  Spinner,
  useToast,
} from "native-base";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
const ViewVehicles = () => {
  const [vehicleDetails, setVehicle] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState({ status: "", title: "" });
  const [fetching, setFetching] = useState(true);

  //toast field
  const toast = useToast();

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
          console.log("Available Vehicles");
          setFetching(false);
        }
      } catch (error) {
        console.log("Exception", error.response.data);
        setFetching(false);
      }
    }

    getVehicleDetails();
    return () => (mounted = false);
  }, []);

  // let AlertField = (
  //   <Alert w="100%" status={status.status}>
  //     <VStack space={2} flexShrink={1} w="100%">
  //       <HStack flexShrink={1} space={2} justifyContent="space-between">
  //         <HStack space={2} flexShrink={1}>
  //           <Alert.Icon mt="1" />
  //           <Text fontSize="md" color="coolGray.800">
  //             {status.title}
  //           </Text>
  //         </HStack>
  //         <IconButton
  //           variant="unstyled"
  //           _focus={{
  //             borderWidth: 0,
  //           }}
  //           icon={<CloseIcon size="3" color="coolGray.600" />}
  //         />
  //       </HStack>
  //     </VStack>
  //   </Alert>
  // );

  const showConfirmDialog = (vehicle) => {
    return NewAlert.alert(
      "Are your sure?",
      `Do you really want to remove vehicle?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            removeVehicle(vehicle);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

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
      // setVehicle(newVehicle);
      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{result.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });

      // setStatus({ status: "success", title: result.data });
      // setShowAlert(true);
      // setTimeout(() => {
      //setShowAlert(false);
      let newVehicle = vehicleDetails.filter(
        (vehicleObj) => vehicleObj._id != vehicle._id
      );
      setVehicle(newVehicle);
      // }, 2000);

      setIsLoading(false);
    } catch (ex) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>
                {error.name === "AxiosError"
                  ? "Sorry cannot reach to server!"
                  : ex.response.data}
              </Text>
            </Box>
          );
        },
        placement: "top",
      });
      console.log(ex.response.data);
      setIsLoading(false);

      // setStatus({ status: "error", title: ex.response.data });
      // setShowAlert(true);
      // setTimeout(() => {
      //   setShowAlert(false);
      // }, 2000);
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
            rounded="lg"
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
            <Box>
              <Button
                isLoadingText="Removing vehicle.."
                size="md"
                mt={5}
                onPress={() => {
                  // setStatus({ status: "error", title: "Remvoing vehicle.." });
                  // setShowAlert(true);
                  showConfirmDialog(vehicle);
                  //removeVehicle(vehicle);
                }}
              >
                <Text fontSize={"lg"} color="white">
                  Remove vehicle
                </Text>
              </Button>
            </Box>
          </Stack>
        ))}
      </ScrollView>
    );
  }

  if (fetching) {
    return (
      <Box
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        bg="#F0F8FF"
      >
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} bg={"#F0F8FF"}>
        <Box>{showAlert ? AlertField : ""}</Box>
        <Box flex={1} alignItems={"center"} justifyContent={"center"}>
          {vehicleDetails.length ? (
            getVehicle()
          ) : (
            <Text>Please add vehicle</Text>
          )}
          <Box></Box>
        </Box>
      </Box>
    );
  }
};

export default ViewVehicles;
