import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./modules";
// import myLogger from "./middlewares/myLogger";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// 여러개의 미들웨어 적용가능.
//const store = createStore(rootReducer, applyMiddleware(myLogger, logger));
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
