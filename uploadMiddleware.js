// uploadMiddleware.js

const multer = require('multer');

const upload = multer({
    limits: {
        fillSize: 4 * 1024 * 1024,
    },
    extended: true
});

module.exports = upload;
