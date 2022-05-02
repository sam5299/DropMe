import React, { useState, useReducer, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Radio,
  Stack,
  Text,
  WarningOutlineIcon,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Registration = ({ navigation }) => {
  const [error, setError] = useState({ isError: false, missingField: "" });
  const [show, setShow] = useState(false);

  const initialState = {
    name: "",
    email: "",
    mobileNumber: "",
    gender: "Male",
    password: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "name":
        return {
          ...state,
          name: action.payload,
        };
      case "mobileNumber":
        return {
          ...state,
          mobileNumber: action.payload,
        };
      case "email":
        return {
          ...state,
          email: action.payload,
        };
      case "gender":
        return {
          ...state,
          gender: action.payload,
        };
      case "password":
        return {
          ...state,
          password: action.payload,
        };
      case "default":
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  //useEffect(() => alert(state.password), [state]);

  const handleRegistration = () => {
    for (const key in state) {
      if (state[key] === "") {
        const errorField = key.toString();
        setError({ isError: true, missingField: errorField });
        setTimeout(() => setError({ isError: false, missingField: "" }), 4000);
        return;
      }
    }
    navigation.navigate("DropMe");
  };

  return (
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
        <FormControl m="5" isInvalid={error.isError}>
          <Text color="rgba(6,182,212,1.00)" fontSize={"lg"} mb="2">
            Hello!
          </Text>
          <Stack space={6} m="2">
            <Input
              type="numeric"
              size={"md"}
              w="85%"
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name="account" />}
                  size={6}
                  ml="2"
                  color="rgba(6,182,212,1.00)"
                />
              }
              placeholder="Enter the full name"
              onChangeText={(value) =>
                dispatch({ type: "name", payload: value })
              }
            />
            <Input
              keyboardType="numeric"
              size={"md"}
              w="85%"
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name="phone" />}
                  size={6}
                  ml="2"
                  color="rgba(6,182,212,1.00)"
                />
              }
              placeholder="Mobile No"
              onChangeText={(value) =>
                dispatch({ type: "mobileNumber", payload: value })
              }
            />

            <Input
              size={"md"}
              w="85%"
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name="email" />}
                  size={6}
                  ml="2"
                  color="rgba(6,182,212,1.00)"
                />
              }
              placeholder="Email"
              onChangeText={(value) =>
                dispatch({ type: "email", payload: value })
              }
            />
            <Box flexDirection={"row"}>
              <Text fontSize={"md"} mr="2">
                Gender:
              </Text>
              <Radio.Group
                name="Gender"
                defaultValue="Male"
                accessibilityLabel="Gender"
                onChange={(value) =>
                  dispatch({ type: "gender", payload: value })
                }
              >
                <Stack
                  mt={"1"}
                  direction={{
                    base: "row",
                    md: "column ",
                  }}
                  space={3}
                  maxW="300px"
                >
                  <Radio value="Male" size="sm">
                    Male
                  </Radio>
                  <Radio value="Female" size="sm">
                    Female
                  </Radio>
                  <Radio value="Other" size="sm">
                    Other
                  </Radio>
                </Stack>
              </Radio.Group>
            </Box>
            <Input
              size={"md"}
              w="85%"
              type={show ? "text" : "password"}
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name={"security"} />}
                  size={6}
                  ml="2"
                  color="#06B6D4"
                />
              }
              InputRightElement={
                <Icon
                  as={
                    <MaterialCommunityIcons name={show ? "eye" : "eye-off"} />
                  }
                  size={6}
                  mr="2"
                  color="#06B6D4"
                  onPress={() => setShow(!show)}
                />
              }
              placeholder="Create Password"
              onChangeText={(value) =>
                dispatch({ type: "password", payload: value })
              }
            />
            <Button w="85%" onPress={handleRegistration}>
              Sign Up
            </Button>
          </Stack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please enter {error.missingField} field.
          </FormControl.ErrorMessage>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Registration;
