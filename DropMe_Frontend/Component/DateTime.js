import React, { useState } from "react";
import { Box, Modal, Icon, Input, Container, IconButton } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Time from "./Time";
import { Button } from "@rneui/themed";

const DateTime = ({ dispatch }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const [selectedTime, setTime] = useState(new Date());
  const [showClock, setClock] = useState(false);

  const onChange = (event, selectedTime) => {
    setClock(false);
    setTime(selectedTime);
    const hourse = selectedTime.getHours();
    const min = selectedTime.getMinutes();
    const time = `${hourse}:${min}`;
    dispatch({ type: "time", payload: time });
  };

  const onDateChange = (event, date) => {
    //function to handle the date change
    setShowModal(false);
    setSelectedStartDate(date);
    const curr = date.toDateString();
    dispatch({ type: "date", payload: curr });
  };

  const hourse = selectedTime.getHours();
  const min = selectedTime.getMinutes();
  const time = `${hourse}:${min}`;

  const curr = selectedStartDate.toDateString();

  return (
    <Box flexDirection="row" mt="5" justifyContent="space-between">
      <Box>
        <Container mx="3">
          <Input
            isDisabled={true}
            w="175"
            placeholder={curr}
            InputRightElement={
              <MaterialCommunityIcons
                name="calendar-arrow-left"
                color="black"
                size={40}
                onPress={() => setShowModal(true)}
              />
            }
          />
          {showModal && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedStartDate}
              mode="date"
              is24Hour={true}
              onChange={onDateChange}
            />
          )}
        </Container>
      </Box>
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
              onPress={() => setClock(true)}
            />
          }
        />

        {showClock && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedTime}
            mode="time"
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default DateTime;
