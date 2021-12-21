import multer from "multer";

const Multer = multer({
    dest: 'upload'
})

export default Multer;