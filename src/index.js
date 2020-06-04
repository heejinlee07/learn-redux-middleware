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
import ReduxThunk from "redux-thunk";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

// 여러개의 미들웨어 적용가능.
//const store = createStore(rootReducer, applyMiddleware(myLogger, logger));
//logger를 쓸 때는 logger가 가장 마지막에 위치해야함.
const store = createStore(
  rootReducer,
  //그냥 customHistory를 넣어줘도 되지만 나중에 withExtraArgument를
  //여러개 넣어주고 싶을 수도 있으니 객체형태로 넣어줌.
  composeWithDevTools(applyMiddleware(ReduxThunk.withExtraArgument({ history: customHistory }), logger))
);

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/**
 * redux-thunk
 * 액션 객체가 아닌 함수를 디스패치할 수 있음.
 * 비동기 작업 처리 할 때 가장 많이 사용.
 */

/**
 * thunk에서 리액트 라우터 history적용하기
 * thunk 내부에서 특정 주소로 이동하는 로직에 사용
 * ex) 로그인 요청 성공시 특정 경로로 이동하고,
 * 실패시 경로를 유지하는 로직
 */

/*
 NOTE: Injecting a Custom Argument
 Redux Thunk supports injecting a custom argument 
 using the 'withExtraArgument' function:

 const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(api)),
);

thunk 함수의 세번째 파라미터로 추가적인 값을 불러오게함.
// later
function fetchUser(id) {
  return (dispatch, getState, api) => {
    // you can use api here
  };
}

 */
