import { View, Text } from "react-native";

import { styles } from "./styles";

interface DividerProps {
  text: string;
  unidade?: string;
  mVertical?: number;
}

export function Divider({ text, unidade, mVertical }: DividerProps) {
  const marginVertical = mVertical ? mVertical : 0  

  return (
    <View style={[styles.container, { marginVertical } ]}>
      <View style={styles.line} />
      <Text style={styles.text}>{text} {unidade}</Text>
      <View style={styles.line} />
    </View>
  );
}