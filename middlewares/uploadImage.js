import multer from 'multer';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

// Set up multer with memory storage
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

export const uploadPhoto = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 5000000 } // Limit to 5MB
});

// Function to upload media directly to Cloudinary
export const cloudinaryUploadMedia = (fileBuffer, fileName) => {
    if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('Empty file uploaded');
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: fileName },
            (error, result) => {
                if (error) {
                    return reject(new Error(`Upload failed: ${error.message}`));
                }
                resolve(result);
            }
        );

        // Create a readable stream from the buffer
        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); // Signal the end of the stream
        readableStream.pipe(stream); // Pipe the readable stream to Cloudinary
    });
};

