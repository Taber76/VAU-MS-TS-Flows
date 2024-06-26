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
class CampaignModel {
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
        if (!CampaignModel.instance) {
            CampaignModel.instance = new CampaignModel();
        }
        return CampaignModel.instance;
    }
    // MAP ROW TO OBJECT --------------------------------------------------------
    mapRowToCampaign(oracleResponse) {
        return {
            id: oracleResponse[0],
            title: oracleResponse[1],
            description: oracleResponse[2],
            active: oracleResponse[3],
            user_id: oracleResponse[4],
            nodes: JSON.parse(oracleResponse[5]),
            edges: JSON.parse(oracleResponse[6]),
            cover_video: oracleResponse[7],
            cover_image: oracleResponse[8],
            created_at: oracleResponse[9],
            updated_at: oracleResponse[10],
        };
    }
    // MAP ROW PARTIAL TO OBJECT (for get by user_id)---------------------------
    mapRowPartialToCampaign(oracleResponse) {
        return {
            id: oracleResponse[0],
            title: oracleResponse[1],
            description: oracleResponse[2],
            active: oracleResponse[3],
            cover_video: oracleResponse[4],
            cover_image: oracleResponse[5],
            created_at: oracleResponse[6],
            updated_at: oracleResponse[7],
        };
    }
    // CREATE -------------------------------------------------------------------
    create(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.ensureConnection();
            const createCampaign = `
      INSERT INTO campaigns (
        id, title, description, user_id, nodes, edges
      )
      VALUES (
        :id, :title, :description, :user_id, :nodes, :edges
      )
    `;
            try {
                yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(createCampaign, {
                    id: campaign.id,
                    title: campaign.title,
                    description: campaign.description,
                    user_id: campaign.user_id,
                    nodes: JSON.stringify(campaign.nodes),
                    edges: JSON.stringify(campaign.edges),
                }));
                yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.commit());
                console.log('Campaign created successfully.');
                return campaign;
            }
            catch (error) {
                console.error('Error inserting record:', error);
                if (this.connection) {
                    yield this.connection.rollback();
                }
                throw error;
            }
        });
    }
    // FIND BY USER_ID -----------------------------------------------------------
    findByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.ensureConnection();
            const query = 'SELECT id, title, description, active, cover_video, cover_image, created_at, updated_at FROM campaigns WHERE user_id = :user_id';
            try {
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(query, { user_id }));
                if (result && result.rows && result.rows.length > 0)
                    return result.rows.map((row) => this.mapRowPartialToCampaign(row));
                return null;
            }
            catch (error) {
                console.error('Error executing query:', error);
                throw error;
            }
        });
    }
    // FIND BY ID -----------------------------------------------------------
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.ensureConnection();
            const query = 'SELECT * FROM campaigns WHERE id = :id';
            try {
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(query, { id }));
                if (result && result.rows && result.rows.length > 0)
                    return this.mapRowToCampaign(result.rows[0]);
                return null;
            }
            catch (error) {
                console.error('Error executing query:', error);
                throw error;
            }
        });
    }
    // UPDATE -------------------------------------------------------------------
    update(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.ensureConnection();
            const fields = [];
            const params = {};
            if (campaign.title) {
                fields.push('title = :title');
                params.name = campaign.title;
            }
            if (campaign.description) {
                fields.push('description = :description');
                params.description = campaign.description;
            }
            if (campaign.active) {
                fields.push('active = :active');
                params.active = campaign.active;
            }
            if (campaign.nodes) {
                fields.push('nodes = :nodes');
                params.nodes = JSON.stringify(campaign.nodes);
            }
            if (campaign.edges) {
                fields.push('edges = :edges');
                params.edges = JSON.stringify(campaign.edges);
            }
            if (campaign.cover_video) {
                fields.push('cover_video = :cover_video');
                params.cover_video = campaign.cover_video;
            }
            if (campaign.cover_image) {
                fields.push('cover_image = :cover_image');
                params.cover_image = campaign.cover_image;
            }
            //fields.push('updated_at = CURRENT_TIMESTAMP');
            const updateCampaign = `
      UPDATE campaigns
      SET ${fields.join(', ')}
      WHERE id = :id AND user_id = :user_id`;
            params.id = campaign.id;
            params.user_id = campaign.user_id;
            try {
                const result = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.execute(updateCampaign, params));
                yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.commit());
                if (result && result.rows && result.rows.length > 0) {
                    return this.mapRowToCampaign(result.rows[0]);
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
exports.default = CampaignModel.getInstance();
