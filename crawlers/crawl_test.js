import puppeteer from 'puppeteer';
import chapterCrawler from './chapterCrawler.js';
import { genreRepository, bookRepository } from '../repositories/index.js';
import { Chapter } from '../models/index.js';
import genre from '../repositories/genre.js';
import dotenv from 'dotenv';
dotenv.config();
import connect from '../database/database.js';
import { print, OutPutType } from '../helpers/print.js';
import book from '../repositories/book.js';

const cosmicList = ["https://nettruyenviet.com/truyen-tranh/ma-tu-tai-sinh-khoi-dau-nhat-duoc-mot-hanh-tinh-zombie"];

(async () => {
  await connect();
  const browser = await puppeteer.launch({ headless: true });

  for (const url of cosmicList) {
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      const bookInfo = await page.evaluate(() => {
        const titleElement = document.querySelector('h1.title-detail');
        const authorElement = document.querySelector('.author .col-xs-8');
        const statusElement = document.querySelector('.status .col-xs-8');
        const genresElement = document.querySelector('.kind .col-xs-8');
        const imgElement = document.querySelector('.col-image img');
        const viewCountElement = document.querySelector('.row p.col-xs-8');
        
        return {
          title: titleElement ? titleElement.textContent.trim() : null,
          thumbnail: imgElement ? imgElement.src : null,
          author: authorElement ? authorElement.textContent.trim() : null,
          status: statusElement ? statusElement.textContent.trim() : null,
          genres: genresElement ? genresElement.textContent.trim() : null,
          viewCount: viewCountElement ? parseInt(viewCountElement.textContent.trim().replace(/,/g, '')) : 0
        };
      });

      const genres = extractGenres(bookInfo.genres);
      let genreList = [];
      for (let genre of genres) { 
        try {
          let genreObject = await genreRepository.getAllGenre(genre);
          genreList.push(genreObject._id);
        } catch (error) {
          console.error(`Error fetching genre ${genre}:`, error);
        }
      }
      console.log('Final genre list:', genreList);

      let newBook = await bookRepository.insertBook({
        name: bookInfo.title,
        thumbnail: bookInfo.thumbnail,
        genres: genreList,
        viewCount: bookInfo.viewCount,
        author: bookInfo.author,
        status: bookInfo.status || "Đang tiến hành",
        chapters: []
      });
      print(`Saved book ${newBook.name}`, OutPutType.SUCCESS);
      console.log(newBook)

      const chapters = await page.$$eval('#nt_listchapter .row .chapter a', elements => 
        elements.map(el => ({
          title: el.innerText,
          url: el.href
        }))
      );

      // Check if there are any chapters found
      if (chapters.length === 0) {
        console.log("No chapters found for this book.");
        continue; // Skip this book if no chapters are found
      }

      // Limit the number of chapters to scrape to a maximum of 20
      const limitedChapters = chapters.length > 20 ? chapters.slice(0, 20) : chapters; 
      
      // Add the limited chapters to the book
      let chapterList = [];
      for (const chapter of limitedChapters) {
        const chapterData = await chapterCrawler(chapter.url);
        if (chapterData) {
          const newChapter = new Chapter({
            title: chapterData.title,
            pages: chapterData.pages,
            book: newBook
          });
          await newChapter.save();
          console.log(newChapter);
          chapterList.push(newChapter);
        }
      }
      newBook.chapters = chapterList;
      await newBook.save();
    } catch (error) {
      console.error("Error while scraping:", error);
    } finally {
      await page.close(); 
    }
  }

  await browser.close(); 
})();

function extractGenres(genreString) {
  // Trim the string and split it by ' - ' to get individual genres
  const genres = genreString.split(' - ').map(genre => genre.trim());
  return genres;
}
