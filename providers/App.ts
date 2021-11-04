import Express from "./Express";
import dotenv from 'dotenv';
import Database from "./Database";

class App {

    public loadConfig(): void {
        dotenv.config();
    }

    public loadServer(): void {
        Express.initialization();
    }

    public loadDatabase(): void {
        Database.initialazation();
    }
    
}

export default new App;