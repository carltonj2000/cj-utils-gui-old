const path = require("path");
const fs = require("fs");
const { execSync, exec } = require("child_process");

const dcraw =
  process.platform === "darwin" ? "/usr/local/bin/dcraw" : "/usr/bin/dcraw";

const convert =
  process.platform === "darwin"
    ? "/usr/local/bin/convert"
    : "/usr/local/bin/convert";

const develope = (cwd, size, total, extractRaw, convert) =>
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

        const images = [];
        rawFiles.forEach((file, idx) => {
          execSync(`${dcraw} -e ${file}`, { cwd });
          fs.renameSync(path.join(cwd, file), path.join(rawDir, file));
          const baseName = file.split(".")[0];
          images.push(baseName);
          fs.renameSync(
            path.join(cwd, baseName + ".thumb.jpg"),
            path.join(jpgDir, baseName + ".JPG")
          );
          extractRaw(idx + 1);
        });
        const dst = path.join(cwd, "resized", "size_" + size);
        if (fs.existsSync(dst))
          return reject(`resize directory already exist => ${dst}`);
        execSync(`mkdir -p ${dst}`);

        let p = new Promise(resolve => resolve());
        images.forEach(image => {
          const file = image + ".JPG";
          const cmd = `${convert} "${path.join(
            jpgDir,
            file
          )}" -resize ${size} "${path.join(dst, file)}"`;
          p = p.then(
            () =>
              new Promise((resolve, reject) => {
                exec(cmd, (err, stdout, stderr) => {
                  if (err) return reject(err);
                  convert(1);
                  return resolve();
                });
              })
          );
        });
        p = p.catch(e => reject(e));
        p = p.then(() => resolve(`finished processing photos in ${cwd}`));
      }
    } catch (e) {
      console.log("e1", e);
      return reject(e.Error);
    }
  });

const reset = cwd => {
  if (fs.existsSync(`${cwd}ori`)) {
    execSync(`rm -rf ${cwd}`);
    execSync(`cp -R ${cwd}ori ${cwd}`);
  } else {
    alert(`Failed! Missing ${cwd}ori.`);
  }
};

module.exports = {
  develope,
  reset
};
