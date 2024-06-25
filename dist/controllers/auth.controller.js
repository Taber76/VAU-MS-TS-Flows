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
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield auth_service_1.default.registerUser(req.body, req.file);
                if (serviceResponse.success === false) {
                    res.status(400).json(serviceResponse);
                    return;
                }
                res.status(201).json(serviceResponse);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield auth_service_1.default.loginUser(req.body.email, req.body.username, req.body.password);
                if (serviceResponse.success === false) {
                    res.status(400).json(serviceResponse);
                    return;
                }
                res
                    .setHeader('Set-Cookie', `accessToken=${serviceResponse.token}; Path=/; SameSite=None; HttpOnly; Expires=${new Date().setDate(new Date().getDate() + 1)}`)
                    .status(200).json(serviceResponse);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield auth_service_1.default.refreshToken(req.body.token);
                if (serviceResponse.success === false) {
                    res.status(400).json(serviceResponse);
                    return;
                }
                res
                    .setHeader('Set-Cookie', `accessToken=${serviceResponse.token}; Path=/; SameSite=None; HttpOnly; Expires=${new Date().setDate(new Date().getDate() + 1)}`)
                    .status(200).json(serviceResponse);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
}
exports.default = AuthController;
