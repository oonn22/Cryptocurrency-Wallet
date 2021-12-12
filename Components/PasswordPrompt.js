import React, { useState } from "react";
import { View } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";
import OverlayStyles from "../Styles/OverlayStyles.js";

export default function PasswordPrompt(props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const passIn = React.useRef();

  const rejectButton = () => {
    return (
      <Button
        title="Cancel"
        style={OverlayStyles.actionButton}
        onPress={() => props.onCancel()}
      />
    );
  };

  return (
    <Overlay isVisible={props.visible} onBackdropPress={props.onCancel}>
      <View style={OverlayStyles.containerMain}>
        <Input
          ref={passIn}
          label="Enter Password: "
          autoFocus={true}
          secureTextEntry={true}
          leftIcon={{ type: "font-awesome-5", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          style={OverlayStyles.textInput}
          containerStyle={OverlayStyles.textInputContainer}
        />
      </View>
      <View style={OverlayStyles.containerActions}>
        {!loading ? rejectButton() : undefined}
        <Button
          title="Accept"
          style={OverlayStyles.actionButton}
          loading={loading}
          onPress={() => {
            setLoading(true);

            setTimeout(async () => {
              let passwdCheck = await props.checkPassword(password);
              setLoading(false);

              if (passwdCheck) {
                props.onPasswordAccept(passwdCheck);
              } else {
                passIn.current.shake();
                passIn.current.clear();
                setPassword("");
                props.onPasswordReject(passwdCheck);
              }
            }, 100);
          }}
        />
      </View>
    </Overlay>
  );
}
