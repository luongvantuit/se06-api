import { credential, initializeApp, app } from 'firebase-admin'


const cred = credential.cert('./serviceAccountKey.json')

const firebase: app.App = initializeApp({
    credential: cred,
})

export default firebase;