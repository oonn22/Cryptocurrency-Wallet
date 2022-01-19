import React, { Component } from "react";
import { Text } from "react-native-elements";
import Styles from "../../../Styles/Styles.js";

export default class BalanceDisplay extends Component {
  constructor(props) {
    super(props);
  }

  balanceToString() {
    let bal = this.props.balance.toString();

    if (bal === "0") return bal;
    else {
      if (bal.length <= 4) {
        return "0." + "0".repeat(4 - bal.length) + bal;
      } else {
        return bal.slice(0, bal.length - 4) + "." + bal.slice(bal.length - 4);
      }
    }
  }

  render() {
    return (
      <Text h2={true} h2Style={Styles.headerText}>
        {this.balanceToString()}
      </Text>
    );
  }
}
