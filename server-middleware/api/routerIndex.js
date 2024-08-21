const express = require('express');
const router = express.Router();

const axios = require('axios');
const puppeteer = require('puppeteer');

router.post('/scraping', async (req, res, next) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    //let url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=Julia";
    let url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=" + req.body.name; //後半が本の名前
    console.log(url)
    await page.goto(url, {
        waitUntil: "networkidle0",
    });

    let resultArray = await page.evaluate(() => {
        const datalist = [];
        const result = document.getElementById('resultCards');
        const resultlist = result.children;
        Array.from(resultlist).forEach((book) => {
            //let eachBook = book.getElementsByClassName('c_searchCard_topWrap')[0];
            let elements = book.getElementsByClassName('informationArea')[0].children;
            let url = "";
            let bookName = ""
            let author = "";
            let publisher = "";
            let position = ""
            let existing = "";
            Array.from(elements).forEach((element, index) => {
                if (index == 0) {
                    let name = element.getElementsByTagName('a')[0]
                    url = name.getAttribute('href');
                    bookName = name.innerText;
                }
                else {
                    let dTags = element.children;
                    let dtName = dTags[0].innerText;
                    if (dtName.includes("著者名")) {
                        author = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("出版")) {
                        publisher = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("所蔵")) {
                        position = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("状況")) {
                        existing = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                }
            });
            datalist.push({ url: url, name: bookName, author: author, publisher: publisher, position: position, existing: existing })
        });
        return datalist;
    });
    console.log(resultArray);
    res.status(200).json(resultArray);
    await browser.close();
})

module.exports = router