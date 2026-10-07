function n(e){if(!e)return"";let r=e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;|&apos;/g,"'").replace(/&nbsp;|&#160;|&#x0*a0;/gi," ");return r=r.replace(/<\s*br\s*\/?\s*>/gi,`
`),r=r.replace(/<[^>]+>/g,""),r=r.replace(/[ \t]+\n/g,`
`).replace(/\n[ \t]+/g,`
`),r=r.replace(/\n{3,}/g,`

`),r=r.replace(/[ \t]{2,}/g," "),r.trim()}function t(e){if(e==null||e==="")return"";const r=Number(e);return Number.isFinite(r)&&String(e).trim()!==""?String(Math.trunc(r)):String(e)}export{t as a,n};
