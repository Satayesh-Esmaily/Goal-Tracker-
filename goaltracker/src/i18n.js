import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      goals: "Goals",
      categories: "Categories",
      settings: "Settings",
    }
  },
  fa: {
    translation: {
      dashboard: "داشبورد",
      goals: "هدف‌ها",
      categories: "دسته‌بندی‌ها",
      settings: "تنظیمات",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;