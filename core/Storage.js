import multer from "multer";
import { nanoid } from "nanoid";

const createStorage = (destinationFolder = "/") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      cb(null, nanoid() + "-" + file.originalname);
    },
  });

  return multer({ storage });
};

export default createStorage;
