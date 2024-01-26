const { LLC } = require("../models/llc");
const winston = require("winston");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const { mongo, connection } = require('mongoose');
const Joi = require("joi");
const path = require('path');
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const multer = require('multer');
const crypto = require('crypto');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { config } = require("dotenv");
const methodOverride = require('method-override');



const url = process.env.DB_URI;

const conn = mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


let gfs;
conn.once('open', () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
    //   gfs = Grid(conn.db, mongoose.mongo);
    //   gfs.collection('uploads');
});



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname)
//     cb(null, Date.now() + '-' + ext)
//   }
// })

// // mimetype.split
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, callback) {
//     if (
//       file.mimetype.split("/")[1] == "pdf"
//       // ||
//       // file.mimetype == "image/jpg"
//     ) {
//       callback(null, true)
//     } else {
//       console.log('only png or jpg file supported!')
//       callback(null, false)
//     }
//   },
//   // limits:{
//   //     fileSize: 1024 * 1024 * 2
//   // }
// })

const storagefs = GridFsStorage({
    url: url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            })
        })
    }
})

const uploadGrid = multer({
    storage: storagefs,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype.split("/")[1] == "pdf"
            // ||
            // file.mimetype == "image/jpg"
        ) {
            callback(null, true)
        } else {
            console.log('only png or jpg file supported!')
            callback(null, false)
        }
    },
    // limits:{
    //     fileSize: 1024 * 1024 * 2
    // }
})



router.get("/", async (req, res, next) => {
    try {
        const propllcdb = await LLC.find().sort({ date: -1 });
        // const filteredprop = prop.filter(pro => pro.uid === req.user._id);
        // res.send(filteredprop);
        res.send(propllcdb);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
        winston.error(error.message);
    }
});

// router.get('/files/:filename', (req, res) => {
//     gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
//       if(!files || files.length === 0){
//         return res.status(404).json({
//           message: "Could not find file"
//         });
//       }
//       var readstream = gfs.createReadStream({
//         filename: files[0].filename
//       })
//       res.set('Content-Type', files[0].contentType);
//       return readstream.pipe(res);
//     });
//   });

//   router.get('/files', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//       if(!files || files.length === 0){
//         return res.status(404).json({
//           message: "Could not find files"
//         });
//       }
//       return res.json(files);
//   });
//   })

  const uploadMiddleware = (req, res, next) => {
    const upload = uploadGrid.single('fileupload');
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('File too large');
      } else if (err) {
        // check if our filetype error occurred
        if (err === 'filetype') return res.status(400).send('pdf files only');
        // An unknown error occurred when uploading.
        return res.sendStatus(500);
      }
      // all good, proceed
      next();
    });
  };

  router.post('/', uploadMiddleware, async (req, res) => {
    let FileLoad;
    if (req.file) {
        FileLoad = req.file.path;
      }
    const proLLC = new LLC({
        buildingtype: req.body.buildingtype,
        propstatus: req.body.propstatus,
        rent: req.body.rent,
        propaddress: req.body.propaddress,
        corpname: req.body.corpname,
        corptype: req.body.corptype,
        regState: req.body.regState,
        corpId: req.body.corpId,
        ein: req.body.ein,
        incorporated: req.body.incorporated,
        mailingAddress: req.body.mailingAddress,
        regAgentAddress: req.body.regAgentAddress,
        fileupload: FileLoad,
    });
    // res.send({ success: false });
        const savedproLLC = await proLLC.save();
        res.status(200).send(savedproLLC);
  });
// app.post("/upload", uploadGrid.single("fileupload"), (req, res) => {
//     res.status(200)
//       .send("File uploaded successfully");
//   });


// router.post("/upload/", uploadMiddleware, async (req, res) => {
//     try {

//         const proLLC = new LLC({
//             buildingtype: req.body.buildingtype,
//             propstatus: req.body.propstatus,
//             rent: req.body.rent,
//             propaddress: req.body.propaddress,
//             corpname: req.body.corpname,
//             corptype: req.body.corptype,
//             regState: req.body.regState,
//             corpId: req.body.corpId,
//             ein: req.body.ein,
//             incorporated: req.body.incorporated,
//             mailingAddress: req.body.mailingAddress,
//             regAgentAddress: req.body.regAgentAddress,
//             // fileupload: fileupload,
//         });
//         if (req.file) {
//             proLLC.fileupload = req.file.path
//         }
//         const savedproLLC = await proLLC.save();
//         res.status(200).send(savedproLLC);

//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });

// router.post("/", upload.single('fileupload'), async (req, res) => {
//     try {

//         const proLLC = new LLC({
//             buildingtype: req.body.buildingtype,
//             propstatus: req.body.propstatus,
//             rent: req.body.rent,
//             propaddress: req.body.propaddress,
//             corpname: req.body.corpname,
//             corptype: req.body.corptype,
//             regState: req.body.regState,
//             corpId: req.body.corpId,
//             ein: req.body.ein,
//             incorporated: req.body.incorporated,
//             mailingAddress: req.body.mailingAddress,
//             regAgentAddress: req.body.regAgentAddress,
//             // fileupload: req.file.path,
//         });
//         if (req.file) {
//             proLLC.fileupload = req.file.path
//         }
//         const savedproLLC = await proLLC.save();
//         res.status(200).send(savedproLLC);

//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });




router.delete("/:id", async (req, res) => {
    try {
        const prop = await LLC.findById(req.params.id);
        if (!prop) return res.status(404).send("Property LCC not found...");
        // if (prop.uid !== req.user._id)
        // return res.status(401).send("Propertydb deletion failed. Not authorized...");
        const deletedprop = await LLC.findByIdAndDelete(req.params.id);
        res.send(deletedprop);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
        console.log(error.message);
    }

});

module.exports = router;

