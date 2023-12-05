import axios from "axios";
export const translate = async (text, languageFrom, languageTo) => {
  // const axios = require('axios');
  
  const options = {
    method: 'GET',
    url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
    params: {
      text: text,
      to: languageTo,
      from: languageFrom
    },
    headers: {
      'X-RapidAPI-Key': 'a5070201aamsh03d0d0a2e67892bp19d4a3jsn373e2d8ee6a0',
      'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
    }
  };
  const response = await axios.request(options).catch(function (error) {
    console.log(error);
  })

  if(response.status !== 200) {
    console.log(response);
    throw new Error("Translate call failed. Response status: " + response.status);
  }

  return response.data;

  // try {
  //   const response = await axios.request(options);
  //   console.log(response.data);
  // } catch (error) {
  //   console.error(error);
  // }
}