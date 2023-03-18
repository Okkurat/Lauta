import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function ThreadMaker() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  async function handleThread(e) {
    e.preventDefault();

    if(!text.trim()){
        alert("Text must be provided.");
        return;
    }

    fetch("http://localhost:4000/thread", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
                            title: title,
                            text: text
                            })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log("THIS SHOULD HAPPEN")
        setRedirectUrl(`/${data.threadId}`);
    })
    .catch(error => console.error(error))
  }
  
  if (redirectUrl) {
    return <Navigate to={redirectUrl} replace={true} />;
  }

  return (
    <div className="ThreadMaker">
      <form onSubmit={handleThread}>
        <input type="text" placeholder="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Post text" name="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Post Thread</button>
      </form>
    </div>
  );
}

export default ThreadMaker;
