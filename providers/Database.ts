import { MongoClient } from 'mongodb'
import Locals from './Locals';

class Database {

  client: MongoClient = new MongoClient(Locals.config().mongodbURL);

  public async initialazation() {
    await this.client.connect((error) => {
      if (error)
        this.client.close();
    });
  }
}

export default new Database();
