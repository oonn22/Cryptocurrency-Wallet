import { StatusBar } from "expo-status-bar";
import React from "react";
import Crypto from "./Crypto/Crypto.js";
import { StyleSheet, Text, View } from "react-native";

let msgBytes = Crypto.randomBytes(64);
let hash = Crypto.hash(msgBytes);
let secret = Crypto.newSecret();
let pub = Crypto.getPublic(secret);
let sig = Crypto.signMessage(hash, secret);
let valid = Crypto.verifySignature(hash, sig, pub);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Secret: {Crypto.encode(secret)}</Text>
      <Text>Public Address: {pub}</Text>
      <Text>Message: {Crypto.encode(msgBytes)}</Text>
      <Text>Hash: {Crypto.encode(hash)}</Text>
      <Text>Signature: {Crypto.encode(sig)}</Text>
      <Text>Valid: {valid.toString()}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
