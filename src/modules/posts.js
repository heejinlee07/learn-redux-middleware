// TODO: api를 진행중인 상태,
//성공했을 때 데이터의 상태,
//실패했을 때의 상태를 관리할 것.

//api/posts안의 모든 함수 불러오기
import * as postsAPI from "../api/posts";
import {
  reducerUtils,
  createPromiseThunk,
  handleAsyncActions,
  createPromiseThunkById,
  handleAsyncActionsById,
} from "../lib/asyncUtils";

//TODO: action 정의
// 각 api마다 요청 하나당 action을 세개씩 만든다고 생각할 것.
// 포스트 여러개 조회
const GET_POSTS = "GET_POSTS"; //특정 요청이 시작함.
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; //요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; //요청 실패

//포스트 하나 조회하기
const GET_POST = "GET_POST"; //특정 요청이 시작함.
const GET_POST_SUCCESS = "GET_POST_SUCCESS"; //요청 성공
const GET_POST_ERROR = "GET_POST_ERROR"; //요청 실패

/*DEBUG:
포스트를 클릭했을 때 이전에 클릭했던 포스트가 잠깐 나타나는 현상
개선을 위해서 컴포넌트가 언마운트될 때 포스트 내용을 비우도록 처리함.
어떤 파라미터가 주어졌느냐에 따라 포스트를 조회하기 때문에,
새로운 액션과 리듀서를 작성해준다.
*/

//포스트 비우기 액션
const CLEAR_POST = "CLEAR_POST";
// TODO: thunk 생성 함수(액션 생성 함수)
// thunk 를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없습니다.
// 그냥 thunk 함수에서 바로 액션 객체를 만들어주어도 괜찮습니다.
// dispatch와 getState를 파라미터로 받아와서
// 액션을 dispatch하거나 getState로 현재 상태를 조회할 수 있다.

//REMIND: API에 저장된 POSTS는 3개의 객체를 담은 배열로 구성됨.
// 전체 posts 목록을 가져오는 것(여러개)와 각 객체, 즉 posts안에 있는
// 하나의 포스트를 가져오는 것이 필요하다.
// 두 가지 상황에 대한 액션을 thunk를 사용하여 정의한다.
// 비동기 처리를 쉽게 하기 위함. thunk에서는 async await를 사용할 수 있다.

/**
 * NOTE:
 * 1. 포스트 여러개를 가져오는 getPosts에 대한 액션로직
 * dispatch를 파라미터로 받아와서 전체 포스트 여러개를 가져오는
 * api요청을 시작한다.
 * 2. api요청 중인 상태, 성공케이스, 실패케이스에 대해 try/catchㅀ 정리.
 * api 요청 상태: posts로 선언된 구문에 따르면, api 폴더의 posts파일에서
 * getpost함수를 가져온다. 이 함수는 0.5초 쉰 후 posts를 반환한다.
 * 성공했을 때: GET_POSTS_SUCCESS 액션과 posts를 디스패치한다.
 * 실패했을 때: GET_POSTS_ERROR 액션과 캐치한 에러를 디스패치한다.
 *
 * -> 포스트 한개를 가져오는 getPost의 액션로직도 동일하다.
 */
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);

//FIXME: 포스트 조회 후 다시 조회할 때 또 로딩되는 문제 해결
//initialState의 post는 초기상태가 빈 객체이다.
// export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);
export const getPost = createPromiseThunkById(GET_POST, postsAPI.getPostById);

// createPromiseThunkById로 리팩토링하기 이전 코드
// (id) => async (dispatch) => {
//   //API 요청시작
//   dispatch({ type: GET_POST, meta: id });
//   // reducer에서 meta의 id를 참고해서 상태를 업데이트 할 것.
//   try {
//     //API에서 POST 데이터 가져오고,
//     //성공시 GET_POSTS_SUCCESS를 디스패치하고 가져온 payload와 meta전달
//     const payload = await postsAPI.getPostById(id);
//     dispatch({ type: GET_POST_SUCCESS, payload, meta: id });
//   } catch (e) {
//     //post 데이터 가져오기 실패시 디스패치할 것.
//     dispatch({
//       type: GET_POST_ERROR,
//       payload: e,
//       error: true,
//       meta: id,
//     });
//   }
// };

//홈 화면으로 가는 thunk
//(extra.history->)extra 내부에 history가 있어서 비구조화할당해줌.

