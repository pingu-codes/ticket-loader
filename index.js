const puppeteer = require("puppeteer");

const app = require("./app");

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });

  page.on("load", async () => {
    await page.evaluate(() => {
      let toedit = document.querySelector("body > script:nth-child(20)");
      toedit.src =
        "https://d17ol771963kd3.cloudfront.net/assets/mobile-f03e7aeec1202939ac27322b55f56774.js";
    });
    await page.addScriptTag({
      content: `
  
          window.wasmbinsrc = "http://localhost/wasm/ticket.318d200.wasm";
    `
    });

    await page.addScriptTag({
      url: "http://localhost/scripts/ticket.js"
      //   url: "https://d17ol771963kd3.cloudfront.net/assets/ticket.318d200.js"
    });
  });

  await page.goto("https://www.supremenewyork.com/mobile");
}

main();
