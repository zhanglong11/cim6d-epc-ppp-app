const glob = require('glob-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
~(async function() {
  const list = await glob('components2/**/*.vue')

  for (let filePath of list) {
    const file = fs.readFileSync(filePath, { encoding: 'utf8' })
    const $ = cheerio.load(file, { decodeEntities: false, withDomLvl1: false, xmlMode: true })
    const style = $('style')
    const lang = style.attr('lang')
    if (lang === 'less') {
      const filename = path.basename(filePath, '.vue')
      const lessFilePath = path.dirname(filePath) + '/' + filename + '.less'
      const exists = await glob(lessFilePath)
      if (exists.length === 0) {
        fs.writeFileSync(lessFilePath, style.html())
      }
      style.html(`
      @import './${filename}.less';
      `)
      fs.writeFileSync(filePath, $.html())
    }
  }
})()
