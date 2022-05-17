import { React, useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  AlertDialog,
  Center,
} from "native-base";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";
import axios from "axios";
import { StyleSheet, View } from "react-native";

const Balance = ({ navigation }) => {
  const [status, setStatus] = useState({ status: "", title: "" });
  const [isPageLoading, setIspageLoading] = useState(false);
  const [userToken, setToken] = useState(null);
  const [wallet, setBalance] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false); //alert field
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  let AlertField = (
    <Box>
      <Alert w="100%" status={status.status}>
        <VStack space={2} flexShrink={1} w="100%">
          <HStack flexShrink={1} space={2} justifyContent="space-between">
            <HStack space={2} flexShrink={1}>
              <Alert.Icon mt="1" />
              <Text fontSize="md" color="coolGray.800">
                {status.title}
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
    </Box>
  );

  useEffect(() => {
    let mounted = true;
    async function fetchUserData() {
      try {
        setIspageLoading(true);
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        //console.log("parseUser@@@:", parseUser.userToken.trim());
        setToken(parseUser.userToken);

        let result = await axios.get(url + "/wallet/getWalletDetails", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        console.log(result.data.creditPoint);
        if (mounted) {
          setToken(parseUser.userToken);
          setBalance(result.data);
          setIspageLoading(false);
        }
      } catch (ex) {
        console.log(ex);
        if (true) {
          setStatus({ status: "error", title: "error" });
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 2000);
        }
        // console.log(ex.response.data);
      }
    }
    fetchUserData();

    return () => (mounted = false);
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    console.log("Hii handle Delete done");
    setVisible(false);
  };

  let confirmAlert = (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this account? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>
    </View>
  );

  let reedeemSafetyPoints = async () => {
    console.log("method called");
    try {
      setShowConfirmAlert(true);
      setIsLoading(true);
      let result = await axios.put(
        url + "/wallet/reedeemSafetyPoints",
        {},
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      );
      console.log(result.data);
      setBalance(result.data); //adding data into wallet to changed into ui
      setIsLoading(false);
      setStatus({
        status: "success",
        title: "Safety point's redeemed successfull!",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (ex) {
      console.log("Exception:", ex);
      setIsLoading(false);
      setStatus({ status: "error", title: ex.response.data });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  //rendering page
  if (isPageLoading) {
    return (
      <Box flex={1} justifyContent={"center"} alignItems={"center"}>
        <Text>Loading..</Text>
      </Box>
    );
  } else {
    return (
      <Box alignItems={"center"} display={"flex"} bg={"#F0F8FF"}>
        {showAlert ? AlertField : ""}
        {showConfirmAlert ? confirmAlert : ""}
        <Box
          bg={"#aaa"}
          justifyContent={"center"}
          borderRadius={10}
          flexDirection="row"
          rounded="lg"
          borderColor="coolGray.200"
          mt="30%"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.500",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.100",
          }}
        >
          <Stack space={5} direction={"column"} m="5">
            <Box
              backgroundColor={"blue.100"}
              borderRadius={10}
              alignContent="center"
              alignItems="center"
            >
              <Text fontWeight={"bold"} mx={5} fontSize={30}>
                {wallet.creditPoint}
              </Text>
              <Text fontWeight={"bold"} fontSize={15} mb={2}>
                Credit{"\n"}Points
              </Text>
            </Box>
            <Button
              onPress={() => {
                navigation.navigate("PaymentInterFace");
              }}
            >
              <Text fontSize={"sm"} fontWeight={"bold"} color="white">
                Add Credits
              </Text>
            </Button>
            {/* <Button
              onPress={() =>
                setBalance({
                  safetyPoints: 0,
                  creditPoints: wallet.creditPoints + wallet.safetyPoints,
                })
              }
            >
              <Text fontSize={"sm"} fontWeight={"bold"} color="white">
                Withdraw Credits
              </Text>
            </Button> */}
          </Stack>
          <Stack space={5} direction={"column"} m="5">
            <Box
              backgroundColor={"blue.100"}
              borderRadius={10}
              alignContent="center"
              alignItems="center"
            >
              <Text fontWeight={"bold"} mx={5} fontSize={30}>
                {wallet.safetyPoint}
              </Text>
              <Text fontWeight={"bold"} fontSize={15} mb={2}>
                Safety{"\n"}Points
              </Text>
            </Box>
            <Button
              isLoading={isLoading}
              isLoadingText="converting..."
              onPress={() => reedeemSafetyPoints()}
            >
              <Text fontSize={"sm"} fontWeight={"bold"} color="white">
                Redeem Points
              </Text>
            </Button>
          </Stack>
        </Box>
        <Box width={"90%"}>
          <Button small primary>
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              View History
            </Text>
          </Button>
        </Box>
      </Box>
    );
  }
};

export default Balance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
