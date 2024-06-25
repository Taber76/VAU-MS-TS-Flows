import common = require("oci-common");
import { OCI_CONFIG_FILE } from "./environment";

const provider: common.ConfigFileAuthenticationDetailsProvider = new
  common.ConfigFileAuthenticationDetailsProvider(OCI_CONFIG_FILE);

export default provider;


