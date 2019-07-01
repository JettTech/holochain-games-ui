import { connect } from '@holochain/hc-web-client';
import { WS_PORT, INSTANCE_ID } from ("../contants");

const callHCApi = (zome, funcName, params) => {
  connect(WS_PORT).then(({callZome, close}) => {
      callZome(INSTANCE_ID, zome, funcName)(params)
  })
}

export default callHCApi;
