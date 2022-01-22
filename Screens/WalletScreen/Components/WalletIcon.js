import React, { Component, useState } from "react";
import { View, TouchableHighlight } from "react-native";
import { Image } from "react-native-elements";
import Styles from "../../../Styles/Styles.js";

export default class WalletIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={Styles.containerImage}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#00C6E5"
          onPress={async () => await this.props.onPress()}
        >
          <Image
            source={require("../../../assets/IconCoin.png")}
            style={Styles.image}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
