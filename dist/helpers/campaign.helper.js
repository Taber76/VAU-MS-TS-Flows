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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class CampaignHelper {
    static defaultNodesAndEdges() {
        return __awaiter(this, void 0, void 0, function* () {
            const node0_id = (0, uuid_1.v4)();
            const node1_id = (0, uuid_1.v4)();
            const nodes = [
                {
                    id: node0_id,
                    type: 'startUpdater',
                    position: { x: 0, y: 0 },
                    data: {
                        name: '',
                        ref: { nextNode: node1_id }
                    }
                },
                {
                    id: node1_id,
                    type: 'endUpdater',
                    position: { x: 300, y: 0 },
                    data: {
                        name: '',
                        ref: { prevNode: node0_id },
                        answer: {
                            type: 'buttonCta ',
                            data: {
                                id: node1_id,
                                text: 'Próximo video',
                                bgColor: '#000000',
                                textColor: '#ffffff',
                            }
                        },
                    }
                }
            ];
            const edges = [
                {
                    id: (0, uuid_1.v4)(),
                    source: node0_id,
                    target: node1_id,
                    type: 'buttonedge'
                },
            ];
            return { nodes, edges };
        });
    }
}
exports.default = CampaignHelper;
