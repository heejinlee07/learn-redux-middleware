// TODO: api를 진행중인 상태,
//성공했을 때 데이터의 상태,
//실패했을 때의 상태를 관리할 것.

//api/posts안의 모든 함수 불러오기
import * as postsAPI from "../api/posts";
import { reducerUtils, createPromiseThunk, handleAsyncActions } from "../lib/asyncUtils";

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
export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

//리듀서 작성을 위해 초기상태를 설정하였다.
const initialState = {
  posts: reducerUtils.initial(),
  post: reducerUtils.initial(),
};

const getPostsReducer = handleAsyncActions(GET_POSTS, "posts");
const getPostReducer = handleAsyncActions(GET_POST, "post");

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
