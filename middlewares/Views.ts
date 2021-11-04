import e, * as express from "express";
import * as path from 'path'

class Views {

    public mount(_express: express.Application): express.Application {
        /**
         *  Set Engine View
         */
        _express = _express.use('/static', express.static(path.join(__dirname, '../resources/views/static')))
        return _express;
    }

}

export default new Views;