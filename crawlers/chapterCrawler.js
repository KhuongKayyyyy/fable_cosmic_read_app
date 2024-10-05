// scrapeChapter.js
import puppeteer from 'puppeteer';
import { print, OutPutType } from '../helpers/print.js';

const chapterCrawler = async (chapterUrl) => {
  const browser = await puppeteer.launch();
  const chapterPage = await browser.newPage();

  try {
    await chapterPage.goto(chapterUrl, { waitUntil: 'networkidle2' });

    // Wait for the chapter content to load
    await chapterPage.waitForSelector('.page-chapter img'); // Wait for images to load

    // Extract the chapter title from the breadcrumb
    const chapterTitle = await chapterPage.evaluate(() => {
      const titleElement = document.querySelector('h1.detail-title.txt-primary');
      return titleElement ? titleElement.textContent.trim() : 'Untitled Chapter';
    });

    // Extract the image URLs of each page in the chapter
    const chapterPages = await chapterPage.$$eval('.page-chapter img', (images) =>
      images.map((img) => img.src || img.getAttribute('data-original'))
    );

    // Create a JSON object for the chapter
    const chapterData = {
      title: chapterTitle,
      pages: chapterPages,
    };

    // Uncomment to log chapter data
    // print("Chapter Data: " + JSON.stringify(chapterData, null, 2), OutPutType.INFO);
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
