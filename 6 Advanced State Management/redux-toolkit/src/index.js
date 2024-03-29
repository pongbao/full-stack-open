import App from "./App";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import store from "./store";

ReactDOM.createRoot(document.getElementById("root"))
  // const renderApp = () => {
  //   root
  .render(
    <Provider store={store}>
      <App />
    </Provider>
  );
// };

// renderApp();
// store.subscribe(renderApp);
