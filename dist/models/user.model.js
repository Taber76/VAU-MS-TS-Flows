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
const db_1 = __importDefault(require("../config/db"));
class UserModel {
    constructor() {
        this.connection = null;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield db_1.default.getInstance();
            this.connection = yield db.getConnection();
        });
    }
    ensureConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connection) {
                yield this.init();
            }
            else {
                try {
                    yield this.connection.ping();
                }
                catch (err) {
                    if (err.message.includes('NJS-500') || err.message.includes('NJS-521')) {
                        console.error('Connection lost, attempting to reconnect...');
                        yield this.init();
                    }
                    else {
                        throw err;
                    }
                }
            }
        });
    }
    static getInstance() {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }
    // MAP ROW TO OBJECT --------------------------------------------------------
    mapRowToUser(oracleResponse) {
        return {
            id: oracleResponse[0],
            name: oracleResponse[1],
            surname: oracleResponse[2],
            username: oracleResponse[3],
            email: oracleResponse[4],
            password: oracleResponse[5],
            profile_image: oracleResponse[6],
            phone: oracleResponse[7],
            google_registred: oracleResponse[8],
            credit: oracleResponse[9],
            subscription_type: oracleResponse[10],
            role: oracleResponse[11],
            is_active: oracleResponse[12],
            created_at: oracleResponse[13],
            updated_at: oracleResponse[14],
        };
    }
    // CREATE -------------------------------------------------------------------
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.ensureConnection();
            const createUser = `
      INSERT INTO users (
        id, name, surname, username, email, password, 
        profile_image, phone, google_registred, credit, 
        subscription_type, role, is_active
      )
      VALUES (
        :id, :name, :surname, :username, :email, :password, 
        :profile_image, :phone, :google_registred, :credit, 
        :subscription_type, :role, :is_active
      )
    `;
            try {
                yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(createUser, {
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    profile_image: user.profile_image,
                    phone: user.phone,
                    google_registred: user.google_registred,
                    credit: user.credit,
                    subscription_type: user.subscription_type,
                    role: user.role,
                    is_active: user.is_active
                }));
                yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.commit());
                console.log('User created successfully.');
                return Object.assign(Object.assign({}, user), { password: null });
            }
            catch (error) {
                console.error('Error inserting record:', error);
                if (this.connection) {
                    yield this.connection.rollback();
                }
            }
        });
    }
    // FIND BY EMAIL -----------------------------------------------------------
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield this.ensureConnection();
                const query = 'SELECT * FROM users WHERE email = :email';
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(query, { email }));
                if (result && result.rows && result.rows.length > 0) {
                    return this.mapRowToUser(result.rows[0]);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error executing query', error);
                throw error;
            }
        });
    }
    // FIND BY USERNAME --------------------------------------------------------
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield this.ensureConnection();
                const query = 'SELECT * FROM users WHERE username = :username';
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(query, { username }));
                if (result && result.rows && result.rows.length > 0) {
                    return this.mapRowToUser(result.rows[0]);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error executing query', error);
                throw error;
            }
        });
    }
    // UPDATE -------------------------------------------------------------------
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.ensureConnection();
            const fields = [];
            const params = {};
            if (user.name) {
                fields.push('name = :name');
                params.name = user.name;
            }
            if (user.surname) {
                fields.push('surname = :surname');
                params.surname = user.surname;
            }
            if (user.username) {
                fields.push('username = :username');
                params.username = user.username;
            }
            if (user.email) {
                fields.push('email = :email');
                params.email = user.email;
            }
            if (user.password) {
                fields.push('password = :password');
                params.password = user.password;
            }
            if (user.profile_image) {
                fields.push('profile_image = :profile_image');
                params.profile_image = user.profile_image;
            }
            if (user.phone) {
                fields.push('phone = :phone');
                params.phone = user.phone;
            }
            if (user.google_registred) {
                fields.push('google_registred = :google_registred');
                params.google_registred = user.google_registred;
            }
            if (user.credit) {
                fields.push('credit = :credit');
                params.credit = user.credit;
            }
            if (user.subscription_type) {
                fields.push('subscription_type = :subscription_type');
                params.subscription_type = user.subscription_type;
            }
            if (user.role) {
                fields.push('role = :role');
                params.role = user.role;
            }
            if (user.is_active) {
                fields.push('is_active = :is_active');
                params.is_active = user.is_active;
            }
            //fields.push('updated_at = CURRENT_TIMESTAMP');
            const updateUser = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = :id`;
            params.id = user.id;
            try {
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(updateUser, params));
                yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.commit());
                if (result && result.rows && result.rows.length > 0) {
                    return this.mapRowToUser(result.rows[0]);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error updating record:', error);
                if (this.connection) {
                    yield this.connection.rollback();
                }
                throw error;
            }
        });
    }
    // CLOSE CONNECTION --------------------------------------------------------
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                try {
                    yield this.connection.close();
                    console.log('Connection closed.');
                }
                catch (error) {
                    console.error('Error closing connection:', error);
                    throw error;
                }
            }
        });
    }
}
exports.default = UserModel.getInstance();
