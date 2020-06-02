// TODO: api를 진행중인 상태,
//성공했을 때 데이터의 상태,
//실패했을 때의 상태를 관리할 것.

//api/posts안의 모든 함수 불러오기
import * as postsAPI from "../api/posts";

// 각 api마다 요청 하나당 action을 세개씩 만든다고 생각할 것.
// 포스트 여러개 조회
const GET_POSTS = "GET_POSTS"; //특정 요청이 시작함.
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS"; //요청 성공
const GET_POSTS_ERROR = "GET_POSTS_ERROR"; //요청 실패

//포스트 하나 조회하기
const GET_POST = "GET_POST"; //특정 요청이 시작함.
const GET_POST_SUCCESS = "GET_POST_SUCCESS"; //요청 성공
const GET_POST_ERROR = "GET_POST_ERROR"; //요청 실패

// thunk 생성 함수
// thunk 를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없습니다.
// 그냥 thunk 함수에서 바로 액션 객체를 만들어주어도 괜찮습니다.
export const getPosts = () => async (dispatch) => {
  //요청이 시작됨.
  dispatch({ type: GET_POSTS });
  //API를 호출
  try {
    const posts = await postsAPI.getPosts();
    //성공했을 때
    dispatch({ type: GET_POSTS_SUCCESS, posts });
  } catch (e) {
    //실패했을 때
    dispatch({ typd: GET_POSTS_ERROR, error: e });
  }
};

export const getPost = (id) => async (dispatch) => {
  //요청이 시작됨.
  dispatch({ type: GET_POST });
  //API를 호출
  try {
    const post = await postsAPI.getPost(id);
    //성공했을 때
    dispatch({ type: GET_POST_SUCCESS, post });
  } catch (e) {
    //실패했을 때
    dispatch({ typd: GET_POST_ERROR, error: e });
  }
};
