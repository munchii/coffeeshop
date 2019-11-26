import express from "express";

const http = express();
http.use(express.static("public"))
http.listen(8080);
console.log("Listening on 8080...");
