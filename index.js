const fs = require("fs");

const cardsData = fs.readFileSync("./cards.json");
const cards = JSON.parse(cardsData);
const allCards = cards.map((c) => {
  return Buffer.from(JSON.stringify(c));
});
const userSawAllCards = Buffer.from(JSON.stringify({ id: "ALL CARDS" }));

const port = +process.argv[2] || 3000;
const lockFile = "./master.lock";
let isMaster = true;
try {
  fs.writeFileSync(lockFile, `${port}`, { flag: "wx" });
} catch (err) {
  if (err.message.startsWith("EEXIST: file already exists")) {
    isMaster = false;
  } else {
    console.log("Master Lock Error", err);
    throw err;
  }
}

let masterPort;
if (!isMaster) {
  masterPortStr = fs.readFileSync(lockFile, "utf8");
  masterPort = parseInt(masterPortStr, 10);
  fs.unlinkSync(lockFile);
}

// Define start and end for each side, to stop the tester without sending duplicates
let myStart;
let myHalf;
if (isMaster) {
  myStart = 0;
  myHalf = 50;
} else {
  myStart = 50;
  myHalf = 100;
}

const shutdownHandler = (signal) => {
  console.log("starting shutdown, got signal " + signal);
  if (isMaster) {
    try {
      fs.unlinkSync(lockFile);
    } catch (err) {
      console.log(
        "failed to delete lockfile probably because it's already been deleted",
        err
      );
    }
  }
  process.exit(0);
};

process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);

const userIndexes = {};

const router = async (req, res) => {
  res.statusCode = 200;

  if (req.url === "/read") {
    res.end(JSON.stringify({ ready: true }));
    return;
  }

  if (!userIndexes[req.url]) {
    userIndexes[req.url] = myStart;
  }
  const idx = (userIndexes[req.url] += 1);

  if (idx <= myHalf) {
    res.end(allCards[idx - 1]);
    return;
  }
  res.end(userSawAllCards);
  return;
};

const http = require("turbo-http");
let server = http.createServer();

server.on("request", router);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
