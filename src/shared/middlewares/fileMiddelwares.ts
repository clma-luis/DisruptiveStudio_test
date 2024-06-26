import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR_STATUS } from "../constants/statusHTTP";

export const validateExistFile = (req: Request, fieldName: string) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    throw new Error(`Field <${fieldName}> is required`);
  }
  req.body.fieldName = fieldName;
  return true;
};

export const validateFileExtension = (req: Request, nameField: string, validExtensions: string[]) => {
  const nameImage = req.files![`${nameField}`];

  if (!nameImage) {
    return true;
  }

  const nameSplited = (nameImage as any).name.split(".");
  const currentExtension = nameSplited[nameSplited.length - 1];

  if (!validExtensions.includes(currentExtension)) {
    throw new Error(`Extension <.${currentExtension}> is not allowed`);
  }

  return true;
};

export const uploadFileInCloudinary = async (req: Request, fieldName: string) => {
  if (req.body.notExecuteUploadFile || !fieldName) return;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    return;
  }

  try {
    const { tempFilePath } = req.files[`${fieldName}`] as any;

    if (!tempFilePath) throw new Error("No files were uploaded or fieldName not found");

    const file = await cloudinary.v2.uploader.upload(tempFilePath, { resource_type: "auto" });

    req.body[`${fieldName}Created`] = file.secure_url;
    return true;
  } catch (error) {
    throw new Error("We have problems uploading the image, ple try later");
  }
};

export const replaceImageInCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  const { fieldName, menu } = req.body;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "No files were uploaded or fieldName not found" });
  }

  try {
    const { tempFilePath } = req.files[fieldName] as any;
    const imageId = hadleGetImageId(menu.image);

    const image = await cloudinary.v2.uploader.upload(tempFilePath, { public_id: imageId });

    req.body.cloudUrl = image.secure_url;
    next();
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "We have problems uploading the image, ple try later" });
  }
};

export const removeImageFromCloud = async (req: Request, res: Response, next: NextFunction, url: string) => {
  try {
    if (url) {
      const imageId = hadleGetImageId(url);

      await cloudinary.v2.uploader.destroy(imageId);
    }
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "We have problems to delete the image from the cloud, ple try later" });
  }
};

const hadleGetImageId = (imageUrl: string) => {
  if (!imageUrl) return "";

  const splited = imageUrl.split("/");
  const cloudName = splited[splited.length - 1];
  const [imageId] = cloudName.split(".");

  return imageId;
};
