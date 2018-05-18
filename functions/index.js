const functions = require('firebase-functions');
const admin = require("firebase-admin");
const uuid = require('uuid-v4');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const gconfig = {
    projectId: 'rnitcourse-1526268662241',
    keyFilename: 'rncourse.json'
};

const gcs = require('@google-cloud/storage')(gconfig);

admin.initializeApp({
    credential: admin.credential.cert(require('./rncourse.json'))
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
    cors(request, response,() => {
        if (!request.headers.authorization || !request.headers.authorization.startsWith("Bearer")) {
            console.log('No token!');
            response.status(403).json({ error: "Unauthorized" });
            return;
        }

        let idToken = request.headers.authorization.split("Bearer ")[1];
        admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                const body = JSON.parse(request.body);

                fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', err => {
                    console.log(err);
                    return response.status(500).json({ error: error });
                });
        
                const bucket = gcs.bucket('rnitcourse-1526268662241.appspot.com');
                const uuidString = uuid();
        
                bucket.upload('/tmp/uploaded-image.jpg', {
                    uploadType: 'media',
                    destination: '/places/' + uuidString + '.jpg',
                    metadata: {
                        metadata: {
                            contentType: 'image/jpeg',
                            firebaseStorageDownloadTokens: uuidString
                        }
                    }
                }, (err, file) => {
                    if (!err) {
                        console.log('bucket-----', bucket, 'file----', file)
                        response.status(201).json({
                            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/' +
                                bucket.name + '/o/' + encodeURIComponent(file.name) +
                                '?alt=media&token=' + uuidString
                        });
                    } else {
                        console.log('error', err);
                        response.status(500).json({ error: err })
                    }
                })
            })
            .catch(err => {
                console.log('Token invalid');
                response.status(403).json({ error: "unauthorized" })
            })
    });
});
