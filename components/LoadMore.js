import React from "react";

const LoadMore = ({}) => {
  const loadMoreProducts = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <button onClick={loadMoreProducts}>LoadMore</button>
    </>
  );
};

export default LoadMore;
