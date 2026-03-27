import React, { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const languages = {
    en: 'EN',
    ja: 'JP'
  };

  const [currentLang, setCurrentLang] = useState('en');
  const [pathWithoutLang, setPathWithoutLang] = useState('');

  useEffect(() => {
    const pathname = window.location.pathname;
    setCurrentLang(pathname.startsWith('/ja') ? 'ja' : 'en');
    setPathWithoutLang(pathname.replace(/^\/[a-z]{2}/, ''));
  }, []);

  return (
    <div className="language-switcher">
      {Object.entries(languages).map(([lang, label]) => {
        const href = `/${lang}${pathWithoutLang}`;
        const isActive = currentLang === lang;
        return (
          <a
            key={lang}
            href={href}
            className={`lang-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
} 