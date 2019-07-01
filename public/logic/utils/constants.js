export const WS_PORT = "ws://localhost:3301";
export const INSTANCE_ID = "holochain-games";
// holochain-checkers-instance

//////////////////////
// old way:
//////////////////////
// import { WS_PORT } from "../constants";
//
// const endpoint = (name, data) => {
//   const url = `${INSTANCE}/${zome}/${fnName}`
//   return fetch(url, {
//     method: 'post',
//     body: (data),
//   }).then(r => r.json())
// }

// $('#submit').addEventListener('click',  e => {
//     const content = document.querySelector('#text-box').value
//     const timestamp = document.querySelector('#time-box').value
//     endpoint('sampleEntryCreate', JSON.stringify({
//         content,
//         timestamp,
//     })).then(hash => {
//         endpoint('sampleEntryRead', hash).then(content => {
//             console.log(content)
//         })
//     })
// })
