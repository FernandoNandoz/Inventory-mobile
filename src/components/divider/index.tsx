import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type DividerProps = TouchableOpacityProps & {
  text: string;
  state?: boolean;
  unidade?: string;
  mVertical?: number;
  options?: boolean;
  optionClose?: boolean;
}

export function Divider({ text, state = true, unidade, mVertical, options, optionClose, ...rest }: DividerProps) {
  const marginVertical = mVertical ? mVertical : 0  
  const display = options ? "flex" : "none"
  const icon = state ? "expand-more" : "expand-less"

  return (
    <View style={[styles.container, { marginVertical } ]}>
      { options ? (
        <>
          <View style={styles.line} />
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} {...rest}>
            <Text style={styles.text}>{text} {unidade}</Text>
            <MaterialIcons 
              name={icon} 
              size={22} 
              color={colors.gray[400]} style={{ display , marginRight: 6, fontWeight: 'bold' }} 
              />
          </TouchableOpacity>
          <View style={styles.line} />        
        </>
      ) : options && optionClose ? (
        <>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} {...rest}>
            <Text style={styles.text}>{text} {unidade}</Text>
            <MaterialIcons 
              name={icon} 
              size={22} 
              color={colors.gray[400]} style={{ display , marginRight: 6, fontWeight: 'bold' }} 
              />
          </TouchableOpacity>

          <View style={styles.line} /> 
              
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} {...rest}>
            <MaterialIcons 
              name="close" 
              size={20} 
              color={colors.gray[400]} style={{ display , marginHorizontal: 6, fontWeight: 'bold' }} 
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.line} />
          <Text style={styles.text}>{text} {unidade}</Text>
          <View style={styles.line} />
        </>
      ) }

      
    </View>
  );
}