import { View, Text } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Container, Input, Modal } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@rneui/base";

const Time = () => {
  const [selectedTime, setTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const onChange = (event, selectedTime) => {
    setShowModal(false);
    setTime(selectedTime);
  };

  const hourse = selectedTime.getHours();
  const min = selectedTime.getMinutes();

  const time = `${hourse}:${min}`;

  return (
    <Container mx="3">
      <Input
        isDisabled={true}
        w="175"
        placeholder={time}
        InputRightElement={
          <MaterialCommunityIcons
            name="clock"
            color="black"
            size={40}
            onPress={() => setShowModal(true)}
          />
        }
      />

      {showModal && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </Container>
  );
};

export default Time;
