const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const bin =
  process.platform === "darwin"
    ? "/usr/local/Cellar/dcraw/9.27.0_2/bin/dcraw"
    : "/usr/bin/dcraw";

const develope = (cwd, total, extractRaw, convert) =>
  new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(cwd))
        return reject(`directory does not exist => ${cwd}`);
      else {
        const rawDir = path.join(cwd, "raw");
        if (fs.existsSync(rawDir))
          return reject(`raw directory already exist => ${rawDir}`);
        const jpgDir = path.join(cwd, "jpg");
        if (fs.existsSync(jpgDir))
          return reject(`raw directory already exist => ${jpgDir}`);
        const files = fs.readdirSync(cwd);
        const rawFiles = files.filter(file => /.CR2$/.test(file));
        if (rawFiles.length < 1)
          return reject(`no raw files found in => ${cwd}`);
        total(rawFiles.length);
        fs.mkdirSync(rawDir);
        fs.mkdirSync(jpgDir);
        rawFiles.forEach((file, idx) => {
          execSync(`${bin} -e ${file}`, { cwd });
          fs.renameSync(path.join(cwd, file), path.join(rawDir, file));
          const baseName = file.split(".")[0];
          fs.renameSync(
            path.join(cwd, baseName + ".thumb.jpg"),
            path.join(jpgDir, baseName + ".JPG")
          );
          extractRaw(idx + 1);
        });
        return resolve(`processing photos in ${cwd}`);
      }
    } catch (e) {
      e => reject(e.messsage);
    }
  });

module.exports = {
  develope
};
