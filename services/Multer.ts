import multer from "multer";

const Multer = multer({
    dest: 'upload'
})

const uploadFile = Multer.single('file');
const uploadMultiFiles = Multer.array('files')

export default Multer;

export {
    uploadFile,
    uploadMultiFiles,
}