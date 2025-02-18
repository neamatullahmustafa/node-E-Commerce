import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("Only images (jpg, jpeg, png) are allowed"), false);
  }
};

const uploadSingle = (fieldName) => {
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
  }).single(fieldName);
};

const uploadMultiple = (fieldName) => {
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
  }).array(fieldName, 5);
};
export { uploadSingle, uploadMultiple };
