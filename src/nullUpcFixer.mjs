/**
 * 更新UPC的脚本
 * https://archelper.digestly.cc/api/products/spus/upc
 * 
 * run outside of the project
*/

import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as cheerio from 'cheerio';

const url = "https://arcteryx.com/us/en/shop/X000008468"
// const url = "https://arcteryx.com/us/en/shop/mens/beta-sl-jacket-9685"

const proxyAgent = new HttpsProxyAgent('http://localhost:7897');

const res = await fetch(url, {
  agent: proxyAgent,
})

const html = await res.text()

const $ = cheerio.load(html)

const data = $("#__NEXT_DATA__").text()

const json = JSON.parse(data)

const product = JSON.parse(json.props.pageProps.product)

console.log(product)


const POST_URL = "https://archelper.digestly.cc/api/products/spus/upc"

const res2 = await fetch(POST_URL, {
  method: "POST",
  body: JSON.stringify(product),
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "UPDATE_UPC_API_KEY"
  },
})

console.log(await res2.text())
