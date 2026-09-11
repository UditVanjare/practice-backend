import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage : storage 
})

export const handleMulterError = (error, req, res, next) => {
  if (!(error instanceof multer.MulterError)) {
    return next(error)
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: `Unexpected file field "${error.field}". Use "avatar" or "coverImage".`,
    })
  }

  return res.status(400).json({
    success: false,
    message: error.message,
  })
}
