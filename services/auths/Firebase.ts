import { credential, initializeApp, app } from 'firebase-admin'

const cred = credential.cert('./serviceAccountKey.json')

const Firebase: app.App = initializeApp({
    credential: cred,
})

export default Firebase;