const axios = require('axios');

const gistid = "0f76b24844f2ad368c6da0851d2ea506";
const githubGistApiBase = "https://api.github.com/gists";

(async() => {
  let response = await axios.get(`${githubGistApiBase}/${gistid}`)
  console.log(response.data)
})()