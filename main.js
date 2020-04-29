const Comparator = require("./lib/tokenComparator");
const ReadToken = require("./lib/readtoken");
const fs = require("fs");

const filepath = process.argv[2] || "data/zero.txt";

function readToken() {
  let count1 = 0;
  const start = new Date().getTime();
  const rl1 = new ReadToken(fs.createReadStream(filepath, { encoding: "utf-8" }), { maxLength: 100, readSize: 8192 });
  rl1.on('token', token => {
    count1++;
  });
  rl1.on("close", () => {
    console.log(`Prcessed: ${count1} tokens, ${new Date().getTime() - start}ms`);
  });
}

async function compareFiles() {
  const start = new Date().getTime();
  const comparator = new Comparator();
  const result = await comparator.compareFiles(filepath, filepath);
  console.log(`Prcessed: ${new Date().getTime() - start}ms`);
}

compareFiles();
// readToken();
