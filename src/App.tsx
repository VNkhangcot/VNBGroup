import React from 'react';
import Index from './Index';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Index />
    </LanguageProvider>
  );
};

export default App;
