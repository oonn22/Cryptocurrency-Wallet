import React, { Component } from "react";
import { View, TouchableHighlight } from "react-native";
import { Input, Button } from "react-native-elements";
import Styles from "../../../Styles/Styles.js";
import PasswordPrompt from "../../../Components/PasswordPrompt.js";
import * as Clipboard from "expo-clipboard";

export default class TransactionGUI extends Component {
  state = {
    recipient: "",
    sendAmount: "",
    passwdOverlayVisible: false,
    loading: this.props.loading,
  };

  constructor(props) {
    super(props);

    this.toast = global.Toast;

    this.amountInRef = React.createRef();
    this.recipientInRef = React.createRef();

    this.lastValidSendAmount = this.state.sendAmount;
  }

  async longPressPaste() {
    let userInput = await Clipboard.getStringAsync();
    this.setState({ recipient: userInput });
  }

  async invalidLength(key) {
    if (this.state.recipient.length === 52 && key.length === 1) {
      this.recipientInRef.current.shake();
    }
  }

  validateSendAmountText(text) {
    let valid = /^$|^\d{1,10}?(\.(\d{0,4}))?$/;

    if (valid.test(text)) {
      this.setState({ sendAmount: text });
      this.lastValidSendAmount = text;
    } else {
      this.amountInRef.current.shake();
      this.setState({ sendAmount: this.lastValidSendAmount });
    }
  }

  parseSendAmount(amount) {
    if (amount !== "") {
      if (amount.includes(".")) {
        let amounts = amount.split(".");
        return (
          Number.parseInt(amounts[0]) * 10000 +
          Number.parseInt(amounts[1] + "0".repeat(4 - amounts[1].length))
        );
      } else {
        return Number.parseInt(amount) * 10000;
      }
    } else return null;
  }

  async performTransaction(amount, recipient, secret) {
    this.setState({ loading: true });

    let transactionResult = await this.props.wallet.sendTransaction(
      amount,
      recipient,
      undefined,
      secret
    );

    if (transactionResult) {
      this.toast.show("Transaction Successful!", { duration: 2000 });
    } else {
      this.toast.show("Error Sending Transaction!", { duration: 2000 });
    }

    this.setState({ loading: false });

    setTimeout(async () => {
      await this.props.afterSend();
    }, 500);
  }

  render() {
    return (
      <View>
        <PasswordPrompt
          visible={this.state.passwdOverlayVisible}
          checkPassword={async (passwd) => {
            return await this.props.wallet.decryptSecret(passwd);
          }}
          onPasswordAccept={async (checkPasswdReturn) => {
            this.setState({ passwdOverlayVisible: false });
            this.setState({ loading: true });

            //Transaction is performed here after password is verified.
            await this.performTransaction(
              this.parseSendAmount(this.state.sendAmount),
              this.state.recipient,
              checkPasswdReturn
            );

            this.setState({ loading: false });
          }}
          onPasswordReject={(checkPasswdReturn) => {}}
          onCancel={() => this.setState({ passwdOverlayVisible: false })}
        />
        <TouchableHighlight
          activeOpacity={0.1}
          underlayColor="#00C6E5"
          onLongPress={async () => {
            await this.longPressPaste();
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
              this.setState({ recipient: text });
            }}
            onKeyPress={(e) => {
              this.invalidLength(e.nativeEvent.key);
            }}
            maxLength={52}
            style={Styles.textInput}
            containerStyle={[
              Styles.textInputContainer,
              { backgroundColor: "#1c41b7" },
            ]}
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
            this.validateSendAmountText(text);
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
            let amount = this.parseSendAmount(this.state.sendAmount);

            if (this.state.recipient.length !== 52) {
              this.recipientInRef.current.shake();
              this.setState({ recipient: "" });
            } else if (amount === null || amount > this.props.balance) {
              this.amountInRef.current.shake();
              this.setState({ sendAmount: "" });
            } else {
              this.setState({ passwdOverlayVisible: true }); //Password overlay will perform the transaction after validating password
            }
          }}
        />
      </View>
    );
  }
}
