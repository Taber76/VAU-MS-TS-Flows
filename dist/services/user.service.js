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
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_helper_1 = __importDefault(require("../helpers/auth.helper"));
const email_helper_1 = __importDefault(require("../helpers/email.helper"));
class UserService {
    static update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!user.id)
                    return { success: false, message: 'Missing user id.' };
                if (user.email) {
                    const userEmailExists = yield user_model_1.default.findByEmail(user.email);
                    if ((userEmailExists === null || userEmailExists === void 0 ? void 0 : userEmailExists.id) !== user.id)
                        return { success: false, message: 'Email already exists. Must choose a different email.' };
                }
                if (user.username) {
                    const userUsernameExists = yield user_model_1.default.findByUsername((user.username).toLowerCase());
                    if ((userUsernameExists === null || userUsernameExists === void 0 ? void 0 : userUsernameExists.id) !== user.id)
                        return { success: false, message: 'Username already exists. Must choose a different username.' };
                }
                if (user.password) {
                    if (!auth_helper_1.default.checkPasswordStrength(user.password)) {
                        return { success: false, message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.' };
                    }
                    user.password = yield auth_helper_1.default.hashPassword(user.password);
                }
                const serviceResponse = yield user_model_1.default.update(user);
                if (serviceResponse && user.email) {
                    const code = auth_helper_1.default.generateCode();
                    const response = yield email_helper_1.default.sendChangedEmail(user.email, code);
                    if (!response.success)
                        console.error('Error sending verification email.');
                }
                return {
                    success: true,
                    message: 'User updated successfully.',
                    user: serviceResponse
                };
            }
            catch (error) {
                console.error('Error updating user:', error);
                return {
                    success: false,
                    message: `Internal server error updating user. Error: ${error}`
                };
            }
        });
    }
}
exports.default = UserService;
