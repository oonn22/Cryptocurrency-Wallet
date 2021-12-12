import React from "react";
import { View } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";
import OverlayStyles from "../Styles/OverlayStyles.js";

export default function Alert(props) {
  return (
    <Overlay isVisible={props.visible} onBackdropPress={props.onClose}>
      <View style={OverlayStyles.containerMain}>
        <Text h3>{props.message}</Text>
      </View>
      <View style={OverlayStyles.containerActions}>
        <Button
          title="OK"
          style={OverlayStyles.actionButton}
          onPress={() => props.onClose()}
        />
      </View>
    </Overlay>
  );
}
