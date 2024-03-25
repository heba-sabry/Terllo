import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = fileURLToPath(import.meta.url);

export const fileValidation = {
  Image: ["image/gif", "image/jpeg"],
  file: ["application/pdf", "application/msword"],
};
export function fileUpload(customPath = "general", customValidation = []) {
  //   console.log(path.join(__dirname, `.././my-uploads ${customPath}`));
  const fullPath = path.join(__dirname, `../../my-uploads/ ${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      //     cb(null, file.fieldname + "-" + uniqueSuffix);
      const fullFileName = nanoid() + "_" + file.originalname;
      file.fileDest = `my-uploads/${customPath}/${fullFileName}`;
      cb(null, fullFileName);
    },
  });
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("in-valid format"), false);
    }
  }
  const upload = multer({ fileFilter, storage: storage });
  return upload;
}
