import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useValidation } from "react-native-form-validator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const PaymentInterface = ({ navigation }) => {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [userToken, setToken] = useState(null);
  const [status, setStatus] = useState({ status: "", title: "" });
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const { validate, isFieldInError } = useValidation({
    state: { cardHolderName, cardCvv, cardNumber, amount },
  });

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
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      //console.log("parseUser@@@:", parseUser.userToken.trim());
      setToken(parseUser.userToken);
    }
    fetchUserData();
    return () => (mounted = false);
  }, []);

  const handleAddCreditPoint = async () => {
    let isTrue = validate({
      cardHolderName: { required: true },
      cardNumber: { required: true },
      cardCvv: { required: true },
      amount: { required: true },
    });

    if (isTrue) {
      let pattern = /\d{16}/;
      let namePattern = /\{w+' '}+/;
      if (!pattern.test(cardNumber)) {
        console.log("card number is not right");
        setStatus({
          status: "error",
          title: "Invalid card number!",
        });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          return;
        }, 5000);
      } else if (!namePattern.test(cardHolderName)) {
        setStatus({
          status: "error",
          title: "Invalid card holder name!",
        });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          return;
        }, 5000);
      } else {
        setIsLoading(true);
        try {
          let body = {
            method: "Card Payment",
            date: new Date().toDateString(),
            amount: amount,
          };
          const result = await axios.post(
            `${url}/walletHistory/addHistory`,
            body,
            {
              headers: {
                "x-auth-token": userToken,
              },
            }
          );
          setIsLoading(false);
          setStatus({
            status: "success",
            title: "Credit added successfully!",
          });
          setShowAlert(true);
          console.log("Add balance done.");
          setTimeout(() => {
            navigation.navigate("Balance", { amount });
          }, 1000);
        } catch (exception) {
          console.log(
            "exception at PaymentInterface:",
            exception.response.data
          );
          setIsLoading(false);
          setStatus({
            status: "error",
            title: "Please Add Valid Amount",
          });
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        }
      }
    }
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
        {showAlert ? AlertField : ""}
        <FormControl m="5" isInvalid={error}>
          <Text color="rgba(6,182,212,1.00)" fontSize={"lg"} mb="2">
            Add Credit points
          </Text>
          <Stack space={6} m="2">
            <Box>
              <Input
                maxLength={50}
                keyboardType="default"
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
                placeholder="Card holder name"
                onChangeText={(value) => setCardHolderName(value)}
              />
              {isFieldInError("cardHolderName") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add card holder name
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                maxLength={16}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="card" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Card number"
                onChangeText={(value) => {
                  setCardNumber(value);
                }}
              />
              {isFieldInError("cardNumber") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add card number
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                type="password"
                maxLength={3}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="card" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Card CVV"
                onChangeText={(value) => setCardCvv(value)}
              />
              {isFieldInError("cardCvv") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add card cvv
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                maxLength={20}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="cash" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Amount"
                onChangeText={(value) => setAmount(value)}
              />
              {isFieldInError("amount") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add amount to credit
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Button
                isLoading={isLoading}
                isLoadingText="Adding credits..."
                size="md"
                w={"85%"}
                onPress={handleAddCreditPoint}
              >
                <Text fontSize={"lg"} color="white">
                  Proceed to payment
                </Text>
              </Button>
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Box>
  );
};

export default PaymentInterface;
