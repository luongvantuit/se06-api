import dotenv from 'dotenv'

class Locals {

    public config(): void {
        dotenv.config();
    }
}

export default new Locals;