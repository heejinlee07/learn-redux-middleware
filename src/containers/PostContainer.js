import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPost } from "../modules/posts";
import Post from "../components/Post";

function PostContainer({ postId }) {
  //postId는 라우터 url 파라미터를 통해 받아오는 것.
  const { data, loading, error } = useSelector((state) => state.posts.post);
  //useSelector를 통해 post 데이터에 대한 상태조회
  //module의 initialState에서 post:reducerUtils.initial() 안에
  //data, loading, error 값을 넣어서 관리를 할 것이고 이 값을 조회하는 것.
  //WHY:state.posts.post

  //useSelector는 스토어의 상태를 조회하는 hook
  //state의 값은 store.getState()함수를 호출했을 때 값과 동일
  const dispatch = useDispatch();

  //컴포넌트가 마운트될때 getPost thunk함수를 사용
  useEffect(() => {
    dispatch(getPost(postId));
  }, [postId, dispatch]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러발생!</div>;
  if (!data) return null;

  return <Post post={data} />;
}

export default PostContainer;
