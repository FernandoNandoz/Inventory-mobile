import { TextInput, TextInputProps } from "react-native";

import { styles } from "./styles";
import { colors } from "@/styles/colors";

type Props = TextInputProps & {
    isEnabled?: boolean;
}

export function Input({ isEnabled = true, ...rest }: Props) {
    const enableBgColor = isEnabled === true ? colors.gray[900] : colors.gray[950];
    const enableBorderColor = isEnabled === true ? colors.gray[800] : colors.gray[900];
    const colorHolder = isEnabled === true ? colors.gray[600] : colors.gray[800];
    const readOnly = isEnabled === true ? false : true;

    return (
        <TextInput 
            style={[styles.container, { backgroundColor: enableBgColor,  borderColor: enableBorderColor }]} 
            placeholderTextColor={colorHolder}
            readOnly={readOnly}
            {...rest} 
        />
    );
}
