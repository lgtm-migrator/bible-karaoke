import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { createGlobalStyle, DefaultTheme, GlobalStyleComponent } from 'styled-components';
import App from './App';
import Store from './App/store';
import { AnalyticsProvider } from './App/components/Analytics';

const store: Store = new Store();

const GlobalStyle: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`;

store.init().then((): void => {
  ReactDOM.render(
    <Provider {...store}>
      <AnalyticsProvider settings={store.settings}>
        <GlobalStyle />
        <App />
      </AnalyticsProvider>
    </Provider>,
    document.getElementById('root')
  );
});
