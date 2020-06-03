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

export const reducerUtils = {
  // posts 모듈에 있던 initialData
  // 초기상채
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
