import { credential, initializeApp, app } from 'firebase-admin'
import * as path from 'path'

const cred = credential.cert(path.join(__dirname, '../../serviceAccountKey.json'));

const Firebase: app.App = initializeApp({
    credential: cred,
})

export default Firebase;