import { API_BASE } from "../constants";

const endpoint = (name, data) => {
  const url = `${INSTANCE}/${zome}/${fnName}`
  return fetch(url, {
    method: 'post',
    body: (data),
  }).then(r => r.json())
}


document.querySelector('#submit').addEventListener('click',  e => {
    const content = document.querySelector('#text-box').value
    const timestamp = document.querySelector('#time-box').value
    endpoint('sampleEntryCreate', JSON.stringify({
        content,
        timestamp,
    })).then(hash => {
        endpoint('sampleEntryRead', hash).then(content => {
            console.log(content)
        })
    })
})
