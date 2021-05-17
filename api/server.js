const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const sh = require('shelljs');

app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());

app.post('/upload', (req, res) => {
    const uploadedFiles = req.files;

    if (!uploadedFiles) {
        return res.status(500).send({ msg: "No files found" });
    }

    uploadedFiles.logs.mv(`${__dirname}/public/${uploadedFiles.logs.name}`, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({ msg: "Error occured while moving to public dir" });
        }
        
        return res.send({ name: uploadedFiles.logs.name, path: `/${uploadedFiles.logs.name}` });
    });
})

app.listen(3001, () => {
    console.log('Server running on port 3001');
})

