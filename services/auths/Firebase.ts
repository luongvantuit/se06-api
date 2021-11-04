import { credential, initializeApp, app } from 'firebase-admin'

const cred = credential.cert('./serviceAccountKey.json')

class Firebase {
    public initializeApp(): app.App {
        const _app: app.App = initializeApp({
            credential: cred,
        })
        return _app;
    }
}

export default new Firebase;