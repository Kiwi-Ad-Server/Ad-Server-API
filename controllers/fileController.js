/**
 * fileController.js
 *
 * @author Selma Auala <selmaauala15@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const firebaseAdmin = require("../services/firebaseAdmin"); 
const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file; 
    const storageRef = firebaseAdmin.storage().bucket();
    const fileRef = storageRef.file(file.originalname);
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: Date.now().toString(),
        },
      },
    });

    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${
      storageRef.name
    }/o/${encodeURIComponent(fileRef.name)}?alt=media&token=${Date.now()}`;
    const newFile = new File({
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      storageUrl: storageUrl,
      uploader: req.user._id, // Assuming you have user authentication middleware
    });
    await newFile.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
