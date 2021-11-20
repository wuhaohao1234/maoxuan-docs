const puppeteer = require('puppeteer');
const fs = require('fs')
const data = require('../data')

const downloadMd = async (browser, url, index) => {
  let str = ''
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('#article-title')
  const title = await page.$eval('#article-title', item => item.innerText)
  str += '# ' + title
  const texts = await page.$$eval('ne-text', items => items.map(item => item.innerText))
  texts.forEach(text => {
    str += text + '\n'
  })
  fs.writeFileSync(`./docs/${index} - ${title}.md`, str)
  console.log(title + '已经爬取');
  await browser.close();
}

const down = async (i) => {
  await puppeteer.launch().then(async browser => {
    await downloadMd(browser, 'https://www.yuque.com' + data[i], i)
  })
}
const start = async () => {
  for (let i = 0; i < data.length; i++) {
    await down([i])
  }
}
start()