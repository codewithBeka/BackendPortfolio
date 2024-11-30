import asyncHandler from 'express-async-handler';
import { cloudinaryUploadMedia, cloudinaryDeleteMedia } from '../utils/cloudinary.js';

export const uploadMedia = asyncHandler(async (req, res) => {
    const urls = [];
    const files = req.files || [req.file]; // Use req.file for single uploads

    console.log('Files:', files);

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    for (const file of files) {
        const fileName = `${file.fieldname}-${Date.now()}`; // Generate a unique file name

        if (!file.buffer || file.buffer.length === 0) {
            console.error(`File buffer is empty for file: ${file.originalname}`);
            return res.status(400).json({ message: 'File buffer is empty', file: file.originalname });
        }

        try {
            const uploadedMedia = await cloudinaryUploadMedia(file.buffer, fileName); // Upload to Cloudinary
            urls.push({ url: uploadedMedia.secure_url, type: uploadedMedia.resource_type, publicId: uploadedMedia.public_id }); // Store URL and type
            console.log("push urls", urls);
        } catch (error) {
            console.error(`Error uploading file:`, error);
            return res.status(500).json({ message: 'Failed to upload one or more files', error: error.message });
        }
    }

    console.log("urls:", urls);
    // Send the URLs back as a response to the client
    return res.status(200).json(urls);
});

export const deleteMedia = asyncHandler(async (req, res) => {
    const { public_id } = req.params;
    const { resource_type } = req.query; // Assuming resource type is passed in the query

    console.log('Deleting media with public ID:', public_id);
console.log('Resource type:', resource_type);
    if (!public_id) {
        return res.status(400).json({ message: 'Public ID is required' });
    }

    try {
        // Pass the correct resource type (default to image if not provided)
        const result = await cloudinaryDeleteMedia(public_id, resource_type || 'image');
        res.status(200).json({ message: 'Media deleted successfully', result });
    } catch (error) {
        console.error(`Error deleting media with public ID ${public_id}:`, error);
        res.status(500).json({ message: 'Failed to delete media', error: error.message });
    }
});
