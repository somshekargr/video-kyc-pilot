const fs = require('fs');
const fse = require('fs-extra');

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

fse.copySync('./assets', './dist/assets/', { overwrite: true }, function (err) {
    if (err) {
        console.error("Failed to copy assets:", err);
    } else {
        console.log("assets copied!");
    }
});
