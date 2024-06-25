"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("oci-common");
const environment_1 = require("./environment");
const provider = new common.ConfigFileAuthenticationDetailsProvider(environment_1.OCI_CONFIG_FILE);
exports.default = provider;
