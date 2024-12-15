"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

import en from "@/public/locales/en/common.json"
import fr from "@/public/locales/fr/common.json"

const translations = {
    en,
    fr
};

const TranslationContext = createContext({
    locale: 'en',
    dictionary: translations.en,
    setLocale: () => { },
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider = ({ locale: initialLocale, children }) => {
    const [locale, setLocale] = useState(initialLocale.includes('fr') ? 'fr' : 'en');
    const [dictionary, setDictionary] = useState(translations[locale]);

    useEffect(() => {
        setDictionary(translations[locale]);
    }, [locale]);

    return (
        <TranslationContext.Provider value={{ locale, dictionary, setLocale }}>
            {children}
        </TranslationContext.Provider>
    );
};
