import express from "express";

function modify(req, res, next){
  const write = res.write;
  res.write = function (chunk) {
    if (process.argv.includes("--local") && res.getHeader("Content-Type").includes("text/html")) {
      const parts: string[] = chunk.toString().split("https://food.munchii.com");
      // Fix content to match content length header
      const padding = " ".repeat(3 * (parts.length - 1));

      write.apply(this, [Buffer.from(parts.join("http://localhost:8100") + padding)]);
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