export const goToHome = () => (dispatch, getState, { history }) => {
  history.push("/");
};
export const clearPost = () => ({ type: CLEAR_POST });

//리듀서 작성을 위해 초기상태를 설정하였다.
const initialState = {
  posts: reducerUtils.initial(),
  // post: reducerUtils.initial(),
  post: {},
};

const getPostsReducer = handleAsyncActions(GET_POSTS, "posts", true);
const getPostReducer = handleAsyncActionsById(GET_POST, "post", true);
// const getPostReducer = handleAsyncActions(GET_POST, "post");
//  handleAsyncActionsById로 리팩토링하기 이전 코드
// const getPostReducer = (state, action) => {
//   const id = action.meta;
//   switch (action.type) {
//     case GET_POST:
//       return {
//         // 기존의 상태를 넣어준 다음, 특정 id를 key로 사용해서
//         // 로딩중 상태로 만들어준다.
//         ...state,
//         post: {
//           ...state.post,
//           // 그런데 만약 이미 기존에 불러온 상태가 있다면,
//           //재사용을 위해 로딩의 파라미터에 기존 상태를 넣어준다.
//           //로딩중에도 데이터를 유지하도록 처리.
//           [id]: reducerUtils.loading(state.post[id] && state.post[id].data),
//           /* REMIND: post는 초기값이 {} 빈 객체이다.
//           따라서 맨 처음에 불러오면 undefined일 것.
//           undefined.data를 하면 오류가 날 것이므로 &&로 처리해줌.
//           이렇게 하면 loading의 파라미터 전체가 undefined로 떨어진다.
//           (true && true 일때만 true 나머지 상황에선 모두 false)
//           * 로딩중-> undefined
//           * state.post[id]라는 객체가 존재하면 그 객체에서
//           * 데이터를 읽어와서 로딩중의 데이터 상태로 쓰는 것.
//           * 즉 로딩 중에도 데이터를 초기화하지 않는 것.
//         */
//         },
//       };
//     case GET_POST_SUCCESS:
//       return {
//         ...state,
//         post: {
//           ...state.post,
//           [id]: reducerUtils.success(action.payload),
//         },
//       };
//     case GET_POST_ERROR:
//       return {
//         ...state,
//         post: {
//           ...state.post,
//           [id]: reducerUtils.error(action.payload),
//         },
//       };
//     default:
//       return state;
//   }
// };

//리듀서
// state의 초기값을 설정하지 않으면 undefined가 나온다.
// 액션 객체를 전달받아 업데이트하는 역할을 한다.
// asyncUtils에 만들어둔 handleAsyncActions를 불러와서 return하는데,
// type과 key를 인수로 넣어서 전달한다.
//handleAsyncActions는 인수를 받아서 각각의 case에 맞게 액션을 처리한다.
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return getPostsReducer(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return getPostReducer(state, action);
    case CLEAR_POST:
      return {
        ...state,
        post: reducerUtils.initial(),
      };
    // 기존 state를 가져오고, post는 초기값으로 설정하여 포스트를 비운다.
    default:
      return state;
  }
}

// 리팩토링 이전
// export default function posts(state = initialState, action) {
//   switch (action.type) {
//     case GET_POSTS:
//       return {
//         ...state,
//         posts: reducerUtils.loading(),
//         //만약 기존의 상태에 들어있던 값을 null로 바꾸지 않고
//         //유지하고 싶다면, state.posts.data를 인수로 넣어준다.
//       };
//     case GET_POSTS_SUCCESS:
//       return {
//         ...state,
//         posts: reducerUtils.success(action.payload),
//       };
//     case GET_POSTS_ERROR:
//       return {
//         ...state,
//         posts: reducerUtils.error(action.payload),
//       };
//     case GET_POST:
//       return {
//         ...state,
//         post: reducerUtils.loading(),
//       };
//     case GET_POST_SUCCESS:
//       return {
//         ...state,
//         post: reducerUtils.success(action.payload),
//       };
//     case GET_POST_ERROR:
//       return {
//         ...state,
//         post: reducerUtils.error(action.payload),
//       };
//     default:
//       return state;
//   }
// }

// redux thunk는 액션을 보낼 때 순수 자바스크립트 객체가 아닌 함수도 보낼 수 있게 해준다.
