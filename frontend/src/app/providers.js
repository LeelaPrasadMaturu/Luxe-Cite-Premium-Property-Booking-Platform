'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
} 