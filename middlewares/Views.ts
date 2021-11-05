import e, * as express from "express";
import * as path from 'path'

class Views {

    /**
     *  Mount Engine View
     */
    public mount(_express: express.Application): express.Application {
        _express = _express.use('/static', express.static(path.join(__dirname, '../resources/views/static')))
        return _express;
    }

}

export default new Views;