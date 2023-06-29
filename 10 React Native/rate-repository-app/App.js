import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, Pressable } from "react-native";

const HelloWorld = (props) => {
  return <Text>Hello world!</Text>;
};

const PressableText = (props) => {
  return (
    <Pressable onPress={() => Alert.alert("You pressed the text!")}>
      <Text>You can press me</Text>
    </Pressable>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <HelloWorld />
      <PressableText />
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
