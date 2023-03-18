import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
import PostHeader from "./PostHeader";
import PostReply from "./PostReply";

function Thread() {
    const { id } = useParams();
    const [posts, setPosts] = useState([])
    const [Thread, setThread] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [replyBox, setReplyBox] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    

    const handleButtonClick = (e) => {
        console.log(e.target.innerText)
        setSelectedPostId(e.target.innerText);
        setReplyBox(!replyBox);
        reply()
    };

    useEffect(() => {
        setSpinner(true);
        fetch(`http://localhost:4000/thread/${id}`)
            .then((response) => response.json())
            .then((data) => {
            setSpinner(false);
            console.log(data);
            if (data.message === "404") {
                return;
            }
            setThread(data);
            })
            .catch((error) => console.error(error));
    }, [id]);

    useEffect(() => {
        const fetchData = async () =>
        {
        setSpinner(true);
        fetch(`http://localhost:4000/posts/${id}`)
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            if (data.message === "404") {
                return;
            }
            setPosts(data);
            })
            .catch((error) => console.error(error));
        }
        fetchData()
        /*
        const interval = setInterval(() => {
            fetchData();
        }, 30000);
        return () => clearInterval(interval);*/
  }, []);

const reply = () => {
    if(replyBox){
        setReplyBox(false)
        return
    }
    setReplyBox(true);
};

  return (
    <div className="container">
      {spinner ? (
        <div className="spinner"></div>
      ) : Thread ? (
        <div className="threadContainer">
            <div className="postContainer">
                <PostHeader Thread={Thread} showButton={true} ButtonOnClick={handleButtonClick}/>
            </div>
        </div>
      ) : (
        <>
          <h2>404 Thread not found</h2>
        </>
      )}
      {replyBox && <PostReply postId={selectedPostId}></PostReply>}
      {posts.length > 0 ? (
            <div className="postList">
                {posts.map((post) => (
                    <div key={post.ID}>
                        <PostHeader Thread={post} post_to_OP={post.reply_to_OP} showButton={true} ButtonOnClick={handleButtonClick}/>
                    </div>
                ))}
            </div>
        ) : (
            <h2>No posts found</h2>
        )}
    </div>
  );
}

export default Thread;