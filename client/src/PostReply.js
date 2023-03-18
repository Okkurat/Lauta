import './App.css';
import React, { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';

function PostReply({ postId }) {

    const { threadID } = useParams();
    const [text, setText] = useState("");

    function handleKeyDown(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          setText(text + "\n");
        }
    }

    useEffect(() => {
        if (postId) {
          setText(() => `>>${postId}\n`);
        }
        return () => {
            setText("");
        };
    }, [postId]);


    async function handleReply (e) {
        e.preventDefault()
        console.log(text)
        if(!text.trim()){
            alert("Text must be provided.");
            return;
        }

        let reply;
        const match = text.match(/^>>(\d+)/);
        if (match) {
            reply = match[1];
          } else {
            reply = null
        }

        const element = document.querySelector(".replyButton").innerHTML;

        const data = {thread: element, text: text, reply: reply}

        if(data.thread == data.reply) {
            data.reply = 0
        }

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        console.log(data)


        fetch("http://localhost:4000/post", options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log("THIS SHOULD HAPPEN")
        })
        .catch(error => console.error(error))
      }

    return (
    <div className="PostReply">
        <form onSubmit={handleReply}>
            <textarea type="text" placeholder="Post text" name="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} />
            <button type="submit">Post Reply</button>
        </form>
    </div>
    );
}

export default PostReply;
