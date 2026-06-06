import { useState } from "react";
import "./like-button.css";

export function LikeButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((p) => p + 1);
  }

  return (
    <button className="like" onClick={handleClick} type="button">
      {count}
    </button>
  );
}
