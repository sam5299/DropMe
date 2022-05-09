import { TouchableHighlight } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  VStack,
  WarningOutlineIcon,
  Spinner,
  Heading,
  IconButton,
  CloseIcon,
  Select,
  Radio,
  CheckIcon,
  Slider,
  Avatar,
  ScrollView,
} from "native-base";

import { useValidation } from "react-native-form-validator";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

const AddVehicle = ({ navigation }) => {
  let [Picture, setPic] = useState(
    "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
  );
  let [vehicleType, setVehicleType] = useState("Bike");
  let [vehicleClass, setVehicleClass] = useState("");
  let [vehicleNumber, setVehicleNumber] = useState("");
  let [vehicleName, setVehicleName] = useState("");
  let [fuelType, setFuelType] = useState("");
  let [seatingCapacity, setSeatingCapacity] = useState(1);
  let [fuelTypeArray, setFuelTypeArray] = useState(["Petrol", "Electric"]);
  let [vehicleClassArray, setVehicleClassArray] = useState([
    "NormalBike",
    "SportBike",
    "Scooter",
  ]);
  const [showSpinner, setShowSpinner] = useState(false);

  let FuelTypeArray = ["Petrol", "Disel", "CNG", "Electric"];

  useEffect(() => {}, [vehicleClass, slider, Picture]);

  //validation

  const { validate, isFieldInError } = useValidation({
    state: { vehicleClass, vehicleName, vehicleNumber, fuelType },
  });

  const handleAddVehicle = async () => {
    let isTrue = validate({
      vehicleName: { required: true },
      vehicleClass: { required: true },
      vehicleNumber: { minlength: 13, required: true },
      fuelType: { required: true },
    });
    let pattern =
      /^([A-Z|a-z]{2}\s{1}\d{2}\s{1}[A-Z|a-z]{1,2}\s{1}\d{1,4})?([A-Z|a-z]{3}\s{1}\d{1,4})?$/;
    if (!pattern.test(vehicleNumber)) {
      isFieldInError.vehicleNumber = "Please enter valid vehicle number.";
    }
    if (isTrue) {
      navigation.navigate("UploadDocumentForVehicle", {
        Picture,
        vehicleType,
        vehicleClass,
        vehicleName,
        vehicleNumber,
        fuelType,
        seatingCapacity,
      });
    }
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setPic("data:image/png;base64," + result.base64);
    }
  };

  let selectForVehicleClass = (
    <Box w="3/4" maxW="400">
      <Select
        selectedValue={vehicleClass}
        minWidth="300"
        accessibilityLabel={`Choose ${vehicleType} Class`}
        placeholder={`Choose ${vehicleType} Class`}
        _selectedItem={{
          bg: "rgba(6,182,212,1.00)",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => {
          setVehicleClass(itemValue);
        }}
      >
        {vehicleClassArray.map((value) => (
          <Select.Item key={value} label={value} value={value} />
        ))}
      </Select>
      {isFieldInError("vehicleClass") && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          Please select vehicle class
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  let slider = (
    <Box alignItems={"center"}>
      <Text textAlign="center">
        Available Seats: {vehicleType === "Bike" ? 1 : seatingCapacity}
      </Text>
      <Slider
        isDisabled={vehicleType === "Bike" ? true : false}
        mt={"2"}
        w="300"
        maxW="300"
        defaultValue={seatingCapacity}
        minValue={1}
        maxValue={7}
        accessibilityLabel="Seating Capacity"
        step={1}
        onChange={(v) => {
          setSeatingCapacity(parseInt(v));
        }}
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
    </Box>
  );

  let buttonField = (
    <Stack direction={"row"} mb={2} space="20" justifyContent={"center"}>
      <Button onPress={() => navigation.goBack()}>Go Back</Button>
      <Button onPress={handleAddVehicle}>Add Vehicle</Button>
    </Stack>
  );

  let ShowSpinner = (
    <HStack space={2} justifyContent="center" mr="20%">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color="primary.500" fontSize="lg">
        Sending Mail
      </Heading>
    </HStack>
  );
  return (
    <ScrollView maxW="100%" h="80" bg={"#F0F8FF"}>
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        flex="1"
        bg={"#F0F8FF"}
      >
        <Box
          width={"90%"}
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
          <FormControl justifyContent="center" alignItems={"center"}>
            <Text color="rgba(6,182,212,1.00)" fontSize="xl" mb="2">
              Add Vehicle
            </Text>
            <TouchableHighlight
              onPress={() => uploadImage()}
              underlayColor="rgba(0,0,0,0)"
            >
              <Avatar
                bg="green.500"
                size="xl"
                source={{
                  uri: Picture,
                }}
              >
                Vehicle Image
                <Avatar.Badge bg="green.500" />
              </Avatar>
            </TouchableHighlight>

            <Stack space={6} mt="2">
              <Radio.Group
                name="Vehicle Type"
                defaultValue="Bike"
                accessibilityLabel="Select Vehicle"
                onChange={(value) => {
                  setVehicleType(value);
                  if (value === "Bike") {
                    setFuelTypeArray(["Petrol", "Electric"]);

                    setVehicleClassArray([
                      "NormalBike",
                      "SportBike",
                      "Scooter",
                    ]);
                  } else {
                    setFuelTypeArray(["Petrol", "Disel", "CNG", "Electric"]);
                    setVehicleClassArray(["HatchBack", "Seden", "SUV"]);
                  }
                }}
              >
                <Stack
                  direction={{
                    base: "row",
                    md: "column ",
                  }}
                  mr="2"
                  ml={"22%"}
                  space={10}
                  maxW="300px"
                >
                  <Radio value="Bike" size="md">
                    Bike
                  </Radio>
                  <Radio value="Car" size="md">
                    Car
                  </Radio>
                </Stack>
              </Radio.Group>
              {selectForVehicleClass}
              {/* {vehicleType === "Bike" ? selectForBike : selectForCar} */}
              <Box>
                <Input
                  maxLength={13}
                  size={"md"}
                  w="100%"
                  InputLeftElement={
                    <Icon
                      as={<MaterialCommunityIcons name="car" />}
                      size={6}
                      ml="2"
                      color="rgba(6,182,212,1.00)"
                    />
                  }
                  placeholder="Vehicle Name"
                  onChangeText={(value) => setVehicleName(value)}
                />
                {isFieldInError("vehicleName") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Vehicle name is required
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <Box>
                <Input
                  maxLength={13}
                  size={"md"}
                  w="100%"
                  InputLeftElement={
                    <Icon
                      as={<MaterialCommunityIcons name="card" />}
                      size={6}
                      ml="2"
                      color="rgba(6,182,212,1.00)"
                    />
                  }
                  placeholder="Vehicle Number"
                  onChangeText={(value) => setVehicleNumber(value)}
                />
                {isFieldInError("vehicleNumber") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Invalid vehicle number
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <Box w="3/4" maxW="400">
                <Select
                  selectedValue={fuelType}
                  minWidth="300"
                  accessibilityLabel="Fuel Type"
                  placeholder="Fuel Type"
                  _selectedItem={{
                    bg: "rgba(6,182,212,1.00)",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={(itemValue) => {
                    setFuelType(itemValue);
                  }}
                >
                  <Select.Item label="Select fuel type" disabled={true} />
                  {fuelTypeArray.map((ftype) => (
                    <Select.Item key={ftype} label={ftype} value={ftype} />
                  ))}
                </Select>
                {isFieldInError("fuelType") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {"Please select vehicle's fuel type"}
                  </FormControl.ErrorMessage>
                )}
              </Box>
              {slider}
              {buttonField}
            </Stack>
          </FormControl>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default AddVehicle;
