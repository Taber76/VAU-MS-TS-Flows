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
const uuid_1 = require("uuid");
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const email_helper_1 = __importDefault(require("../helpers/email.helper"));
class AuthService {
    // REGISTER USER -------------------------------------------------------------
    static registerUser(user, profile_image) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check required fields
            if (!user.name || !user.surname || !user.email || !user.password) {
                return { success: false, message: 'Missing required fields.' };
            }
            if (!auth_helper_1.default.checkPasswordStrength(user.password)) {
                return { success: false, message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.' };
            }
            if (!auth_helper_1.default.checkEmail(user.email)) {
                return { success: false, message: 'Invalid email address.' };
            }
            try {
                // Check if user already exists
                if (!user.username) {
                    user.username = user.email.split('@')[0];
                }
                const userEmailExists = yield user_model_1.default.findByEmail(user.email);
                const userUsernameExists = yield user_model_1.default.findByUsername((user.username).toLowerCase());
                if (userEmailExists || userUsernameExists) {
                    return { success: false, message: 'User already exists. Must choose a different email or username.' };
                }
                // Create user
                user.id = (0, uuid_1.v4)();
                user.password = yield auth_helper_1.default.hashPassword(user.password);
                const createdUser = yield user_model_1.default.create(Object.assign(Object.assign({}, user), { username: (user.username).toLowerCase() }));
                // Upload profile image
                if (profile_image && createdUser) {
                    const result = yield auth_helper_1.default.uploadProfileImage(createdUser.id, profile_image);
                    if (!result.success)
                        console.error('Error uploading profile image:', result.message);
                }
                // Send email verification
                const code = auth_helper_1.default.generateCode();
                const response = yield email_helper_1.default.sendVerificationEmail(user.email, code);
                if (!response.success)
                    console.error('Error sending verification email:', response.message);
                return { success: true, message: 'User created successfully.', user: createdUser };
            }
            catch (error) {
                console.error('Error creating user:', error);
                return { success: false, message: `Internal server error creating user. Error: ${error}` };
            }
        });
    }
    // LOGIN USER ----------------------------------------------------------------
    static loginUser(email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (email) {
                    user = yield user_model_1.default.findByEmail(email);
                }
                else {
                    user = yield user_model_1.default.findByUsername(username.toLowerCase());
                }
                if (!user || !auth_helper_1.default.comparePasswords(password, user.password)) {
                    return { success: false, message: 'User not found or password incorrect.' };
                }
                const token = auth_helper_1.default.generateToken(user);
                return {
                    success: true,
                    message: 'User logged in successfully.',
                    user: Object.assign(Object.assign({}, user), { password: null }),
                    token
                };
            }
            catch (error) {
                console.error('Error logging in user:', error);
                return { success: false, message: `Internal server error logging user. Error: ${error}` };
            }
        });
    }
    // REFRESH TOKEN ------------------------------------------------------------
    static refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = auth_helper_1.default.decodeToken(token);
                if (!user) {
                    return { success: false, message: 'Invalid token.' };
                }
                const dbUser = yield user_model_1.default.findByEmail(user.email);
                ;
                if (!dbUser)
                    return { success: false, message: 'User not found.' };
                const newToken = auth_helper_1.default.generateToken(dbUser);
                return {
                    success: true,
                    message: 'Token refreshed successfully.',
                    token: newToken
                };
            }
            catch (error) {
                console.error('Error refreshing token:', error);
                return { success: false, message: `Internal server error refreshing token. Error: ${error}` };
            }
        });
    }
}
exports.default = AuthService;
