import "dotenv/config"

export const ENV_CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT!!,
    DB_URI: process.env.DB_URI!!,


    //! cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!!,

    //! JWT
    JWT_SECRET: process.env.JWT_SECRET!!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!!,

    //! cookies
    COOKIE_EXPIRY: process.env.COOKIE_EXPIRY ?? 7,

    //! smtp
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT) ?? 587,
    SMPT_SERVICE: process.env.SMPT_SERVICE,
    SMPT_USER:  process.env.SMPT_USER,
    SMPT_PASS: process.env.SMPT_PASS,
    SMPT_MAIL_FROM: process.env.SMPT_MAIL_FROM,
};

