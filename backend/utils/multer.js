import multer from "multer";
import DatauriParser from "datauri/parser.js";

const storage = multer.memoryStorage();

export const multerUploads = multer({ storage }).array("image", 3);

const parser = new DatauriParser();

export const dataUri = (req) => {
  const encodedFiles = [];
  req.files.forEach((cur) => {
    let base64 = new Buffer.from(cur.buffer, "base64").toString("base64");
    let base64CloudinaryFormat = `data:image/jpeg;base64,${base64}`;
    encodedFiles.push({
      data: base64CloudinaryFormat,
      filename: cur.originalname,
    });
  });
  return encodedFiles;
};

export const multerMultipleUploads = multer({ storage }).array("image", 3);

export const base64Converter = (req) => {
  const encodedFiles = [];
  req.files.forEach((cur) => {
    let base64 = new Buffer.from(cur.buffer, "base64").toString("base64");
    let base64CloudinaryFormat = `data:image/jpeg;base64,${base64}`;
    encodedFiles.push({
      data: base64CloudinaryFormat,
      filename: cur.originalname,
    });
  });
  return encodedFiles;
};
