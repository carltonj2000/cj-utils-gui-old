const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const bin =
  process.platform === "darwin"
    ? "/usr/local/Cellar/dcraw/9.27.0_2/bin/dcraw"
    : "/usr/bin/dcraw";

const extractRaw = cwd => {
  const rawDir = path.join(cwd, "raw");
  const jpgDir = path.join(cwd);

  if (!fs.existsSync(rawDir)) {
    console.log(`Error! Directory does not exist: ${rawDir}`);
    process.exit(-1);
  }

  fs.readdirSync(rawDir).forEach(file => {
    const rawFile = path.join(rawDir, file);
    const jpg = file.split(".")[0] + ".thumb.jpg";
    const jpgFrom = path.join(rawDir, jpg);
    const jpgTo = path.join(jpgDir, jpg);
    execSync(`${bin} -e ${rawFile}`);
    execSync(`mv ${jpgFrom} ${jpgTo}`);
    console.log(jpg);
  });
};

const cwd = process.cwd();

const moveRaw = cwd => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else {
  }
};

const develope = cwd =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(cwd)) reject(`directory does not exist => ${cwd}`);
    else resolve(`processing photos in ${cwd}`);
  });

module.exports = {
  moveRaw,
  extractRaw,
  develope
};
