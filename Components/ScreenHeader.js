import React, { Component } from "react";
import { Header } from "react-native-elements";
import Styles from "../Styles/Styles.js";

export default class ScreenHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          iconStyle: { color: "#fff" },
          onPress: () => {
            if (this.props.enabled) this.props.nav.openDrawer();
          },
        }}
        centerComponent={{ text: this.props.title, style: { color: "#fff" } }}
        rightComponent={{
          icon: "home",
          color: "#fff",
          onPress: () => {
            if (this.props.enabled) this.props.nav.navigate("Start");
          },
        }}
        containerStyle={Styles.header}
      />
    );
  }
}
