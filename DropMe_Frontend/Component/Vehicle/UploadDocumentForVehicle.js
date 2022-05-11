import { View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
//import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Text,
  WarningOutlineIcon,
  Spinner,
  HStack,
  Heading,
  Alert,
  VStack,
  IconButton,
  CloseIcon,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useValidation } from "react-native-form-validator";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";

const UploadDocumentForVehicle = ({ route, navigation }) => {
  let [userData, setUserData] = useState({});
  let [licenseNumber, setLicenseNumber] = useState(null);
  let [licenseImage, setLicenseImage] = useState(null);
  let [rcBookImage, setRcBookImage] = useState(null);
  let [pucImage, setPucImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [status, setStatus] = useState({ status: "", title: "" });
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const {
    Picture,
    vehicleType,
    vehicleClass,
    vehicleName,
    vehicleNumber,
    fuelType,
    seatingCapacity,
  } = route.params;

  useEffect(() => {
    let mounted = true;
    async function fetchUserData() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);

        let result = await axios.get(url + "/user/getUser", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        console.log("Upload Document Vehicle:", result.data);
        if (mounted) {
          setToken(parseUser.userToken);
          setUserData(result.data);
        }
      } catch (ex) {
        console.log("Exception:", ex.response.data);
        if (true) {
          setStatus({ status: "error", title: ex.response.data });
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

  const uploadImage = async (docName) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      if (docName === "licenseImage")
        setLicenseImage("data:image/png;base64," + result.base64);
      if (docName === "rcBookImage")
        setRcBookImage("data:image/png;base64," + result.base64);
      if (docName === "pucImage")
        setPucImage("data:image/png;base64," + result.base64);
    }
  };

  //validation
  const { validate, isFieldInError } = useValidation({
    state: { rcBookImage, pucImage, licenseNumber, licenseImage },
  });

  const handleUploadDocument = async () => {
    let body = {
      vehicleName: vehicleName,
      vehicleNumber: vehicleNumber,
      vehicleType: vehicleType,
      seatingCapacity: seatingCapacity,
      vehicleClass: vehicleClass,
      vehicleImage: Picture,
      rcBookImage: rcBookImage,
      fuelType: fuelType,
      pucImage: pucImage,
    };
    console.log(body);
    if (userData.licenseNumber === null && userData.licenseImage === null) {
      let pattern =
        /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
      if (!pattern.test(licenseNumber)) {
        isFieldInError.licenseNumber = "Please enter valid license number!";
      }
      if (licenseImage.trim().length === 0) {
        isFieldInError.licenseImage = "License Image is required!";
      }
      //add license properties
      body.licenseNumber = licenseNumber;
      body.licenseImage = licenseImage;
    }

    let isTrue = validate({
      rcBookImage: { required: true, minlength: 4 },
      pucImage: { required: true, minlength: 4 },
      licenseImage: {
        required: userData.licenseNumber === null ? true : false,
      },
      licenseNumber: {
        required: userData.licenseNumber === null ? true : false,
      },
    });
    if (isTrue) {
      try {
        setShowSpinner(true);
        let result = await axios.post(url + "/vehicle/addVehicle", body, {
          headers: {
            "x-auth-token": userToken,
          },
        });
        setShowSpinner(false);

        setStatus({
          status: "success",
          title: "Vehicle Added.",
        });
        setShowAlert(true);
        console.log("Add vehicle done..");
      } catch (ex) {
        setShowSpinner(false);
        setStatus({ status: "error", title: ex.response.data });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
        console.log("exception:" + ex.response.data);
      }
    }
  };

  let buttonField = (
    <Button
      w={"200"}
      h={50}
      ml={2}
      mb={2}
      mt={5}
      onPress={() => handleUploadDocument()}
    >
      Upload Documents
    </Button>
  );

  let ShowSpinner = (
    <HStack space={2} justifyContent="center" mt={"20%"} mr="30%">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color="primary.500" fontSize="xl">
        Adding Vehicle Details
      </Heading>
    </HStack>
  );

  let AlertField = (
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
  );

  let licenseNumberInput = (
    <Box>
      <Input
        maxLength={16}
        size={"md"}
        w="80%"
        mt={2}
        mb={1}
        InputLeftElement={
          <Icon
            as={<MaterialCommunityIcons name="card" />}
            size={6}
            ml="2"
            color="rgba(6,182,212,1.00)"
          />
        }
        placeholder="License Number"
        onChangeText={(value) => setLicenseNumber(value.toLocaleUpperCase())}
      />
      {isFieldInError("licenseNumber") && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          Invalid License Number.
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  let licenseImageInput = (
    <Box>
      <Box w={"95%"}>
        <Box mt="5" w={"95%"} flexDir={"row"} alignItems="center">
          <Avatar
            bg="green.500"
            size="xl"
            source={{
              uri: licenseImage,
            }}
          >
            <Text fontSize={"sm"}>License Image</Text>
          </Avatar>
          <Button
            w={"200"}
            h={10}
            ml={2}
            mb={2}
            variant="outline"
            colorScheme="primary"
            onPress={() => uploadImage("licenseImage")}
          >
            Add License Image
          </Button>
        </Box>
      </Box>
      {isFieldInError("licenseImage") && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          License Image is required!
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  return (
    <ScrollView
      _contentContainerStyle={{
        px: "20px",
        mb: "4",
        minW: "72",
      }}
    >
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        flex="1"
        bg={"#F0F8FF"}
      >
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor={"coolGray.200"}
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
          {showAlert ? AlertField : ""}
          <FormControl justifyContent="center" alignItems={"center"}>
            <Text color="rgba(6,182,212,1.00)" fontSize="xl" mb="2">
              {"Add Vehicle Detail's"}
            </Text>
            {userData.licenseNumber === null ? licenseNumberInput : ""}
            {userData.licenseImage === null ? licenseImageInput : ""}
            <Box alignItems={"center"}>
              <Box ml={3} w={"95%"} flexDir={"row"}>
                <Box
                  mt="5"
                  w={"95%"}
                  flexDir={"row"}
                  alignItems="center"
                  justifyContent={"flex-start"}
                >
                  <Avatar
                    bg="green.500"
                    size="xl"
                    source={{
                      uri: rcBookImage,
                    }}
                  >
                    <Text fontSize={"sm"}>RC Book</Text>
                  </Avatar>
                  <Button
                    w={"200"}
                    h={10}
                    ml={2}
                    mb={2}
                    variant="outline"
                    colorScheme="primary"
                    onPress={() => uploadImage("rcBookImage")}
                  >
                    Add RC Book Image
                  </Button>
                </Box>
              </Box>
              {isFieldInError("rcBookImage") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  RC Book Image is required!
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box alignItems={"center"}>
              <Box ml={3} w={"95%"} flexDir={"row"}>
                <Box
                  mt="5"
                  w={"95%"}
                  flexDir={"row"}
                  alignItems="center"
                  justifyContent={"flex-start"}
                >
                  <Avatar
                    bg="green.500"
                    size="xl"
                    source={{
                      uri: pucImage,
                    }}
                  >
                    <Text fontSize={"sm"}>PUC Image</Text>
                  </Avatar>
                  <Button
                    w={"200"}
                    h={10}
                    ml={2}
                    mb={2}
                    variant="outline"
                    colorScheme="primary"
                    onPress={() => uploadImage("pucImage")}
                  >
                    Add PUC Image
                  </Button>
                </Box>
              </Box>
              {isFieldInError("pucImage") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  PUC Image is required!
                </FormControl.ErrorMessage>
              )}
            </Box>
            {/* add button to handle click event */}
            {showSpinner ? ShowSpinner : buttonField}
          </FormControl>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default UploadDocumentForVehicle;
