
import { DefaultTheme, configureFonts } from "react-native-paper";


const fontConfig = {
  regular: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400" as "400",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    color: "#FFF"
  },
  medium: {
    fontFamily: "Inter-Medium",
    fontWeight: "500" as "500",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    color: "#FFF"
  },
  light: {
    fontFamily: "Roboto-Light",
    fontWeight: "300" as "300",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    color: "#FFF"
  },
  thin: {
    fontFamily: "Roboto-Thin",
    fontWeight: "100" as "100",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    color: "#FFF"
  },
};

export const customTheme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: "#253334",   
    secondary: "#7C9A92",  
    background: "#ffffff",
    surface: "#ffffff",
    text: "#1A1A1A",       
    placeholder: "#4B5563",
    disabled: "rgba(0, 0, 0, 0.26)",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  fonts: configureFonts({ config: fontConfig }),
};
