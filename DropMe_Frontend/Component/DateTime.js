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

  //function to handle time change
  const onChange = (event, selectedTime) => {
    setClock(false);
    setTime(selectedTime);
    const hourse = selectedTime.getHours();
    const min = selectedTime.getMinutes();
    const time = `${hourse}:${min}`;
    dispatch({ type: "time", payload: time });
  };

  //function to handle date change
  const onDateChange = (event, date) => {
    if (event.type === "set") {
      setShowModal(false);
      setSelectedStartDate(date);
      const curr = date.toDateString();
      dispatch({ type: "date", payload: curr });
      setClock(true);
    }
    setShowModal(false);
  };

  const hourse = selectedTime.getHours();
  const min = selectedTime.getMinutes();
  const time = `${hourse}:${min}`;

  const curr = selectedStartDate.toDateString() + " ; " + time;

  return (
    <Box flexDirection="row" mt="5" justifyContent="space-between">
      <Box>
        <Container mx="3">
          <Input
            isDisabled={true}
            w="375"
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
      {showClock && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </Box>
  );
};

export default DateTime;
