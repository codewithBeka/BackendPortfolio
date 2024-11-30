// src/firebaseAdmin.js
import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Load service account JSON from environment variable.


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;