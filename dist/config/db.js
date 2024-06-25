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
const oracledb_1 = __importDefault(require("oracledb"));
const environment_1 = require("./environment");
class OracleDB {
    constructor() {
        this.pool = null;
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!OracleDB.instance) {
                OracleDB.instance = new OracleDB();
                yield OracleDB.instance.connect();
            }
            return OracleDB.instance;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.pool = yield oracledb_1.default.createPool({
                    user: environment_1.DB_USER,
                    password: environment_1.DB_PASS,
                    connectionString: environment_1.DB_STRING,
                    poolMin: 1,
                    poolMax: 10,
                    poolIncrement: 1,
                    poolTimeout: 60
                });
                console.log('Connected to Oracle database');
            }
            catch (err) {
                console.error('Unable to connect to the database:', err);
            }
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                console.error('Connection pool has not been created.');
                return null;
            }
            try {
                const connection = yield this.pool.getConnection();
                return connection;
            }
            catch (err) {
                console.error('Unable to get connection from pool:', err);
                console.log('Attempting to reconnect to the database...');
                yield this.reconnect();
                return null;
            }
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.close();
            yield this.connect();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pool) {
                try {
                    yield this.pool.close(10);
                    console.log('Connection pool to Oracle database closed');
                }
                catch (err) {
                    console.error('Error closing the connection pool:', err);
                }
            }
        });
    }
}
exports.default = OracleDB;
