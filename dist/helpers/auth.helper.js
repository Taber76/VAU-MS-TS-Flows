"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bucket_service_1 = __importDefault(require("../services/bucket.service"));
const environment_1 = require("../config/environment");
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthHelper {
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(environment_1.SALT_ROUNDS);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            return hashedPassword;
        });
    }
    static comparePasswords(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hashedPassword);
        });
    }
    static checkPasswordStrength(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    static checkEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static generateCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    static validateProfileImage(profile_image) {
        if (profile_image.mimetype !== 'image/jpeg' && profile_image.mimetype !== 'image/png')
            return false;
        if (profile_image.size > 1048576)
            return false;
        return true;
    }
    static uploadProfileImage(user_id, profile_image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.validateProfileImage(profile_image)) {
                    return {
                        success: false,
                        message: 'Invalid profile image. Must be jpeg or png and less than 1MB.'
                    };
                }
                const imageName = `${user_id}.profile_image.${profile_image.mimetype.split('/')[1]}`;
                yield bucket_service_1.default.uploadFileToBucket(imageName, profile_image);
                yield user_model_1.default.update({ id: user_id, profile_image: 1 });
                return {
                    success: true,
                    url: profile_image
                };
            }
            catch (error) {
                console.error('Error uploading profile image:', error);
                return {
                    success: false,
                    message: 'Internal server error uploading profile image.'
                };
            }
        });
    }
    static generateToken(user) {
        return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, user), { password: null }), environment_1.JWT_SECRET, { expiresIn: environment_1.JWT_EXPIRES_IN });
    }
    static decodeToken(token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, environment_1.JWT_SECRET);
            return decodedToken;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.default = AuthHelper;
