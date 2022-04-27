import { View, Text } from "react-native";
import React, { useState } from "react";
import { Box, Modal, Button, Icon, Input } from "native-base";
import CalendarPicker from "react-native-calendar-picker/CalendarPicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Time from "./Time";

const DateTime = () => {
  const [selectedStartDate, setSelectedStartDate] = useState("Select Date");
  const [showModal, setShowModal] = useState(false);

  const onDateChange = (date, type) => {
    //function to handle the date change
    const dateTime = date.toString();
    let position = dateTime.search("12");
    const currentDate = dateTime.substring(0, position);
    setSelectedStartDate(currentDate);
  };

  return (
    <Box flexDirection="row" mt="5" justifyContent="space-between">
      <Box mx="3">
        <Input
          isDisabled={true}
          w="175"
          placeholder={selectedStartDate}
          InputRightElement={
            <MaterialCommunityIcons
              name="calendar"
              color="black"
              size={40}
              onPress={() => setShowModal(true)}
            />
          }
        />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content w="100%">
            <Modal.Body>
              <Box>
                <CalendarPicker
                  startFromMonday={true}
                  minDate={new Date()}
                  previousTitle="Previous"
                  nextTitle="Next"
                  todayBackgroundColor="#e6ffe6"
                  selectedDayColor="#A8A8A8"
                  selectedDayTextColor="#000000"
                  scaleFactor={375}
                  width={375}
                  onDateChange={onDateChange}
                />
              </Box>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                    setSelectedStartDate(selectedStartDate);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
      <Box>
        <Time />
      </Box>
    </Box>
  );
};

export default DateTime;
