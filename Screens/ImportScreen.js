import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Alert from "../Components/Alert.js";
import Crypto from "../Crypto/Crypto.js";
import Styles from "../Styles/Styles.js";
import Wallet from "../Wallet/Wallet.js";

//TODO validate inputs

export default class ImportScreen extends Component {
  state = {
    secret: "",
    passwd: "",
    loading: false,
    alertVisible: false,
  };

  constructor(props) {
    super(props);
    this.unlockBtnRef = React.createRef();
    this.passwordInRef = React.createRef();
  }

  async processInput() {
    let decrypted = undefined;
    let encryptedSecret = undefined;

    let secretInput = this.state.secret;

    if (
      secretInput.length > 0 &&
      Crypto.canDecode(secretInput.replaceAll("-", ""))
    ) {
      if (secretInput.length === 52) {
        await this.newWalletFromSecret();
      } else {
        await this.newWalletFromEncryptedSecret();
      }
    } else {
      this.setState({ loading: false });
      this.setState({ alertVisible: true });
    }
  }

  async newWalletFromSecret() {
    let secret = Cryto.decode(this.state.secret);
    let address = Crypto.getPublic(secret);
    let encryptedSecret = await Crypto.encrypt(secret, this.state.passwd);

    this.setState({ loading: false });

    global.Wallet = new Wallet(address, encryptedSecret);
    this.props.navigation.navigate("WalletScreen");
  }

  async newWalletFromEncryptedSecret() {
    let decryptedSecret = await Crypto.decrypt(
      this.state.secret,
      this.state.passwd
    );

    this.setState({ loading: false });

    if (decryptedSecret) {
      global.Wallet = new Wallet(
        Crypto.getPublic(decryptedSecret),
        this.state.secret
      );
      this.props.navigation.navigate("WalletScreen");
    } else {
      this.passwordInRef.current.shake();
      this.passwordInRef.current.clear();
      this.setState({ passwd: "" });
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <Alert
          visible={this.state.alertVisible}
          message="Error processing secret!"
          onClose={() => {
            this.setState({ alertVisible: false });
          }}
        />
        <Input
          label="Enter Secret:"
          placeholder="Secret"
          leftIcon={{ type: "font-awesome", name: "user-secret" }}
          onChangeText={(text) => this.setState({ secret: text })}
          editable={!this.state.loading}
          style={Styles.textInput}
          containerStyle={Styles.textInputContainer}
        />
        <Input
          ref={this.passwordInRef}
          label="Enter password: "
          placeholder="password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => this.setState({ passwd: text })}
          editable={!this.state.loading}
          secureTextEntry={true}
          style={Styles.textInput}
          containerStyle={Styles.textInputContainer}
        />
        <View style={Styles.containerRow}>
          {!this.state.loading ? (
            <RejectButton navigation={this.props.navigation} />
          ) : undefined}
          <Button
            ref={this.unlockBtnRef}
            icon={{ type: "font-awesome", name: "unlock" }}
            onPress={() => {
              this.setState({ loading: true });

              setTimeout(async () => {
                this.processInput();
              }, 100); //delay needed for mobile anims
            }}
            buttonStyle={Styles.buttonRow}
            loading={this.state.loading}
          />
        </View>
      </View>
    );
  }
}

class RejectButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button
        icon={{ type: "font-awesome", name: "window-close" }}
        onPress={() => this.props.navigation.navigate("Start")}
        buttonStyle={Styles.buttonRow}
      />
    );
  }
}
