const mongoose = require('server/db/mongoose');
async function init() {
    mongoose.connection.close()
}

init()
