const { LLC } = require("../models/llc");
const winston = require("winston");
const Joi = require("joi");
const path = require('path')
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const multer = require('multer');
const crypto = require('crypto');
const {GridFsStorage} = require('multer-gridfs-storage');
const formidable = require('formidable');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + ext)
  }
})

// mimetype.split
const upload = multer({
  storage: storage,
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



const url = process.env.DB_URI;

const storagefs = GridFsStorage({
  url,
  file: (req, file) =>{
      return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) =>{
              if(err){
                  return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo ={
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
      console.log('only pdf file supported!')
      callback(null, false)
    }
  },
})

// const propForm = async (req, res) => {
//   const form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, file) => {
//     console.log(fields)
//     console.log(file)
//   })
// }
// router.post('/',upload.single('fileupload'), propForm );


router.post('/', upload.single('fileupload'), async (req, res) => {
  let FileLoad ;
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

// router.post("/", uploadGrid.single('fileupload'), async (req, res) => {
//   // const { buildingtype, propstatus, rent, propaddress, corpname, corptype, regState, corpId, ein, incorporated, mailingAddress, regAgentAddress, fileupload, date } = req.body;

//   try {

//     // const product = new LLC({
//     //   buildingtype: req.body,
//     //   propstatus: req.body,
//     //   rent: req.body,
//     //   propaddress: req.body,
//     //   corpname: req.body,
//     //   corptype: req.body,
//     //   regState: req.body,
//     //   corpId: req.body,
//     //   ein: req.body,
//     //   incorporated: req.body,
//     //   mailingAddress: req.body,
//     //   regAgentAddress: req.body,
//     //   fileuploads: req.file.path,
//     // });
//     // const savedProduct = await product.save();
//     // res.status(200).send(savedProduct);
//     // if (image) {
//     //   const uploadedResponse = await cloudinary.uploader.upload(image, {
//     //     upload_preset: "almonivepk",
//     //   });
//     // if (req.file) {
//     //   proLLC.fileupload = req.file.path
//     // }
//       const proLLC = new LLC({
//         buildingtype: req.body.buildingtype,
//         propstatus: req.body.propstatus,
//         rent: req.body.rent,
//         propaddress: req.body.propaddress,
//         corpname: req.body.corpname,
//         corptype: req.body.corptype,
//         regState: req.body.regState,
//         corpId: req.body.corpId,
//         ein: req.body.ein,
//         incorporated: req.body.incorporated,
//         mailingAddress: req.body.mailingAddress,
//         regAgentAddress: req.body.regAgentAddress,
//         // fileupload: req.file.path,
//       });
//       if (req.file) {
//         proLLC.fileupload = req.file.path
//       }
//       const savedproLLC = await proLLC.save();
//       res.status(200).send(savedproLLC);
    
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });



router.put("/:id", isAdmin, async (req, res) => {
  if (req.file.path) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.product.image.public_id
    );

    if (destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "almonivepk",
        }
      );

      if (uploadedResponse) {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body.product,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedProduct);
      }
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

router.put("/:id", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    phone: Joi.string().min(3).max(200).required(),
    card: Joi.string().min(3).max(200).required(),
    address: Joi.string().min(3).max(10240).required(),
    buildingtype: Joi.string().min(3).max(10240),
    propstatus: Joi.string().min(3).max(10240),
    rent: Joi.number().integer().min(3).max(10240),
    propaddress: Joi.string().min(3).max(10240),
    active: Joi.boolean(),
    date: Joi.date(),
    author: Joi.string().min(3),
    uid: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);
  try {
    const prop = await Propertydb.findById(req.params.id);
    if (!prop) return res.status(404).send("Propertydb not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Property update failed. Not authorized...");
    const {buildingtype, propstatus, rent, propaddress, active, date, author, uid } = req.body;
    const updatedprop = await Propertydb.findByIdAndUpdate(
      req.params.id,
      {buildingtype, propstatus, rent, propaddress, active, date, author, uid },
      { new: true }
    );
    res.send(updatedprop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }
});



router.patch("/:id", async (req, res) => {
  try {
    const prop = await Propertydb.findById(req.params.id);
    if (!prop) return res.status(404).send("Propertydb not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Propertydb check/uncheck failed. Not authorized...");
    const updatedprop = await Propertydb.findByIdAndUpdate(
      req.params.id,
      {
        active: !prop.active,
      },
      {
        new: true,
      }
    );
    res.send(updatedprop);

  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }

});



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

