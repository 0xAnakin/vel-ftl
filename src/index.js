const pkg = require('../package.json');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const async_util = require('async');
const lib = require('./lib');

const PATH_IN = path.join(__dirname, '../in');
const PATH_OUT = path.join(__dirname, '../out');

(async () => {

    if (!fs.existsSync(PATH_IN)) {
        fs.mkdirSync(PATH_IN, {
            recursive: true
        });
    }

    if (!fs.existsSync(PATH_OUT)) {
        fs.mkdirSync(PATH_OUT, {
            recursive: true
        });
    }

    // ============================================================= //

    const files = fs.readdirSync(PATH_IN);

    console.log(`found ${files.length} files to convert`);

    async_util.eachOfSeries(files, function (file, idx, callback) {

        (async () => {

            try {

                console.log(`file ${(idx+1)} converting...`);

                const {
                    stdout,
                    stderr
                } = await exec(`java -jar ${path.join(__dirname, '../libs/USCavalry0_3/cavalry.jar')} ${path.join(PATH_IN, file)}`);

                if (!stdout.trim().length) {
                    callback(stderr);
                } else {

                    fs.writeFileSync(path.join(PATH_OUT, `${path.parse(file).name}.ftl`), stdout, {
                        encoding: 'utf8'
                    });

                    console.log(`file ${(idx+1)} converted`);

                    callback();

                }

            } catch (err) {
                callback(err);
            }

        })();

    }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('done!');
        }
    })


})();