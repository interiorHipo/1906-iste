const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../..');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if(url.pathname === '/__qa/submit') {let text='';req.on('data',x=>text+=x);req.on('end',()=>{res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({success:true}));});return;}
  if(url.pathname.startsWith('/__qa/image/')) {
    if(url.pathname.endsWith('missing.svg')) {res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':'image/svg+xml'});res.end('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#ddd6c6"/><text x="100" y="450" font-size="50">TEST FIXTURE ONLY '+url.pathname.split('/').pop()+'</text></svg>');return;
  }
  let pathname = decodeURIComponent(url.pathname);
  const mock = pathname.startsWith('/__qa/');
  if(mock) pathname = pathname.slice('/__qa'.length);
  pathname = pathname.replace(/^\/1906-iste/, '');
  if(pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
  try {
    let content = fs.readFileSync(file);
    if(mock && pathname.endsWith('/data.js')) content = content.toString()+`\nwindow.SSANGYONG_DATA.types.forEach(t=>t.images=[1,2].map(n=>({src:'/__qa/image/'+t.id+'-'+n+'.svg',width:1200,height:900,alt:'테스트 전용 이미지 '+n})));Object.assign(window.SSANGYONG_DATA.contact,{accessKey:'mock-only',recipientVerified:true,privacyApproved:true,retention:'테스트 환경 안내',endpoint:'/__qa/submit'});`;
    if(path.extname(file)==='.html') content=content.toString().replace(/<script async src="https:\/\/www\.googletagmanager\.com[^\"]*"><\/script>/g,'<!-- GA network disabled by local QA server -->');
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(content);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(8136,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8136/1906-iste/ssangyong-sky/\nQA: http://127.0.0.1:8136/1906-iste/ssangyong-sky/tests/runner.html'));
