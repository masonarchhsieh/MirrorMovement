// router.js

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');

router.get('/index', async function (req, res) {
      await res.render('index');
});

// Handle the POST method
router.post('/post', upload.single('image'), async function(req, res) {
    const imagePath = path.join(__dirname, '/public/picture');
    const fileUpload = new Resize(imagePath);

    if (!req.file) {
         res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({ name: filename, content: req.file });
});

module.exports = router;
