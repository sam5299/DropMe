import { View, StyleSheet, ShadowPropTypesIOS } from "react-native";
import { Alert as NewAlert } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  ScrollView,
  Stack,
  Text,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Spinner,
  useToast,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";
import RideCompleted from "../../Screens/RideCompletedForHome";

function TripBooked() {
  const [bookedTripList, setBookedTripList] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const [isLoading, setIsLoading] = useState(false);
  const [isBookedTripFetchingDone, setIsBookedTripFetchDone] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertField, setAlertField] = useState({
    status: "success",
    title: "",
  });
  let [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //toast field
  const toast = useToast();

  const showConfirmDialog = (tripRideId, amount) => {
    return NewAlert.alert(
      "Are your sure?",
      `Canceling a trip reduce your credit points by Rs.${parseInt(
        amount * 0.1
      )}.\nDo you want to cancel the trip?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            CancelTrip(tripRideId);
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

  async function CancelTrip(tripRideId) {
    try {
      setIsButtonDisabled(true);
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      //console.log("deleting booked ride");
      let result = await axios.delete(
        url + `/trip/deleteBookedTrip/${tripRideId}`,
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      let newBookedTripList = [];
      bookedTripList.forEach((trip) => {
        if (trip._id != tripRideId) {
          newBookedTripList.push(trip);
        }
      });
      setAlertField({
        status: "success",
        title: "Cancelled trip successfully!",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setBookedTripList(newBookedTripList);
        setIsButtonDisabled(false);
      }, 2000);
    } catch (ex) {
      setAlertField({ status: "error", title: ex.response.data });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setIsButtonDisabled(false);
      }, 4000);
      console.log("Exception in delete", ex.response.data);
    }
  }
  useEffect(() => {
    let mounted = true;
    async function loadBookedList() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let result = await axios.get(url + "/trip/getBookedTrips", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        // console.log("result:", result.data);
        if (mounted) {
          console.log(" All Booked Trips");
          setBookedTripList(result.data);
          setToken(parseUser.userToken);
          setIsBookedTripFetchDone(false);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsVehicleFetchDone(false);
      }
      return () => (mounted = false);
    }

    loadBookedList();
    return () => (mounted = false);
  }, []);

  let showOtp = (tripRideObj) => {
    setToggleButton(false);
    //code to add join group by tripRide id
    socket.emit("join_trip", tripRideObj);
  };

  let AlertField = (
    <Alert w="100%" status={alertField.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {alertField.title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" color="coolGray.600" />}
          />
        </HStack>
      </VStack>
    </Alert>
  );

  function getBookedTrips() {
    return (
      <ScrollView w={"85%"} bg={"#F0F8FF"}>
        {bookedTripList.map((trip) => (
          // console.log(trip.amount)
          <Box
            key={trip._id}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={10}
            my={5}
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
            <Stack direction={"column"} alignItems={"center"} space={2}>
              <Text style={styles.details}>Source: {trip.tripId.source}</Text>
              <Text style={styles.details}>
                Destination : {trip.tripId.destination}
              </Text>
              <Text style={styles.details}>
                Pickup Point: {trip.tripId.pickupPoint}
              </Text>
              <Text style={styles.details}>Date: {trip.tripId.date}</Text>
              <Text style={styles.details}>Time: {trip.tripId.time}</Text>
              <Text style={styles.details}>Amount: {trip.amount}</Text>
              <Image
                source={{
                  uri: trip.RaiderId.profile,
                }}
                alt="image not available"
                size="xl"
                borderRadius={100}
              />
              <Text style={styles.details}>
                Rider Name: {trip.RaiderId.name}
              </Text>
              <Text style={styles.details}>
                Mobile No.: {trip.RaiderId.mobileNumber}
              </Text>
              <Text style={styles.details}>
                Vehicle Number: {trip.vehicleNumber}
              </Text>

              <Text style={styles.details}>OTP: {trip.token}</Text>

              {trip.status === "Booked" ? (
                <Button
                  size={"lg"}
                  px={10}
                  disabled={isButtonDisabled}
                  onPress={() => showConfirmDialog(trip._id, trip.amount)}
                >
                  Cancel trip
                </Button>
              ) : (
                <Button size={"lg"} px={10} isDisabled={true}>
                  Trip initiated
                </Button>
              )}
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box flex={1} alignItems={"center"} bg={"#F0F8FF"}>
      {isBookedTripFetchingDone ? (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          <Spinner size="lg" />
        </Box>
      ) : bookedTripList.length ? (
        getBookedTrips()
      ) : (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          No trips found
        </Box>
      )}
      {/* {getBookedTrips()}{" "} */}
    </Box>
  );
}

export default TripBooked;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
