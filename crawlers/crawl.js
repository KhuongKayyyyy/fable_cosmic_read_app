import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import connect from '../database/database.js';
import { Book, Chapter } from '../models/index.js';
import { print, OutPutType } from '../helpers/print.js';
import dotenv from 'dotenv';
import chapterCrawler  from './chapterCrawler.js'; 
dotenv.config();

const cosmicList = [
  // "https://nettruyenww.com/truyen-tranh/hunter-x-hunter-227",
  // "https://nettruyenww.com/truyen-tranh/dai-chien-nguoi-khong-lo-462",
  // "https://nettruyenww.com/truyen-tranh/mar-22717",
  // "https://nettruyenww.com/truyen-tranh/de-vuong-hoi-quy-23412",
  // "https://nettruyenww.com/truyen-tranh/shinobi-undercover-25960",
  "https://nettruyenviet.com/truyen-tranh/hunter-x-hunter",
];

(async () => {
  await connect();
  // Launch a new browser instance
  const browser = await puppeteer.launch();

  for (const url of cosmicList) {
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Query the book info
      const bookInfo = await page.evaluate(() => {
        const titleElement = document.querySelector('h1.title-detail');
        const authorElement = document.querySelector('.author .col-xs-8');
        const statusElement = document.querySelector('.status .col-xs-8');
        const genresElement = document.querySelector('.kind .col-xs-8');
        const viewCountElement = document.querySelector('.row p.col-xs-8'); 
        return {
          title: titleElement ? titleElement.textContent.trim() : null,
          author: authorElement ? authorElement.textContent.trim() : null,
          status: statusElement ? statusElement.textContent.trim() : null,
          genres: genresElement ? genresElement.textContent.trim() : null,
          viewCount: viewCountElement ? parseInt(viewCountElement.textContent.trim().replace(/,/g, '')) : 0
        };
      });

      console.log('Book Info:', bookInfo);
      const book = new Book({
        name: bookInfo.title,
        genres: bookInfo.genres.split(' - ').map(genre => genre.trim()),
        viewCount: 0,
        status: bookInfo.status || "Đang tiến hành",
        author: bookInfo.author,
        chapters: []
      });
      await book.save();
      print(`Saved book ${book.name}`, OutPutType.SUCCESS);
    
      // Extract chapter links
      const chapters = await page.$$eval('#nt_listchapter .row .chapter a', elements => 
        elements.map(el => ({
          title: el.innerText,
          url: el.href
        }))
      );
      console.log('Chapters:', chapters);

      // Limit the number of chapters to scrape
      const limitedChapters = chapters.slice(0, 3);

      let chapterList = [];
      // Add the chapters to the book
      for (const chapter of limitedChapters) {
        const chapterData = await chapterCrawler(chapter.url);
        if (chapterData) {
          const newChapter = new Chapter({
            title: chapterData.title,
            pages: chapterData.pages
          });
          await newChapter.save();
          chapterList.push(newChapter);
        }
      }
      book.chapters = chapterList;
      await book.save();
      print(`Updated book ${book.name} with chapters`, OutPutType.SUCCESS);

    } catch (error) {
      console.log(`Error scraping ${url}:`, error);
    }
    await page.close();
  }

  // Close the browser after processing all URLs
  await browser.close();

  // Close the MongoDB connection
  await mongoose.connection.close();
})();
