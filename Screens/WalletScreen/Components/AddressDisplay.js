import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { Text } from "react-native-elements";
import Styles from "../../../Styles/Styles.js";
import * as Clipboard from "expo-clipboard";
import { View } from "react-native-web";

export default class AddressDisplay extends Component {
  constructor(props) {
    super(props);
    this.toast = global.Toast;
  }

  copyToClipboard(text) {
    Clipboard.setString(text);
    this.toast.show("Copied to clipboard.", { duration: 2000 });
  }

  render() {
    return (
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#00C6E5"
        onPress={() => {
          this.copyToClipboard(this.props.address);
        }}
      >
        <Text style={[Styles.text, { textAlign: "center" }]}>
          {this.props.address}
        </Text>
      </TouchableHighlight>
    );
  }
}
