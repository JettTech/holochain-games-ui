import { connect } from '@holochain/hc-web-client';
import { API_BASE } from "../constants";

connect(API_BASE).then(({callZome, close}) => {
    callZome('instanceId', 'zome', 'funcName')(params)
})
