import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c41b7",
    alignItems: "center",
    justifyContent: "center",
  },
  containerRow: {
    flexDirection: "row",
    backgroundColor: "#1c41b7",
    alignItems: "center",
    justifyContent: "center",
  },
  containerImage: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#1CA6B5",
    padding: 10,
    margin: 5,
  },
  buttonRow: {
    alignItems: "center",
    backgroundColor: "#1CA6B5",
    padding: 15,
    margin: 10,
  },
  textInput: {
    color: "white",
    fontSize: 14,
  },
  textInputContainer: {
    paddingHorizontal: 35,
  },
  text: {
    color: "white",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  image: {
    resizeMode: "contain",
    width: 100,
    height: undefined,
    aspectRatio: 1,
  },
  header: {
    backgroundColor: "#0080D6",
    justifyContent: "flex-start",
    width: "100%",
  },
  highlight: {
    activeOpacity: 0.6,
    color: "red",
    underlayColor: "#00C6E5",
  },
});

export default styles;
