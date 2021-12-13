import React, { Component, useState } from "react";
import { Text, View, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import Crypto from "../Crypto/Crypto.js";
import Styles from "../Styles/Styles.js";
import Wallet from "../Wallet/Wallet.js";

export default class CreateWalletScreen extends Component {
  state = {
    passwd: "",
    chkPasswd: "",
    loading: false,
  };

  constructor(props) {
    super(props);
    this.confirmBtnRef = React.createRef();
    this.passwordInRef = React.createRef();
    this.passwordChkInRef = React.createRef();
  }

  checkPasswords() {
    return this.state.passwd === this.state.chkPasswd;
  }

  render() {
    return (
      <View style={Styles.container}>
        <Input
          ref={this.passwordInRef}
          label="Enter Password:"
          placeholder="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => this.setState({ passwd: text })}
          editable={!this.state.loading}
          secureTextEntry={true}
          style={Styles.textInput}
          containerStyle={Styles.textInputContainer}
        />
        <Input
          ref={this.passwordChkInRef}
          label="Confirm password: "
          placeholder="Confirm"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => this.setState({ chkPasswd: text })}
          editable={!this.state.loading}
          secureTextEntry={true}
          style={Styles.textInput}
          containerStyle={Styles.textInputContainer}
        />
        <View style={Styles.containerRow}>
          {
            !this.state.loading ? (
              <RejectButton navigation={this.props.navigation} /> //if not loading, display reject button
            ) : undefined //else
          }

          <Button
            ref={this.confirmBtnRef}
            icon={{ type: "font-awesome", name: "check" }}
            onPress={() => {
              if (this.checkPasswords()) {
                this.setState({ loading: true });

                setTimeout(async () => {
                  let wallet = await Wallet.createWallet(this.state.passwd);
                  this.setState({ loading: false });

                  global.Wallet = wallet;
                  this.props.navigation.navigate("WalletScreens");
                }, 100); //delay allows loading anim to play on mobile
              } else {
                this.passwordInRef.current.shake();
                this.passwordChkInRef.current.shake();
              }
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
