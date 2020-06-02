import React from "react";
import Counter from "../components/Counter";
import { useSelector, useDispatch } from "react-redux";
import { increaseAsync, decreaseAsync } from "../modules/counter";

function CounterContainer() {
  // useSelector: 리덕스 스토어의 상태 조회
  const number = useSelector((state) => state.counter);
  // useDispatch: 리덕스 스토어의 dispatch를 함수에서 사용할 수 있게 함.
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increaseAsync());
  };
  const onDecrease = () => {
    dispatch(decreaseAsync());
  };

  return <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />;
}

export default CounterContainer;
