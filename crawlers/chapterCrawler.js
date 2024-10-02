// scrapeChapter.js
import puppeteer from 'puppeteer';
import { print, OutPutType } from '../helpers/print.js';

const chapterCrawler = async (chapterUrl) => {

  const browser = await puppeteer.launch();
  const chapterPage = await browser.newPage();

  try {
    await chapterPage.goto(chapterUrl, { waitUntil: 'networkidle2' });

    // Wait for the chapter content to load
    await chapterPage.waitForSelector('.reading-detail.box_doc');

    // Extract the chapter title from the breadcrumb
    const chapterTitle = await chapterPage.evaluate(() => {
      const titleElement = document.querySelector('.top .breadcrumb li:last-child a span');
      return titleElement ? titleElement.textContent.trim() : null;
    });
    // Extract the image URLs of each page in the chapter
    const chapterPages = await chapterPage.$$eval('.page-chapter img', (imgs) =>
      imgs.map((img) => img.getAttribute('data-src'))
    );

    // Create a JSON object for the chapter
    const chapterData = {
      title: chapterTitle,
      pages: chapterPages,
    };

    print("Chapter Data: " + JSON.stringify(chapterData, null, 2), OutPutType.INFO);
    return chapterData; // Return the chapter data as JSON

  } catch (error) {
    console.error(`Error scraping chapter ${chapterUrl}:`, error);
    return null;
  } finally {
    await chapterPage.close();
    await browser.close();
  }
};

export default chapterCrawler;
