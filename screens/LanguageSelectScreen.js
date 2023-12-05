import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { HeaderButtons, HeaderButton, Item } from "react-navigation-header-buttons";
import colors from "../utils/colors";
import supportedLanguages from "../utils/supportedLanguages";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LanguageItem from "../components/LanguageItem";

const CustomHeaderButton = props => {
  return <HeaderButton
            { ...props }
            IconComponent={Ionicons}
            iconSize={23}
            color={props.color || colors.primary}
          />
}

export default function LanguageSelectScreen({ navigation, route }) {
  const params = route.params || {};
  const { title, selected } = params;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item 
            iconName="close"
            color="black"
            onPress={() => navigation.goBack()}
          />
        </HeaderButtons>
      )
    })
  }, [navigation])

  const onLanguageSelect = useCallback(itemKey => {
    const dataKey = params.mode === 'to' ? 'languageTo' : 'languageFrom';
    navigation.navigate('Home', { [dataKey]: itemKey });
  }, [params, navigation]);

  return(
    <View style={styles.container}>
        <GestureHandlerRootView>
          <FlatList 
            data={Object.keys(supportedLanguages)}
            renderItem={(itemData) => {
              const languageKey = itemData.item;
              const languageString = supportedLanguages[languageKey];
              return <LanguageItem
                        onPress={() => onLanguageSelect(languageKey)}
                        text={languageString}
                        selected={languageKey === selected}
                      />
            }}
          />
        </GestureHandlerRootView>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})