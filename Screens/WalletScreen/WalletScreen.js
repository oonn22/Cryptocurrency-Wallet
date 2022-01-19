import React, { Component, useState } from "react";
import { View, TouchableHighlight } from "react-native";
import ScreenHeader from "../../Components/ScreenHeader.js";
import * as Clipboard from "expo-clipboard";
import Styles from "../../Styles/Styles.js";
import Alert from "../../Components/Alert.js";

import WalletIcon from "./Components/WalletIcon";
import BalanceDisplay from "./Components/BalanceDisplay.js";
import AddressDisplay from "./Components/AddressDisplay.js";
import TransactionGUI from "./Components/TransactionGUI.js";

export default class WalletScreen extends Component {
  state = {
    balance: 0,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.wallet = global.Wallet;
  }

  componentDidMount() {
    this.updateWallet().then(() => console.log("Wallet updated"));
  }

  async updateWallet() {
    this.setState({ loading: true });
    this.setState({ balance: await this.wallet.getBalance() });
    this.setState({ loading: false });
  }

  render() {
    return (
      <View style={Styles.container}>
        <ScreenHeader
          title="WALLET"
          nav={this.props.navigation}
          enabled={!this.state.loading}
        />
        <WalletIcon onPress={async () => await this.updateWallet()} />
        <View style={{ flex: 1 }}>
          <BalanceDisplay balance={this.state.balance} />
          <AddressDisplay address={this.wallet.address} />
        </View>
        <View
          style={{
            flex: 3,
            alignContent: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <TransactionGUI
            wallet={this.wallet}
            loading={this.state.loading}
            balance={this.state.balance}
          />
        </View>
      </View>
    );
  }
}
