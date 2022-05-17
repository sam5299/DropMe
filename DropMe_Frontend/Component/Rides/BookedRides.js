import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  Stack,
  Image,
  Button,
  ScrollView,
  Divider,
  Modal,
  FormControl,
  Input,
  Center,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const BookedRides = ({ navigation }) => {
  const [bookedRides, setbookedRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [userToken, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passengerToken, setPassengerToken] = useState(null);
  const [validate, setValidate] = useState(false);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setToken(userDetails.userToken);
        const allRides = await axios.get(url + "/ride/getBookedRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        setbookedRides(allRides.data);
        // console.log("@@@", allRides.data);
        setShowRides(false);
      } catch (error) {
        console.log("Booked Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, []);

  const startTrip = async (tripRideId, tripId, status, token) => {
    // console.log(tripRideId, tripId, status, token);
    //  setShowModal(true);

    try {
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, token },
        { headers: { "x-auth-token": userToken } }
      );

      alert(result.data);
    } catch (error) {
      console.log("Booked Rides: ", error.response.data);
    }
  };

  function allUserRides() {
    return (
      <ScrollView>
        {bookedRides.map((ride) => (
          <Box
            key={ride._id}
            mb={5}
            mx={5}
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
            <Stack
              direction={"column"}
              alignItems="center"
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  uri: ride.PassengerId.profile,
                  //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
                }}
                alt="Alternate Text"
                size={"xl"}
                borderRadius={100}
                bg="red.100"
              />
              <Text fontSize={18} fontWeight="bold">
                {ride.PassengerId.name}
              </Text>
              <Box justifyContent={"flex-start"}>
                <Text fontSize={18} fontWeight="bold">
                  From:
                </Text>
                <Text fontSize={15}>{ride.tripId.source}</Text>
                <Text fontSize={18} fontWeight="bold" p={1}>
                  To:
                </Text>
                <Text fontSize={15}>{ride.tripId.destination}</Text>

                <Text fontSize={18} fontWeight="bold" p={1}>
                  Mobile No:
                </Text>
                <Text fontSize={15}>{ride.PassengerId.mobileNumber}</Text>
                <Text fontSize={18} fontWeight="bold" p={1}>
                  Time:
                </Text>
                <Text fontSize={15}>12:24</Text>
              </Box>
              <Divider mb={2} />
              <Stack direction={"row"} space={5} mt={2}>
                <Button
                  onPress={() =>
                    startTrip(
                      ride._id,
                      ride.tripId._id,
                      "Initiated",
                      ride.token
                    )
                  }
                  px={5}
                >
                  Start Trip
                </Button>
                <Center>
                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Enter the token</Modal.Header>
                      <Modal.Body>
                        <FormControl mt="3">
                          <Input
                            keyboardType="numeric"
                            onChangeText={(value) => setPassengerToken(value)}
                          />
                        </FormControl>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal(false);
                              setValidate(true);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                </Center>
                <Button
                  colorScheme="secondary"
                  onPress={() =>
                    startTrip(
                      ride._id,
                      ride.tripId._id,
                      "Completed",
                      ride.token
                    )
                  }
                  px={5}
                >
                  Cancel Trip
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#F0F8FF"}>
        <Box mt={2}>
          {bookedRides.length ? (
            allUserRides()
          ) : (
            <Box flex={1} justifyContent="center" alignItems={"center"}>
              <Text>No Rides!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default BookedRides;
