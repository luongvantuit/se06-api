import express from 'express';

class App {

    app = express();

    initializeApp(): void {
        this.app.listen(
            parseInt(process.env.PORT ?? '8080')
            ,
            () => {
                console.log("Initialization App Success! 🌟🌟🌟")
            }
        )
    }
}

export default new App;