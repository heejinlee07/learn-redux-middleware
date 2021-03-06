import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostList from "../components/PostList";
import { getPosts } from "../modules/posts";

function PostListContainer() {
  //useSelector로 data, loading, error조회
  const { data, loading, error } = useSelector((state) => state.posts.posts);
  /**
   * ReducerUtils안에 있는 posts의 initalState의 posts값
   * 즉, data, loading, error 값이 있는 객체를 조회
   */

  //api요청을 위해 dispatch 가져옴.
  const dispatch = useDispatch();

  //컴포넌트 마운트 후 포스트 목록 요청
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  /*NOTE:
  포스트 목록 재로딩 문제 해결을 위한 방법
  data가 존재한다면 아무것도 하지 않는다.
  useEffect(() => {
    if (data) return;
    dispatch(getPosts());
  }, [data, dispatch]);

  WHY: 이렇게 하면 로딩중 문구가 뜨지않고,
  새로 데이터를 불러오지도 않는다.
  if문을 작성해서 loading중이면서
  data가 없을때만 로딩중이라는 문구가 뜨도록 한다.
 */

  if (loading && !data) return <div>로딩중...</div>;
  if (error) return <div>에러발생!</div>;
  if (!data) return null;

  //if문을 모두 통과했다면 데이터가 유효하다는 뜻.
  return <PostList posts={data} />;
}

export default PostListContainer;
