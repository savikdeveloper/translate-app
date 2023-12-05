import { Alert, StyleSheet, Text, View } from "react-native";
import colors from "../utils/colors";
import SettingsItem from "../components/SettingsItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { clearHistory } from "../store/historySlice";
import { setSavedItems } from "../store/savedItemsSlice";

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const deleteHistory = useCallback(async () => {
    try {
      await AsyncStorage.setItem('history', JSON.stringify([]));
      dispatch(clearHistory());
      Alert.alert("Succes", "History cleared")
    } catch(error) {
      console.log(error);
    }
  }, [dispatch])
  const deleteSavedItems = useCallback(async () => {
    try {
      await AsyncStorage.setItem('savedItems', JSON.stringify([]));
      dispatch(setSavedItems({ items: [] }));
      Alert.alert("Succes", "Saved items cleared")
    } catch(error) {
      console.log(error);
    }
  }, [dispatch])

  return(
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SettingsItem
          title="Clear history"
          subTitle="Clears all items from your history"
          iconFamily={AntDesign}
          icon="delete"
          onPress={deleteHistory}
        />
        <SettingsItem
          title="Clear saved items"
          subTitle="Clears all saved items"
          iconFamily={AntDesign}
          icon="delete"
          onPress={deleteSavedItems}
        />
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground,
    padding: 10,
  }
})