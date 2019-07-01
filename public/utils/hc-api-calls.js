import { WS_PORT, INSTANCE_ID } from "./contants.js";

const callHCApi = (zome, funcName, params) => {
  holochainclient.connect(WS_PORT).then(({callZome, close}) => {
      callZome(INSTANCE_ID, zome, funcName)(params)
  })
}

export default callHCApi;
