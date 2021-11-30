import admin from "firebase-admin";
import * as path from "path";

const cred = admin.credential.cert(
    path.join(__dirname, "../../serviceAccountKey.json")
);

const Firebase: admin.app.App = admin.initializeApp({
    credential: cred,
});

export default Firebase;
