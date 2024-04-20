/**
 * firebaseAdmin.js
 *
 * @author Selma Auala <selmaauala15@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const admin = require('firebase-admin');
const serviceAccount = require('../key/kiwi-ad-server-firebase-adminsdk-lhvt1-911f51221e.json');


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'kiwi-ad-server.appspot.com', 
});

// Function to upload file to Firebase Storage
const uploadFileToStorage = async (file, metadata) => {
  try {
    const bucket = admin.storage().bucket();
    const fileUploadResponse = await bucket.upload(file.path, {
      metadata: {
        metadata: {
          ...metadata,
        },
      },
    });
    const fileUrl = fileUploadResponse[0].metadata.mediaLink;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('File upload to Firebase Storage failed');
  }
};

module.exports = {
  uploadFileToStorage,
};
