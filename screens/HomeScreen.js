import 'react-native-gesture-handler';
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import supportedLanguages from '../utils/supportedLanguages';
import { translate } from '../utils/translate';
import colors from "../utils/colors";
import * as Clipboard from 'expo-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { addHistoryItem, setHistoryItems } from '../store/historySlice';
import TranslationResult from '../components/TranslationResult';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSavedItems } from '../store/savedItemsSlice';

const loadData = () => {
  return async dispatch => {
    try {
      const historyString = await AsyncStorage.getItem('history');
      if(historyString !== null) {
        const history = JSON.parse(historyString);
        dispatch(setHistoryItems({ items: history }));
      }

      const savedItemsString = await AsyncStorage.getItem('savedItems');
      if(savedItemsString !== null) {
        const savedItems = JSON.parse(savedItemsString);
        dispatch(setSavedItems({ items: savedItems }));
      }
    } catch(error) {
      console.log(error);
    }
  }
}

export default function HomeScreen(props) {
  const params = props.route.params || {};
  const [enteredText, setEnteredText] = useState("");
  const [resultText, setResultText] = useState("");
  const [languageTo, setLanguageTo] = useState("uz");
  const [languageFrom, setLanguageFrom] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useSelector(state => state.history.items);

  useEffect(() => {
    if(params.languageTo){
      setLanguageTo(params.languageTo);
    }

    if(params.languageFrom){
      setLanguageFrom(params.languageFrom);
    }
  }, [params.languageTo, params.languageFrom]);

  useEffect(() => {
    dispatch(loadData());
  }, [dispatch])

  useEffect(() => {
    const saveHistory = async () => {
      try {
        await  AsyncStorage.setItem('history', JSON.stringify(history))
      } catch(error) {
        console.log(error);
      }
    }

    saveHistory();
  }, [history])

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await translate(enteredText, languageFrom, languageTo);

      if(!result) {
        setResultText("");
        return;
      }

      const textResult = result.translated_text[result.to];
      setResultText(textResult);

      const id = uuid.v4();
      result.id = id;
      result.dateTime = new Date().toISOString();

      dispatch(addHistoryItem({ item: result }));    
    }  catch(error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }

  }, [enteredText, languageTo, languageFrom, dispatch]);

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(resultText);
  }, [resultText])

  return(
    <View style={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => props.navigation.navigate("languageSelect", {title: "Translate from", selected: languageFrom, mode: 'from'})}
          >
            <Text style={styles.languageOptionText}>{supportedLanguages[languageFrom]}</Text>
          </TouchableOpacity>

          <View style={styles.arrowContainer}>
            <MaterialIcons name="compare-arrows" size={24} color="black" />
          </View>

          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => props.navigation.navigate("languageSelect", {title: "Translate to", selected: languageTo, mode: 'to'})}
          >
            <Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>

      <GestureHandlerRootView>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            placeholder='Enter text'
            style={styles.textInput}
            onChangeText={(text) => {setEnteredText(text)}}
          />

          <TouchableOpacity
            onPress={isLoading ? undefined : onSubmit}
            disabled={enteredText === ""}
            style={styles.iconContainer}
          >
            {
              isLoading ?
              <ActivityIndicator size={'small'} color={colors.primary} /> :
              <Ionicons
                name="arrow-forward-circle" 
                size={24} 
                color={enteredText !== "" ? "#1768E6" : "#1a73e8"} 
              />
            }
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>

      <GestureHandlerRootView>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultText}</Text>

          <TouchableOpacity
            onPress={copyToClipboard}
            disabled={resultText === ""}
            style={styles.iconContainer}
          >
            <MaterialIcons
              name="content-copy" 
              size={24} 
              color={resultText !== "" ? "#1768E6" : "#1a73e8"} 
            />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>

      <GestureHandlerRootView>
        <View style={styles.historyContainer}>
          <FlatList 
            data={history.slice().reverse()}
            renderItem={itemData => {
              console.log(itemData.item);
              return <TranslationResult itemId={itemData.item.id}/>
            }}
          />
        </View>
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
  },
  languageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: "space-around",
    backgroundColor: "#FAFAFA",
  },
  languageOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center",

  },
  languageOptionText: {
    color: "#1a73e8",
    fontFamily: 'regular',
    letterSpacing: 0.3
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: "#dedede",
    borderBottomWidth: 0.5,
    height: 100,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: "#202124"
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  resultContainer: {
    flexDirection: 'row',
    borderBottomColor: "#dedede",
    borderBottomWidth: 0.5,
    height: 90,
    alignItems: 'center',
    paddingVertical: 15,
  },
  resultText: {
    flex: 1,
    marginHorizontal: 20,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: "#202124"
  },
  historyContainer: {
    flexDirection: 'row',
    backgroundColor: "#f2f2f7",
    padding: 10,
    height: 430,
  },
  historyText: {
    flex: 1,
  }
})