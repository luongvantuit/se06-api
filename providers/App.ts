import Express from "./Express";
import dotenv from "dotenv";
import Database from "./Database";
import { join } from 'path';

class App {
    public loadConfiguration(): void {
        dotenv.config({ path: join(__dirname, '../.env') });
    }

    public loadServer(): void {
        Express.initialization();
    }

    public loadDatabase(): void {
        Database.initialazation();
    }
}

export default new App;
