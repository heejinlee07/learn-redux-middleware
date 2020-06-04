import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPost, goToHome } from "../modules/posts";
import Post from "../components/Post";
import { reducerUtils } from "../lib/asyncUtils";

function PostContainer({ postId }) {
  //postId는 라우터 url 파라미터를 통해 받아오는 것.
  /* state.posts.post[postId] <- 포스트안에 있는 특정 id를 통해
  상태를 조회해야하는데, 가장 처음 초기값은 undefined이다. 따라서
  오류 방지를 위해서 ||연산자로 redeceUtils.initial을 넣어줬는데,
  단순 오류 방지를 원하면 그냥 {} 초기값인 빈 객체를 넣어도 된다.
  (false || true -> true)
  */
  const { data, loading, error } = useSelector((state) => state.posts.post[postId] || reducerUtils.initial());
  //useSelector를 통해 post 데이터에 대한 상태조회
  //module의 initialState에서 post:reducerUtils.initial() 안에
  //data, loading, error 값을 넣어서 관리를 할 것이고 이 값을 조회하는 것.
  //WHY:state.posts.post

  //useSelector는 스토어의 상태를 조회하는 hook
  //state의 값은 store.getState()함수를 호출했을 때 값과 동일
  const dispatch = useDispatch();

  //컴포넌트가 마운트될때 getPost thunk함수를 사용
  //포스트 조회시 이전에 확인했던 포스트가 잠깐 나타나는 현상 개선
  //useEffect의 cleanup함수를 사용하여 posts의 CLEAR_POST액션을 디스패치한다.
  //언마운트시에 CLEAR_POST를 디스패치하여 포스트 비우기
  useEffect(() => {
    //이미 데이터가 있으면 로딩중 안보이게 처리 요청도 안함. 아무것도 안함.
    if (data) return;
    dispatch(getPost(postId));
    // return () => {
    //   dispatch(clearPost());
    // };
  }, [postId, dispatch, data]);

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러발생!</div>;
  if (!data) return null;

  return (
    <>
      <button onClick={() => dispatch(goToHome())}>홈으로 이동</button>
      <Post post={data} />;
    </>
  );
}

export default PostContainer;
