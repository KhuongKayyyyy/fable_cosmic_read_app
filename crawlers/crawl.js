import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import connect from '../database/database.js';
import { Book, Chapter,Genre } from '../models/index.js';
import { print, OutPutType } from '../helpers/print.js';
import { bookRepository } from '../repositories/index.js';
import dotenv from 'dotenv';
import chapterCrawler  from './chapterCrawler.js'; 
dotenv.config();

const cosmicList = [
  "https://nettruyenviet.com/truyen-tranh/dai-chien-nguoi-khong-lo",
  "https://nettruyenviet.com/truyen-tranh/mar",
  "https://nettruyenviet.com/truyen-tranh/thanh-guom-diet-quy",
  "https://nettruyenviet.com/truyen-tranh/giai-dau-giua-cac-vu-tru-song-song",
  "https://nettruyenviet.com/truyen-tranh/bleach-full-color",
  "https://nettruyenviet.com/truyen-tranh/hunter-x-hunter",
  "https://nettruyenviet.com/truyen-tranh/one-piece",
  "https://nettruyenviet.com/truyen-tranh/the-promised-neverland",
  "https://nettruyenviet.com/truyen-tranh/vua-bong-da",
  "https://nettruyenviet.com/truyen-tranh/van-co-chi-ton",
  "https://nettruyenviet.com/truyen-tranh/onepunch-man",
  "https://nettruyenviet.com/truyen-tranh/dai-tieu-thu-sao-phai-gia-nam",
  "https://nettruyenviet.com/truyen-tranh/naruto"
];
const genres = [
  "Action",
  "Adventure",
  "Anime",
  "Chuyển Sinh",
  "Comedy",
  "Comic",
  "Cooking",
  "Doujinshi",
  "Drama",
  "Fantasy",
  "Gender Bender",
  "Historical",
  "Horror",
  "Live action",
  "Manga",
  "Manhua",
  "Manhwa",
  "Martial Arts",
  "Mystery",
  "Mecha",
  "Romance",
  "School Life",
  "Sci-fi",
  "Shoujo",
  "Shoujo Ai",
  "Shounen",
  "Shounen Ai",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thiếu nhi",
  "Tragedy",
  "Trinh thám",
  "Truyện scan",
  "Truyện màu",
  "Webtoon",
  "Xuyên Không",
];

(async () => {
  await connect();

  try {
    await Genre.insertMany(genres.map(genre => ({name: genre})));
    console.log("Genres inserted successfully");
  }catch{
      console.log("Error inserting genres");
  }
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

      // console.log('Book Info:', bookInfo);

      let newBook = await bookRepository.insertBook({name: bookInfo.title, thumbnail: bookInfo.thumbnail, genre: bookInfo.genres.split(' - ').map(genre => genre.trim()), viewCount: bookInfo.viewCount, author: bookInfo.author, status: bookInfo.status || "Đang tiến hành", chapters: []});
      print(`Saved book ${newBook.name}`, OutPutType.SUCCESS);
    
      // Extract chapter links
      const chapters = await page.$$eval('#nt_listchapter .row .chapter a', elements => 
        elements.map(el => ({
          title: el.innerText,
          url: el.href
        }))
      );
      // console.log('Chapters:', chapters);

      // Limit the number of chapters to scrape
      let chapterList = [];
      // Limit the number of chapters to scrape to 10
      const limitedChapters = chapters.slice(0, 20);
      
      // Add limited chapters to the book
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
      newBook.chapters = chapterList;
      await newBook.save();
      print(`Updated book ${newBook.name} with chapters`, OutPutType.SUCCESS);

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
