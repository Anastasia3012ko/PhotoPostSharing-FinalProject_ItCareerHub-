import { S3Client, PutObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Image from "../models/Image.js";
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadSinglePhoto(file, userId, folder = "posts") {
  if (!file) return null;

  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const fileKey = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  const image = new Image({
    filename: fileKey,
    url,
    folder,
    user: userId,
  });
  await image.save();

  return  image;
}

export const deletePhotoFromS3 = async (key) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
  );
};


