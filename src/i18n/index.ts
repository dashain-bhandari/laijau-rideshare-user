import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationEn from "./locales/en-NP/translation.json";
import translationNp from "./locales/ne-NP/translation.json";
import * as SecureStore from 'expo-secure-store';

const resources = {
  "ne-NP": { translation: translationNp },
  "en-NP": { translation: translationEn },
 
};

const initI18n = async () => {
   let savedLanguage = await SecureStore.getItemAsync("language");

  if (!savedLanguage) {
    
    savedLanguage = Localization.getLocales()[0]?.languageTag;
    console.log("local",savedLanguage)
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage,
    fallbackLng: "en-NP",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;