import { View, Text } from "react-native";

import { styles } from "./styles";

interface DividerProps {
  text: string;
  unidade?: string;
}

export function Divider({ text, unidade }: DividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text} {unidade}</Text>
      <View style={styles.line} />
    </View>
  );
}