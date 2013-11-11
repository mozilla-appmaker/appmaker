web: node -e "fs = require('fs'); fs.writeFile('tmp.env', JSON.stringify(process.env));" && node node_modules/foreman/nf.js start -j Procfile.chain -p $PORT -e tmp.env
