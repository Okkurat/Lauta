import React from "react";
import "./App.css";

function PostHeader({ Thread, showButton, ButtonOnClick }) {
  const formatDate = (datesString) => {
    const datesArr = datesString.split("T");
    const dateArr = datesArr[0].split("-");
    const clockTime = datesArr[1].split(".");
    const clockTimeNew = clockTime[0].replace(":", ".");
    const time = `${dateArr[2]}.${dateArr[1]}.${dateArr[0]} klo ${clockTimeNew}`;
    return time;
  };

  return (
    <>
      <div className="postHeader">
        <a href={`http://localhost:3000/${Thread.ID}`}>
          {Thread && Thread.title && (
            <p className="threadTitle">{Thread.title}</p>
          )}
          <p>
            Anonymous <span>{formatDate(Thread.created_at)}</span>
          </p>
          <span>No.</span>
        </a>
        {showButton ? (
          <p className="replyButton" onClick={ButtonOnClick}>{Thread.ID}</p>
        ) : (
          <a href={`http://localhost:3000/${Thread.ID}`}>
            <p>{Thread.ID}</p>
          </a>
        )}
      </div>
      <div className="postText">
        <p>{Thread.text}</p>
      </div>
    </>
  );
}

export default PostHeader;
