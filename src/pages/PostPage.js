import React from "react";
import PostContainer from "../containers/PostContainer";

//파라미터를 받아오는 컴포넌트
//url 파라미터의 id 값을 가져와서 postContainer의 props로 넣어줄 것.
function PostPage({ match }) {
  //컴포넌트의 props에서 match라는 값을 받아온다.
  //이 match는 리액트 라우터에서 post 페이지를
  // 라우터로 설정하게 되었을 때 받아오는 props

  /**
   * match 객체는 현재의 주소가 route 컴포넌트에서 정한 규칙과
   * 어떻게 일치하는지에 대한 정보가 들어있다.
   * params - (object) Key/value pairs parsed
   * from the URL corresponding to the dynamic segments of the path
   */

  //match params 안에 있는 id값을 조회
  const { id } = match.params;

  //REMIND: url 파라미터의 값은 문자열이므로 숫자로 변환해야함.
  const postId = parseInt(id, 10);

  return <PostContainer postId={postId} />;
}

export default PostPage;
