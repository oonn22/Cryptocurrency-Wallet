import React, { Component, useState } from "react";
import { View, TouchableHighlight } from "react-native";
import { Text, Image, Header, Input, Button } from "react-native-elements";
import ScreenHeader from "../Components/ScreenHeader.js";
import * as Clipboard from "expo-clipboard";
import Styles from "../Styles/Styles.js";
import PasswordPrompt from "../Components/PasswordPrompt.js";
import Alert from "../Components/Alert.js";

//todo allow long press to paste

export default class WalletScreen extends Component {
  state = {
    recipient: "",
    sendAmount: "",
    balance: 0,
    loading: false,
    passwdOverlayVisible: false,
    alertMessage: "",
    alertVisible: false,
  };

  constructor(props) {
    super(props);
    this.amountInRef = React.createRef();
    this.recipientInRef = React.createRef();

    this.lastValidSendAmount = this.state.sendAmount;
    this.wallet = global.Wallet;
    this.toast = global.Toast;
    console.log(this.wallet);
  }

  async updateWallet() {
    this.setState({ loading: true });
    this.setState({ balance: await this.wallet.getBalance() });
    this.setState({ loading: false });
  }

  async performTransaction(amount, recipient, secret) {
    this.setState({ loading: true });

    let transactionResult = await this.wallet.sendTransaction(
      amount,
      recipient,
      undefined,
      secret
    );
    console.log(transactionResult);

    if (transactionResult) {
      this.setState({ alertMessage: "Successfully sent!" });
      this.setState({ alertVisible: true });
    } else {
      this.setState({ alertMessage: "Error while sending!" });
      this.setState({ alertVisible: true });
    }

    this.setState({ loading: false });
  }

  processSendAmountText(text) {
    let valid = /^$|^\d+(\.)?(\d{1,6})?$/;

    if (valid.test(text)) {
      this.setState({ sendAmount: text });
    } else {
      this.amountInRef.current.shake();
      this.setState({ sendAmount: this.lastValidSendAmount });
    }
  }

  parseSendAmount() {
    let amount = this.state.sendAmount;
    if (amount !== "") return Number.parseInt(amount.replace(".", ""));
    else return null;
  }

  balanceToString() {
    let bal = this.state.balance.toString();

    if (bal === "0") return bal;
    else {
      if (bal.length <= 6) {
        return "0." + "0".repeat(6 - bal.length) + bal;
      } else {
        return bal.slice(0, bal.length - 6) + "." + bal.slice(bal.length - 6);
      }
    }
  }

  copyToClipboard(text) {
    Clipboard.setString(text);
    this.toast.show("Copied to clipboard.", { duration: 2000 });
  }

  longPressPaste = async function() {
    let userInput = await Clipboard.getStringAsync();
    this.setState({ recipient: userInput });
  }

  render() {
    return (
      <View style={Styles.container}>
        <ScreenHeader
          title="WALLET"
          nav={this.props.navigation}
          enabled={!this.state.loading}
        />
        <Alert
          visible={this.state.alertVisible}
          message={this.state.alertMessage}
          onClose={() => {
            this.setState({ alertVisible: false });
          }}
        />
        <PasswordPrompt
          visible={this.state.passwdOverlayVisible}
          checkPassword={async (passwd) => {
            return await this.wallet.decryptSecret(passwd);
          }}
          onPasswordAccept={async (checkPasswdReturn) => {
            this.setState({ passwdOverlayVisible: false });

            await this.performTransaction(
              this.parseSendAmount(),
              this.state.recipient,
              checkPasswdReturn
            );
          }}
          onPasswordReject={(checkPasswdReturn) => {}}
          onCancel={() => this.setState({ passwdOverlayVisible: false })}
        />
        <WalletIcon onPress={async () => await this.updateWallet()} />
        <View style={{ flex: 1 }}>
          <Text h2={true} h2Style={Styles.headerText}>
            {this.balanceToString()}
          </Text>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#00C6E5"
            onPress={() => {
              this.copyToClipboard(this.wallet.address);
            }}
          >
            <Text style={[Styles.text, { textAlign: "center" }]}>
              {this.wallet.address}
            </Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: 3,
            alignContent: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <TouchableHighlight 
            style={Styles.highlight}
            onLongPress={() => {
              this.longPressPaste()
            }}
            delayLongPress={700}
          >
            <Input
              value={this.state.recipient}
              ref={this.recipientInRef}
              editable={!this.state.loading}
              label="Enter Recipient Address: "
              placeholder="Address"
              leftIcon={{ type: "font-awesome-5", name: "level-up-alt" }}
              onChangeText={(text) => {
                this.setState({ recipient: text })
                //Function to shake if maxLength is met
                //Should only be base32 characters, max length 52
              }}
              maxLength={52}
              style={Styles.textInput}
              containerStyle={[Styles.textInputContainer, {backgroundColor:"#1c41b7"}]}
              //TODO Check background colour for all views, should be inherited??
            />  
          </TouchableHighlight>
          <Input
            ref={this.amountInRef}
            editable={!this.state.loading}
            label="Enter Amount: "
            placeholder="Amount"
            value={this.state.sendAmount}
            leftIcon={{ type: "font-awesome-5", name: "coins" }}
            onChangeText={(text) => {
              this.processSendAmountText(text);
            }}
            style={Styles.textInput}
            containerStyle={Styles.textInputContainer}
            keyboardType="decimal-pad"
          />
          <Button
            title="SEND"
            loading={this.state.loading}
            icon={{ type: "font-awesome-5", name: "paper-plane" }}
            buttonStyle={[Styles.button, { alignSelf: "center" }]}
            onPress={() => {
              let amount = this.parseSendAmount;

              if (this.state.recipient.length !== 52) {
                this.recipientInRef.current.shake();
                this.setState({ recipient: "" });
              } else if (amount === null || amount > this.state.balance) {
                this.amountInRef.current.shake();
                this.setState({ sendAmount: "" });
              } else {
                this.setState({ passwdOverlayVisible: true });
              }
            }}
          />
        </View>
      </View>
    );
  }
}

class WalletIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={Styles.containerImage}>
        <TouchableHighlight
          style={Styles.highlight}
          onPress={async () => await this.props.onPress()}
        >
          <Image
            source={require("../assets/IconCoin.png")}
            style={Styles.image}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
