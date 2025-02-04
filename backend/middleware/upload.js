const multer = require('multer');
const path = require('path');
const fs = require('fs');

//ensure uploads directory exists - this is debuggin for now, will delete later
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Upload destination:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log('Processing file:', file.originalname);
        //get original extension & convert to lowercase
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        //log file details - more debugging
        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            fieldname: file.fieldname,
            encoding: file.encoding
        });

        //convert filename to lowercase for checking
        const filename = file.originalname.toLowerCase();
        
        //check mimetype and extension - case insensitive
        if (file.mimetype.startsWith('image/') && 
            (filename.endsWith('.jpg') || 
             filename.endsWith('.jpeg') || 
             filename.endsWith('.png') || 
             filename.endsWith('.gif') || 
             filename.endsWith('.webp'))) {
            console.log('File accepted');
            cb(null, true);
        } else {
            console.log('File rejected');
            cb(new Error('File must be an image (JPG, JPEG, PNG, GIF, or WEBP)'), false);
        }
    }
});

module.exports = upload; 