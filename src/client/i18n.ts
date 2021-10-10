import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LoadLang = async (lang) => {
  const request = await fetch(`/locales/${lang}.json`);
  const response = await request.json();
  if (response.error) return;
  window.localStorage.setItem(
    `oxibotV2_locales_${lang}`,
    JSON.stringify({ translation: response.translates })
  );
};

export var AvailableRessources: { lang: string; langname: string }[] = [];

export const setup = async (
  defaultlang: string,
  langs: { lang: string; langname: string }[]
) => {
  if (window.localStorage.getItem("oxibotV2_default_locales"))
    defaultlang = window.localStorage.getItem("oxibotV2_default_locales");

  AvailableRessources = langs;

  if (!window.localStorage.getItem(`oxibotV2_locales_${defaultlang}`)) {
    await LoadLang(defaultlang);
  }
  /**
   * ONLY FOR DEV
   */
  await LoadLang(defaultlang);

  const resources: any = {};

  for (const key in window.localStorage) {
    if (!key.startsWith(`oxibotV2_locales_`)) continue;
    const language = JSON.parse(window.localStorage.getItem(key));
    const name = key.split("_")[2];
    resources[name] = language;
  }

  i18n.use(initReactI18next).init({
    resources: resources,
    lng: defaultlang,
  });
  return;
};

export default i18n;
