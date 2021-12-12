import React, { Component, useState } from "react";
import { View } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";
import ScreenHeader from "../Components/ScreenHeader.js";
import ValuePrompt from "../Components/ValuePrompt.js";
import PasswordPrompt from "../Components/PasswordPrompt.js";
import * as Clipboard from "expo-clipboard";
import Styles from "../Styles/Styles.js";
import Crypto from "../Crypto/Crypto.js";

export default class SettingsScreen extends Component {
  state = {
    nodeOverlayVisible: false,
    passwdOverlayVisible: false,
    nodeURL: global.Wallet.nodeURL,
  };

  constructor(props) {
    super(props);
    this.toast = global.Toast;
    this.wallet = global.Wallet;
  }

  copyToClipboard(text) {
    Clipboard.setString(text);
    this.toast.show("Copied to clipboard.", { duration: 2000 });
  }

  render() {
    return (
      <View style={Styles.container}>
        <ScreenHeader
          title="SETTINGS"
          nav={this.props.navigation}
          enabled={true}
        />

        <ValuePrompt
          visible={this.state.nodeOverlayVisible}
          prompt="Enter Node URL:"
          defaultValue={this.wallet.nodeURL}
          icon={{ type: "font-awesome-5", name: "link" }}
          onValueChange={(text) => this.setState({ nodeURL: text })}
          onCancel={() => this.setState({ nodeOverlayVisible: false })}
          onAccept={() => {
            this.wallet.nodeURL = this.state.nodeURL;
            this.toast.show("Value Changed", { duration: 2000 });
            this.setState({ nodeOverlayVisible: false });
          }}
        />

        <PasswordPrompt
          visible={this.state.passwdOverlayVisible}
          checkPassword={async (passwd) => {
            return await this.wallet.decryptSecret(passwd);
          }}
          onPasswordAccept={(checkPasswdReturn) => {
            let secret = Crypto.encode(checkPasswdReturn);
            this.setState({ passwdOverlayVisible: false });
            this.copyToClipboard(secret); //has to be after overlay closed, or copy doesnt work on web...
          }}
          onPasswordReject={(checkPasswdReturn) => {}}
          onCancel={() => this.setState({ passwdOverlayVisible: false })}
        />

        <View
          style={{
            flex: 1,
            alignContent: "center",
            alignSelf: "stretch",
          }}
        >
          <Button
            title="Change Node URL"
            buttonStyle={Styles.button}
            onPress={() => this.setState({ nodeOverlayVisible: true })}
          />
          <Button
            title="Export Encrypted Secret"
            buttonStyle={Styles.button}
            onPress={() => {
              this.copyToClipboard(this.wallet.encrypted);
            }}
          />
          <Button
            title="Export Decrypted Secret"
            buttonStyle={Styles.button}
            onPress={() => this.setState({ passwdOverlayVisible: true })}
          />
        </View>
      </View>
    );
  }
}
