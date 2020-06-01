/*NOTE:
 redux middleware 템플릿
 const middleware = store => next => action => {
  // 하고 싶은 작업...
 }

 미들웨어는 결국 하나의 함수. 함수를 연달아서 두번 리턴하는 함수
 function middleware(store) {
   return function (next) {
     return function (action) {
       // 하고 싶은 작업...
     };
   };
 };
*/

const myLogger = (store) => (next) => (action) => {
  // 액션이 디스패치될 때 콘솔에 출력.
  console.log(action);
  console.log("\tPrev:", store.getState());
  //다음 미들웨어(없다면 리듀서에게)에게 액션을 전달.
  const result = next(action);
  //업데이트 이후의 상태 조회. '\t' 는 탭 문자.
  //액션이 리듀서까지 전달되고 난 후의 새로운 상태를 확인하고 싶을 때 사용
  console.log("\tNext:", store.getState());
  // 여기서 반환하는 값은 dispatch(action)의 결과물. 기본은 undefined.
  return result;
};

export default myLogger;
