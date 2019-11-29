import express from "express";

function modify(req, res, next){
  const write = res.write;
  res.write = function (chunk) {
    if (process.argv[2] === "--local" && res.getHeader('Content-Type').indexOf('text/html') > -1) {
      const replacement = chunk.toString()
        .split("https://food.munchii.com")
        .join("http://localhost:8100")
      write.apply(this, [Buffer.from(replacement)]);
    } else {
      write.apply(this, arguments);
    }
  };

  next();
}

const http = express();
http.use(modify);
http.use(express.static("public"));
http.listen(8000);
console.log("Listening on 8000...");
