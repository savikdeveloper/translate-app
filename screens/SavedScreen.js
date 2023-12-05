import { StyleSheet, Text, View } from "react-native";
import colors from "../utils/colors";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import TranslationResult from "../components/TranslationResult";
import { useSelector } from "react-redux";

export default function SavedScreen() {
  const savedItems = useSelector(state => state.savedItems.items);
  if(savedItems.length === 0) {
    return <View style={styles.noItemsContainer}>
      <Text style={styles.noItemsText}>There aren't saved words</Text>
    </View>
  }

  return(
    <View style={styles.container}>
      <GestureHandlerRootView>
        <FlatList
          data={savedItems.slice().reverse()}
          renderItem={itemData => {
            return <TranslationResult itemId = {itemData.item.id} />
          }}
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
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noItemsText: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
  }
})