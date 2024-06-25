"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const upload = (0, multer_1.default)();
// API /api/v1/auth
exports.default = express_1.default
    .Router()
    .post("/register", upload.single("profile_image"), auth_controller_1.default.register)
    .post("/login", auth_controller_1.default.login)
    .post("/refresh-token", auth_controller_1.default.refreshToken);
