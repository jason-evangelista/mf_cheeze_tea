import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? '';
const apiKey = process.env.CLOUDINARY_KEY ?? '';
const apiSecret = process.env.CLOUDINARY_SECRET ?? '';
const imageUploadFolder = process.env.CLOUDINARY_CLOUD_FOLDER ?? '';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const handleImageUpload = async (file: string) => {
  if (!file) return {};
  const result = await cloudinary.uploader.upload(file, {
    folder: imageUploadFolder,
    resource_type: 'image',
    unique_filename: true,
  });
  return {
    url: result.secure_url,
    asset_id: result.public_id,
  };
};

export const handleUpdateImageUpload = async (params: {
  file: string;
  assetId?: string;
}) => {
  if (!params.file) {
    console.log('DELETE ME IMAGE');
    await cloudinary.api.delete_resources([params.assetId ?? ''], {
      type: 'upload',
      resource_type: 'image',
    });
    return {
      url: null,
      asset_id: null,
    };
  }

  if (params.file.includes('https://res.cloudinary.com'))
    return {
      url: params.file,
      asset_id: params.assetId,
    };

  const result = await cloudinary.uploader.upload(params.file, {
    folder: imageUploadFolder,
    resource_type: 'image',
    unique_filename: true,
  });
  return {
    url: result.secure_url,
    asset_id: result.public_id,
  };
};

export const handleDeleteImageUpload = async (assetId: string) => {
  await cloudinary.api.delete_resources([assetId], {
    type: 'upload',
    resource_type: 'image',
  });
};

export default cloudinary;
