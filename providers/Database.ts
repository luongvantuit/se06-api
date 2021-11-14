import { MongoClient } from 'mongodb'
import Log from '../middlewares/Log';
import Locals from './Locals';

class Database {

  client: MongoClient = new MongoClient(Locals.config().mongodbURL);

  public async initialazation() {
    await this.client.connect();
    Log.default(this.client.db());
  }
}

export default new Database();
