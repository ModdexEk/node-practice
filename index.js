const yargs = require("yargs");
const path = require("path");
const fs = require("fs");

const args = yargs
      .usage('Usage: node $0 [options]')
      .version('0.0.1')
      .alias('version', 'v')
      .help('help')
      .alias('help', 'h')
      .example('node $0 --entry ./path --dist ./path --delete')
      .option('entry', {
        alias: 'e',
        describe: 'Указать путь к исходной директории',
        demandOption: true
      })
      .option('dist', {
        alias: 'd',
        describe: 'Указать путь к dist директории',
        default: './dist'
      })
      .option('delete', {
        alias: 'D',
        describe: 'Удалять ли исходную папку',
        boolean: true,
        default: false
      })
      .epilog('Первая домашка')
      .argv

const config = {
    entry: path.normalize(path.join(__dirname, args.entry)),
    dist: path.normalize(path.join(__dirname, args.dist)),
    delete: args.delete
}

function createDir(src, callback) {
    fs.mkdir(src, (err) => {
        if (err && err.code === 'EEXIST') {
            callback(null)
        } else if (err) {
            callback(err)
        } else {
            callback(null)
        }
    })
}

function sorter (src) {
    fs.readdir(src, (err, files) => {
        if (err) throw err

        files.forEach((file) => {
            const currentPath = path.join(src, file)

            fs.stat(currentPath, (err, stat) => {
                if (err) throw err

                if (stat.isDirectory()) {
                    sorter(currentPath)
                } else {
                    createDir(config.dist, (err) => {
                        if (err) throw err

                        const folderName = path.join(config.dist, file[0].toUpperCase())

                        createDir(folderName, (err) => {
                            if (err) throw err

                            console.log('тест', currentPath)
                            const newPath = path.join(folderName, file)
                            fs.rename(currentPath, newPath, err => {
                                if (err) {
                                  console.error(err.message);
                                  return;
                                }
                              })

                            
                        })
                    })

                    
                }

            })

        })
    })
}

try {
    sorter(config.entry)
} catch (error) {
    console.error(error)
}