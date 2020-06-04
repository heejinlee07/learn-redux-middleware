//프레젠테이셔널 컴포넌트
//포스트 하나를 조회하는 기능

import React from "react";

function Post({ post }) {
  const { title, body } = post;
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

export default Post;
