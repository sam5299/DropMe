import React, { useState, useReducer, useEffect, useContext } from "react";
import { useValidation } from "react-native-form-validator";
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
import { AuthContext } from "../Context";

const Registration = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const { signUp } = useContext(AuthContext);

  const initialState = {
    name: "",
    mobileNumber: "",
    email: "",
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

  const { name, email, mobileNumber, password } = state;
  const { validate, isFieldInError } = useValidation({
    state: { name, email, mobileNumber, password },
  });

  // useEffect(() => alert(state), [state]);

  const handleRegistration = () => {
    let isTrue = validate({
      name: { minlength: 3, required: true },
      email: { email: true, required: true },
      mobileNumber: { minlength: 10, required: true },
      password: {
        minlength: 8,
        hasNumber: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasSpecialCharacter: true,
        required: true,
      },
    });
    if (isTrue) {
      // make a call to backend and store user details
      navigation.navigate("DropMe");
    }
  };

  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#F0F8FF"}
      minH="20%"
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
        <FormControl m="5">
          <Text color="rgba(6,182,212,1.00)" fontSize={"lg"} mb="2">
            Hello!
          </Text>
          <Stack space={6} m="2">
            <Box>
              <Input
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
              {isFieldInError("name") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Username must be greater than 3
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
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
              {isFieldInError("mobileNumber") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Mobile No must be 10 digit
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
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
              {isFieldInError("email") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter valid Email
                </FormControl.ErrorMessage>
              )}
            </Box>
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
            <Box>
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
              {isFieldInError("password") && (
                <>
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Password should be at least 8 characters.
                  </FormControl.ErrorMessage>
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Containe at least one upper,lower,special character & No.
                  </FormControl.ErrorMessage>
                </>
              )}
            </Box>
            <Button w="85%" onPress={handleRegistration}>
              Sign Up
            </Button>
          </Stack>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Registration;
