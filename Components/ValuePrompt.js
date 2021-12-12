import React from "react";
import { View } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";
import OverlayStyles from "../Styles/OverlayStyles.js";

export default function ValuePrompt(props) {
  return (
    <Overlay isVisible={props.visible} onBackdropPress={props.onCancel}>
      <View style={OverlayStyles.containerMain}>
        <Input
          label={props.prompt}
          autoFocus={true}
          defaultValue={props.defaultValue}
          leftIcon={props.icon}
          onChangeText={(text) => props.onValueChange(text)}
          style={OverlayStyles.textInput}
          containerStyle={OverlayStyles.textInputContainer}
        />
      </View>
      <View style={OverlayStyles.containerActions}>
        <Button
          title="Cancel"
          style={OverlayStyles.actionButton}
          onPress={() => props.onCancel()}
        />
        <Button
          title="Accept"
          style={OverlayStyles.actionButton}
          onPress={() => props.onAccept()}
        />
      </View>
    </Overlay>
  );
}
