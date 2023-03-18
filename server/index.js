const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")

const mysql = require('mysql2');
const { query } = require("express");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot123',
  database: 'textboard'
});


connection.connect();

async function Test(){ 
    connection.query('show tables', (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            console.log(results);
        }
    });
}

async function createThread(title, text, ipAddress) {
    const query = "INSERT INTO threads (IP, title, text) VALUES (?, ?, ?)"
    const values = [ipAddress, title, text]

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.insertId);
            }
        });
    });
}

async function createPost(thread, text, reply, IP) {
    const replyToOP = reply === 0;
    const query = "INSERT INTO posts (thread, text, reply, IP, reply_to_OP) VALUES (?, ?, ?, ?, ?)";
    const values = [thread, text, reply, IP, replyToOP];
    return new Promise((resolve, reject) => {
      connection.query(query, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

async function getPosts(id) {
    const query = "SELECT ID, text, reply_to_OP, created_at FROM posts WHERE thread = ?"
    return new Promise((resolve, reject) => {
      connection.query(query, id, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }
  

async function getThread(id) {
    const query = "SELECT ID, title, text, created_at FROM threads WHERE ID = ?";
    return new Promise((resolve, reject) => {
        connection.query(query, id, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result[0])
            }
        });
    });
}

function closeConnection() {
    connection.end();
}

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get("/", cors(), async (req, res) => {
    res.send("This is working")
})

app.post("/thread", async (req, res) => {
    const ipAddress = req.connection.remoteAddress;
    const ipv4Address = ipAddress.includes(':') ? ipAddress.split(':').pop() : ipAddress;
    const threadData = {...req.body, ipv4Address}
    createThread(threadData.title, threadData.text, threadData.ipv4Address)
    .then(threadId => {
        console.log(`Inserted new thread with ID ${threadId}`);
        res.status(201).send({ threadId });
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("Error creating thread");
    });
})

app.get("/thread/:id", async (req, res) => {
    getThread(req.params.id)
    .then(data => {
        console.log(data);
        if (data) {
            res.send(data);
        } else {
            res.send({ message: "404" });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("Error fetching thread");
    });
});

app.get("/posts/:id", async (req, res) => {
    getPosts(req.params.id)
    .then(data => {
        console.log(data);
        if (data) {
            res.send(data);
        } else {
            res.send({ message: "404" });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("Error fetching thread");
    });
});

app.get("/home", cors(), async (req, res) => {
    connection.query("SELECT ID, title, text, created_at FROM threads", (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving threads');
        } else {
            res.send(results);
        }
    });
})

app.post("/post", async(req, res) => {
    const ipAddress = req.connection.remoteAddress;
    const ipv4Address = ipAddress.includes(':') ? ipAddress.split(':').pop() : ipAddress;
    const threadData = {...req.body, ipv4Address}
    console.log(threadData)
    createPost(threadData.thread, threadData.text, threadData.reply, threadData.ipv4Address)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send("Error creating thread");
    });
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

process.on('SIGINT', closeConnection);

//Test()