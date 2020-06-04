//리덕스 모듈 리팩토링
//posts의 리듀서에 반복되는 코드가 많아서 리팩토링

//posts에서 유사코드가 반복되는 promise기반의 thunk함수 리팩토링.
//type: 문자열 타입(ex. getpost,getposts)
//promiseCreator: 프로미스를 만들어주는 함수
export const createPromiseThunk = (type, promiseCreator) => {
  //성공 또는 실패시의 액션
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  //thunk 생성함수를 만들어서 반환.
  //promiseCreator가 여러개의 파라미터를 받을 수 있지만,
  //여기서는 하나만 받는다고 전제.
  //const thunkCreator =
  return (param) => async (dispatch) => {
    dispatch({ type });
    try {
      const payload = await promiseCreator(param);
      dispatch({
        type: SUCCESS,
        payload,
        //payload는 post또는 posts를 말함. 재사용성을 위해서 이렇게 씀
      });
    } catch (e) {
      dispatch({
        type: ERROR,
        payload: e,
        error: true,
        //FSA: flux standard action 참조
        //결과물의 이름을 payload로 통일하고, error:true로 설정.
      });
    }
  };

  //return thunkCreator;
};

// idSelector가 불필요할 때는 생략할 수 있도록 기본값을 만들어준다.
// param => param : 파라마티터 자체가 id라는 의미
// idSelector를 생략하게 되었을 때는 파라미터 자체가 id라는 의미.
const defaultIdSelector = (param) => param;
export const createPromiseThunkById = (type, promiseCreator, idSelector = defaultIdSelector) => {
  // 파라미터에서 id 를 어떻게 선택 할 지 정의하는 함수입니다.
  // 기본 값으로는 파라미터를 그대로 id로 사용합니다.
  // 하지만 만약 파라미터가 { id: 1, details: true } 이런 형태라면
  // 어떤 값이 id인지 정의를 해줘야한다.
  // idSelector 를 param => param.id 이런식으로 설정 할 수 있곘죠.

  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

  return (param) => async (dispatch) => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      dispatch({ type: SUCCESS, payload, meta: id });
    } catch (e) {
      dispatch({ type: ERROR, error: true, payload: e, meta: id });
    }
  };
};

/*
DEBUG:
이미 읽었던 포스트를 다시 클릭해서 불러올 때도 로딩&새로 요청하는 문제
TODO: post 모듈에서 관리하는 상태의 구조를 바꿔야함.

** 기존구조
{
  posts: {
    data,
    loading,
    error
  },
  post: {
    data,
    loading,
    error,
  }
}

post는 특정 id를 선택해서 조회하는 것인데,
만약 다른 id를 선택하면 기존 데이터를 덮어쓰기 때문에
데이터 재사용이 어렵다.

** 새로운 구조
post라는 객체 안에 각 id를 key로 사용해서
특정 key에 대한 data, loading, error 상태를 가지고 있게끔 한다.

  post: {
    '1': {
      data,
      loading,
      error
    },
    '2': {
      data,
      loading,
      error
    },
    [id]: {
      data,
      loading,
      error
    }
  }

  FIXME: module/todos의 thunk와 reducer를 다시 작성한다.
  -> 추후에 asyncUtils에서 리팩토링해준다.
*/

export const reducerUtils = {
  // posts 모듈에 있던 initialData
  // 초기상태 설정과 액션 타입 설정에 대한 함수
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
  }),
  //로딩상태
  //로딩에 대한 값만 바꾸고, 나머지 data나 error를 유지하고 싶다면
  //prevState를 파라미터로 넣어준다.
  //여기서는 기본값을 null로 설정했다.
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null,
  }),
  //성공상태. 데이터를 파라미터로 받아온다.
  success: (data) => ({
    loading: false,
    data,
    error: null,
  }),
  //실패상태. error를 파라미터로 받아온다.
  error: (error) => ({
    loading: false,
    data: null,
    error,
  }),
};

//비동기 관련 액션 처리 리듀서
//type은 액션의 타입을 뜻하고, key는 상태의 key(ex.post,posts)를 뜻함.
/*
NOTE:
포스트목록 재로딩 문제 해결을 위한 방법2
handleAsyncActions 함수의 세번째 파라미터에 keepData값을 넣어준다.
keepData의 값이 true로 주어질 때 로딩을 하면 '로딩중'이라는 문구는 아니지만
최신의 데이터를 받아온다.

*/
export const handleAsyncActions = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(keepData ? state[key].data : null),
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload),
        };
      default:
        return state;
    }
  };
};

export const handleAsyncActionsById = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return (state, action) => {
    const id = action.meta;
    switch (action.type) {
      case type:
        return {
          ...state,
          //key(post or posts)에 따라 바로 업데이트하는 것이 아니라,
          //key값에 있는 특정 id값을 가지고 업데이트해야함.
          // state[key][id]가 만들어져있지 않을 수도 있으니까 유효성을 먼저 검사 후 data 조회
          [key]: { ...state[key], [id]: reducerUtils.loading(keepData ? state[key][id] && state[key][id].data : null) },
        };
      case SUCCESS:
        return {
          ...state,
          [key]: { ...state[key], [id]: reducerUtils.success(action.payload) },
        };
      case ERROR:
        return {
          ...state,
          [key]: { ...state[key], [id]: reducerUtils.error(action.payload) },
        };
      default:
        return state;
    }
  };
};
