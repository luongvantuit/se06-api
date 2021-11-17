import Locals from './Locals';
import mongoose from 'mongoose';

class Database {

    public async initialazation() {
        await mongoose.connect(Locals.config().mongodbURL, {
        }, async (error: mongoose.CallbackError) => {
            if (error !== null)
                await mongoose.disconnect()
        });
    }
}

export default new Database;
