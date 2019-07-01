import { connect } from './hc-web-client.min.js';
import { WS_PORT, INSTANCE_ID } from "./contants.js";

const callHCApi = (zome, funcName, params) => {
  connect(WS_PORT).then(({callZome, close}) => {
      callZome(INSTANCE_ID, zome, funcName)(params)
  })
}

export default callHCApi;
