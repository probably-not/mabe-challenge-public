const fs = require("fs");

const cardsData = fs.readFileSync("./cards.json");
const cards = JSON.parse(cardsData);
const allCards = cards.map((c) => {
  return Buffer.from(JSON.stringify(c));
});
const allCardsLength = allCards.length;
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
const rpath = "/card_add?";
const pathMatch = new RegExp(rpath);

const router = async (req, res) => {
  res.statusCode = 200;

  if (
    req.url.startsWith(rpath) ||
    req.url.includes(rpath) ||
    pathMatch.test(req.url)
  ) {
    const userId = req.url.split("id=")[1];

    if (!userIndexes[userId]) {
      userIndexes[userId] = myStart;
    }
    const idx = (userIndexes[userId] += 1);

    if (idx <= myHalf) {
      res.end(allCards[idx - 1]);
      return;
    }
    res.end(userSawAllCards);
    return;
  }

  res.end(JSON.stringify({ ready: true }));
};

const http = require("turbo-http");
let server = http.createServer();

server.on("request", router);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
