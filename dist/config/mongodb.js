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
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
class MongoDB {
    constructor() {
        if (!environment_1.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined.');
        }
        const options = {
            serverSelectionTimeoutMS: 9000,
        };
        this.connection = mongoose_1.default.createConnection(environment_1.MONGODB_URI, options);
        this.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        this.connection.on('error', (err) => {
            console.error('Error connecting to MongoDB:', err);
        });
        this.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
        });
    }
    static getInstance() {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }
    getConnection() {
        return this.connection;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
}
exports.default = MongoDB;
