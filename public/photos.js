const path = require("path");
const fs = require("fs");
const { execSync, exec } = require("child_process");

const dcraw =
  process.platform === "darwin" ? "/usr/local/bin/dcraw" : "/usr/bin/dcraw";

const convert =
  process.platform === "darwin"
    ? "/usr/local/bin/convert"
    : "/usr/local/bin/convert";

const develope = (cwd, size, total, extractRaw, convertMsg) => {
  const rawDir = path.join(cwd, "raw");
  const jpgDir = path.join(cwd, "jpg");
  const resizeDir = path.join(cwd, "resized", "size_" + size);
  let rawFiles;
  let jpgFiles;
  // setup directories
  let p = Promise.resolve().then(
    () =>
      new Promise((resolve, reject) => {
        if (!fs.existsSync(cwd))
          return reject(`directory does not exist => ${cwd}`);
        if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir);
        if (!fs.existsSync(jpgDir)) fs.mkdirSync(jpgDir);
        const files = fs.readdirSync(cwd);
        rawFiles = files.filter(file => /.CR2$/.test(file));
        jpgFiles = files.filter(file => /.(jpg,jpeg)$/i.test(file));
        if (rawFiles.length < 1 && jpgFiles.length < 1)
          return reject(`no raw/jpg files found in => ${cwd}`);
        total(rawFiles.length);
        if (!fs.existsSync(resizeDir)) execSync(`mkdir -p ${resizeDir}`);
        return resolve();
      })
  );
  // handle raw files
  p = p.then(() => {
    let p1 = Promise.resolve();
    rawFiles.forEach((file, idx) => {
      p1 = p1.then(
        () =>
          new Promise(resolve => {
            execSync(`${dcraw} -e ${file}`, { cwd });
            fs.renameSync(path.join(cwd, file), path.join(rawDir, file));
            const baseName = file.split(".")[0];
            const fileOut = baseName + ".JPG";
            const thumb = baseName + ".thumb.jpg";
            fs.renameSync(path.join(cwd, thumb), path.join(jpgDir, fileOut));
            extractRaw(idx + 1);

            const cmd = `${convert} "${path.join(
              jpgDir,
              fileOut
            )}" -resize ${size} "${path.join(resizeDir, fileOut)}"`;

            exec(cmd, () => {
              convertMsg(1);
              return resolve();
            });
          })
      );
    });
    return p1;
  });
  // handle jpg files
  p = p.then(
    () =>
      new Promise(resolve => {
        jpgFiles.forEach(file => {
          // code to be added
          console.log("jpg", file);
        });
        return resolve();
      })
  );
  return p;
};

const reset = (cwd, total, extractRaw, convertMsg) => {
  if (fs.existsSync(`${cwd}ori`)) {
    execSync(`rm -rf ${cwd}`);
    execSync(`cp -R ${cwd}ori ${cwd}`);
    extractRaw(0);
    convertMsg(0);
    total(0);
  } else {
    alert(`Failed! Missing ${cwd}ori.`);
  }
};

module.exports = {
  develope,
  reset
};
