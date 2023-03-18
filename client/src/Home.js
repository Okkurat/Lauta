import './App.css';
import React, { useState, useEffect } from "react"
import ThreadMaker from './ThreadMaker';
import PostHeader from './PostHeader';

function Home() {
  const [threads, setThreads] = useState([])

	useEffect(() => {
		fetch("http://localhost:4000/home")
			.then(response => response.json())
			.then(data => setThreads(data))
			.catch(error => console.error(error))
	}, [])

  console.log(threads)

  return (
    <div className="Home">
      {<ThreadMaker/>}
      {threads.map(thread => {
        return (
        <div className="postContainer" key={thread.ID}>
            <PostHeader Thread={thread} />
        </div>
        )
      })}
    </div>
  );
}

export default Home;
