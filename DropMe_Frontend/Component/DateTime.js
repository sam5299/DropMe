import React, { useState } from "react";
import { Box, Icon, Button, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    <Box ml={3} mt="5" w={"95%"} flexDir={"row"}>
      <Button
        flexBasis={"400"}
        flexShrink="1"
        flexGrow={1}
        justifyContent="space-between"
        variant="outline"
        rightIcon={
          <Icon
            as={<MaterialCommunityIcons name="calendar-arrow-left" />}
            size={6}
            color="rgba(6,182,212,1.00)"
            ml={"48%"}
          />
        }
        onPress={() => setShowModal(true)}
      >
        <Text color={"gray.400"}>{curr}</Text>
      </Button>
      {showModal && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedStartDate}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

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
