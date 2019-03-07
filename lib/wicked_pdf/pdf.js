"use strict";
 const puppeteer = require(`${process.argv[2]}/puppeteer`);
 const createPdf = async options => {
  let browser;
  try {
    let launchOptions = {
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    };
    // if (process.argv[3] !== process.argv[process.argv.length - 2]) {
    //   launchOptions.executablePath = process.argv[3];
    // }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(options.input, { waitUntil: "networkidle2" });
    delete options.input;
    await page.pdf(options);
  } catch (err) {
    console.log(err.message);
  } finally {
    if (browser) {
      browser.close();
    }
    process.exit();
  }
};
 const parseCmd = () => {
  let options = {
    margin: {
      top: "0mm",
      bottom: "0mm",
      left: "0mm",
      right: "0mm"
    },
    landscape: false,
    format: "A4", // Format takes precedence over width and height if set
    height: "297", // A4
    width: "210", // A4
    path: process.argv[process.argv.length - 1],
    input: process.argv[process.argv.length - 2],
    scale: 1.0,
    displayHeaderFooter: false,
    printBackground: true
  };
   for (let i = 3; i < process.argv.length - 2; i += 2) {
    const value = process.argv[i + 1];
    switch (process.argv[i]) {
      case "--page-size":
        options.format = value;
        break;
      case "--orientation":
        options.landscape = value === "Landscape";
        break;
      case "--zoom":
        options.scale = parseFloat(value);
        break;
      case "--width":
        delete options.format;
        options.width = value;
        break;
      case "--height":
        delete options.format;
        options.height = value;
        break;
      case "--margin-top":
        options.margin.top = value;
        break;
      case "--margin-bottom":
        options.margin.bottom = value;
        break;
      case "--margin-left":
        options.margin.left = value;
        break;
      case "--margin-right":
        options.margin.right = value;
        break;
      case '--display-header-footer':
        options.displayHeaderFooter = (value === 'true');
        break;
      case '--header-template':
        options.headerTemplate = value;
        break;
      case '--footer-template':
        options.footerTemplate = value;
        break;
      default:
        console.log("Unknown argument: " + value);
    }
  }
  return options;
};
 createPdf(parseCmd());
