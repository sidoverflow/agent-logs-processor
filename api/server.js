const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const sh = require('shelljs');

const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())
app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());

app.post('/upload', (req, res) => {
    const uploadedFiles = req.files;

    if (!uploadedFiles) return res.status(500).send({ msg: "No files found" });

    uploadedFiles.logs.mv(`${__dirname}/public/${uploadedFiles.logs.name}`, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({ msg: "Error occured while moving to public dir" });
        }
        
        return res.send({ name: uploadedFiles.logs.name, path: `/${uploadedFiles.logs.name}` });
    });
})

app.post('/process', (req, res) => {
    const file = req.body.fileName;
    if (!file) return res.status(500).send({ msg: "No file name found" });

    const { stderr, code } = sh.exec(`./process-logs.sh ${file}`);
    if (code != 0) {
        console.log(stderr);
        return res.send(500).send({ msg: "Error occured while processing" });
    }
    return res.send({ isDownloadReady: true });
})

app.get('/download', (req, res) => {
    const processedFile = `${__dirname}/public/processed_logs.zip`;
    res.download(processedFile);
})

app.listen(3001, () => {
    console.log('Server running on port 3001');
})

