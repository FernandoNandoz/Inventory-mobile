import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[600],
  },
  text: {
    marginHorizontal: 8,
    fontSize: 14,
    color: colors.gray[400],
  },
});