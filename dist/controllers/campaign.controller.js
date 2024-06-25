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
const campaign_service_1 = __importDefault(require("../services/campaign.service"));
class CampaignController {
    static newCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield campaign_service_1.default.newCampaign(Object.assign(Object.assign({}, req.body), { user_id: req.user }));
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
    static getCampaignById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield campaign_service_1.default.getCampaignById(req.params.id);
                if (serviceResponse.success === false) {
                    res.status(400).json(serviceResponse);
                    return;
                }
                res.status(200).json(serviceResponse);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
    static getCampaignsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceResponse = yield campaign_service_1.default.getCampaignsByUserId(req.user);
                if (serviceResponse.success === false) {
                    res.status(400).json(serviceResponse);
                    return;
                }
                res.status(200).json(serviceResponse);
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
}
exports.default = CampaignController;
