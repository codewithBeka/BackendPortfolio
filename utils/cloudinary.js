import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

// Load environment variables
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

// Function to upload media using buffer
export const cloudinaryUploadMedia = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: fileName, timeout: 60000 }, // 60 seconds timeout
            (error, result) => {
                if (error) {
                    return reject(new Error(`Upload failed: ${error.message}`));
                }
                resolve(result); // Return the Cloudinary response (secure_url, public_id, resource_type)
            }
        );

        // Create a readable stream from the buffer and pipe it to Cloudinary
        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); // Signal end of stream
        readableStream.pipe(stream);
    });
};

// Function to delete media
export const cloudinaryDeleteMedia = async (filePublicId, resourceType = 'image') => {
    try {
        // Ensure public_id is provided
        if (!filePublicId) {
            throw new Error("Public ID is required for deletion.");
        }

        // Call Cloudinary's destroy method with the correct resource type
        const result = await cloudinary.uploader.destroy(filePublicId, { resource_type: resourceType });

        // Check if the deletion was successful
        if (result.result !== 'ok') {
            throw new Error(`Deletion failed. Response: ${result.result}`);
        }

        return result;
    } catch (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }
};
