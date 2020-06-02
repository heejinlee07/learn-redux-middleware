// 액션 타입
// 원래 Ducks 패턴을 따르는 리덕스 모듈에서는 액션 이름에
// 'counter/INCREASE' 이런식으로 앞부분에 접두어를 두지만
// 여기서는 액션 이름이 중복되지 않으니 편의상 생략한다.
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

// 액션 생성 함수
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

//thunk함수
export const increaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(increase()), 1000);
};
export const decreaseAsync = () => (dispatch) => {
  setTimeout(() => dispatch(decrease()), 1000);
};

// 초깃값 (상태가 객체가 아니라 그냥 숫자여도 상관 없다.
const initialState = 0;

// 리듀서
export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
}

//thunk함수: 액션의 디스패치가 1초씩 딜레이.
