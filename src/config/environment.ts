import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10

export const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'VAU'
export const DB_USER = process.env.DB_USER ? process.env.DB_USER : 'VAU'
export const DB_PASS = process.env.DB_PASS
export const DB_STRING = process.env.DB_STRING

export const OCI_USER = process.env.OCI_USER
export const OCI_FINGERPRINT = process.env.OCI_FINGERPRINT
export const OCI_TENANCY = process.env.OCI_TENANCY
export const OCI_REGION = process.env.OCI_REGION
export const OCI_KEY_FILE = process.env.OCI_KEY_FILE

export const OCI_NAMESPACE = process.env.OCI_NAMESPACE ? process.env.OCI_NAMESPACE : 'VAU'
export const OCI_COMPARTMENT = process.env.OCI_COMPARTMENT ? process.env.OCI_COMPARTMENT : 'VAU'
export const OCI_BUCKET = process.env.OCI_BUCKET ? process.env.OCI_BUCKET : 'VAU'
export const OCI_CONFIG_FILE = process.env.OCI_CONFIG_FILE
export const OCI_BUCKET_OBJECT_URL = process.env.OCI_BUCKET_OBJECT_URL

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

export const API_VERSION = process.env.API_VERSION
export const CORS_ORIGIN = process.env.CORS_ORIGIN
export const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'VAU'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
