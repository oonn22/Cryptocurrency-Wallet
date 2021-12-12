import React, { Component } from "react";
import { View } from "react-native";
import { Button, Image } from "react-native-elements";
import Styles from "../Styles/Styles.js";

export default class StartScreen extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.containerImage}>
          <Image
            source={require("../assets/IconCoin.png")}
            style={Styles.image}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Button
            title="Create New Wallet"
            icon={{ type: "font-awesome", name: "plus-circle" }}
            buttonStyle={Styles.button}
            onPress={() => this.props.navigation.navigate("CreateWallet")}
          />
          <Button
            title="Import From Secret"
            icon={{ type: "font-awesome-5", name: "file-import" }}
            buttonStyle={Styles.button}
            onPress={() => this.props.navigation.navigate("Import")}
          />
        </View>
      </View>
    );
  }
}
