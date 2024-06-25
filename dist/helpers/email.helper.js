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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const email_templates_1 = __importDefault(require("../templates/email.templates"));
const environment_1 = require("../config/environment");
mail_1.default.setApiKey(environment_1.SENDGRID_API_KEY);
class EmailHelper {
    static sendVerificationEmail(email, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = {
                    to: email,
                    from: 'sync.ideas.group@gmail.com',
                    subject: '¡Welcome to VAU!',
                    html: email_templates_1.default.verifyEmail(key)
                };
                yield mail_1.default.send(msg);
                return {
                    success: true,
                    message: 'Email sent.'
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error sending verification email: ' + error,
                };
            }
        });
    }
    static sendChangedEmail(email, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = {
                    to: email,
                    from: 'sync.ideas.group@gmail.com',
                    subject: '¡Your email has been changed!',
                    html: email_templates_1.default.verifyEmail(key)
                };
                yield mail_1.default.send(msg);
                return {
                    success: true
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
    static sendResetPasswordEmail(email, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = {
                    to: email,
                    from: 'sync.ideas.group@gmail.com',
                    subject: '¡Reset your password!',
                    html: email_templates_1.default.resetPassword(key)
                };
                yield mail_1.default.send(msg);
                return {
                    success: true
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
}
exports.default = EmailHelper;
