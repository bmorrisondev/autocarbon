const axios = require('axios');
const jsdom = require('jsdom')
const Prism = require('prismjs')
const htmlToImage = require('html-to-image');
const loadLanguages = require('prismjs/components/index.js');

loadLanguages()

const gistid = "0f76b24844f2ad368c6da0851d2ea506";
const githubGistApiBase = "https://api.github.com/gists";

(async() => {
  let response = await axios.get(`${githubGistApiBase}/${gistid}`)

  let files = Object.keys(response.data.files).map((key) => {
    return response.data.files[key]
  })
  
  // let rawResponse = await axios.get(response.data.files[0].raw_url)
  // console.log(rawResponse.data)
  const highlightCode = async function(content) {
    return new Promise(resolve => {
      const dom = new jsdom.JSDOM(content);
      dom.window.document.querySelectorAll("code").forEach(c => {
        const code = c.textContent;
        const name = c.className
          .replace("language-", "")
          .replace("lang-", "");
        if(name) {
          const processed = Prism.highlight(code, Prism.languages[name], name);
          c.innerHTML = processed;
          c.parentNode.className = `${c.parentNode.className} language-${name}`
        }
      });
      resolve(dom.window.document.body.innerHTML);
    })
  }

  let lang = "javascript"

  let div = `
    <div id="code">
      <pre class="lang-${lang}">
        <code>
          ${files[0].content}
        </code>
      </pre>
    </div>
  `

  let htmlDiv = await highlightCode(div)
  var dataUrl = await htmlToImage.toPng(htmlDiv)
  download(dataUrl, 'my-node.png');
})()