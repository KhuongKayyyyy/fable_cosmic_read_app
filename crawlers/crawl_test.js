import puppeteer from "puppeteer";
import chapterCrawler from "./chapterCrawler.js";
import { genreRepository, bookRepository } from "../repositories/index.js";
import { Chapter } from "../models/index.js";
import genre from "../repositories/genre.js";
import dotenv from "dotenv";
dotenv.config();
import connect from "../database/database.js";
import { print, OutPutType } from "../helpers/print.js";
import book from "../repositories/book.js";

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
const cosmicList = [
  // "https://truyenqqto.com/truyen-tranh/tokyo-ghoul-486",
  // "https://truyenqqto.com/truyen-tranh/one-piece-128",
  // "https://truyenqqto.com/truyen-tranh/bleach-full-color-14608",
  // "https://truyenqqto.com/truyen-tranh/7-vien-ngoc-rong-194",
  // "https://truyenqqto.com/truyen-tranh/hay-am-sat-ta-de-cuu-lay-trai-dat-234",
  // "https://truyenqqto.com/truyen-tranh/jujutsu-kaisen-chu-thuat-hoi-chien-5058",
  // "https://truyenqqto.com/truyen-tranh/chuyen-sinh-thanh-lieu-dot-bien-12979",
  // "https://truyenqqto.com/truyen-tranh/nhat-nguyet-dong-thac-15691",
  // "https://truyenqqto.com/truyen-tranh/ke-pha-hoai-to-doi-16105",
  // "https://truyenqqto.com/truyen-tranh/killy-valentino-15769",
  // "https://truyenqqto.com/truyen-tranh/cuoc-song-tan-the-bat-dau-tu-so-0-8370",
  // "https://truyenqqto.com/truyen-tranh/tham-tu-conan-199",
  // "https://truyenqqto.com/truyen-tranh/chuyen-tinh-wi-fi-15652",
  // "https://truyenqqto.com/truyen-tranh/akabane-honeko-no-bodyguard-15970",
  // "https://truyenqqto.com/truyen-tranh/ban-tinh-ca-hy-lan-quoc-14257",
  // "https://truyenqqto.com/truyen-tranh/chinh-nghia-khong-ta-tro-thanh-phan-dien-15790",
  // "https://truyenqqto.com/truyen-tranh/thuan-thu-su-thien-tai-16129",
  // "https://truyenqqto.com/truyen-tranh/fight-class-3-15628",
  // "https://truyenqqto.com/truyen-tranh/toi-chuyen-vang-tai-mat-the-16020",
  // "https://truyenqqto.com/truyen-tranh/blame-master-edition-15766"
  // "https://truyenqqto.com/truyen-tranh/toi-la-hoc-sinh-hang-d-16155",
  "https://truyenqqto.com/truyen-tranh/reborn-nguoi-dao-tao-sat-thu-13539",
  "https://truyenqqto.com/truyen-tranh/naruto-197",
  "https://truyenqqto.com/truyen-tranh/witch-hunter-225",
  "https://truyenqqto.com/truyen-tranh/the-promised-neverland-2547",
  "https://truyenqqto.com/truyen-tranh/cao-thu-bong-ro-remake-14065",
  "https://truyenqqto.com/truyen-tranh/haikyuu-526"

];

(async () => {
  await connect();

  // try {
  //   await Genre.insertMany(genres.map(genre => ({name: genre})));
  //   console.log("Genres inserted successfully");
  // }catch{
  //     console.log("Error inserting genres");
  // }
  const browser = await puppeteer.launch({ headless: true });

  for (const url of cosmicList) {
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      // Extract book information
      const bookInfo = await page.evaluate(() => {
        const titleElement = document.querySelector('h1[itemprop="name"]');
        const authorElement = document.querySelector(".author .col-xs-9 a");
        const statusElement = document.querySelector(".status .col-xs-9");
        const introduction = document.querySelector('.story-detail-info p');
        const likeCountElement = document.querySelector(".number-like");
        const followCountElement = document.querySelector(
          ".row:nth-child(4) .col-xs-9"
        );
        const readCountElement = document.querySelector(
          ".row:nth-child(5) .col-xs-9"
        );
        const imgElement = document.querySelector(".book_avatar img");
        const genresElements = Array.from(
          document.querySelectorAll(".list01 li a")
        );
        const genres = genresElements.map((genre) => genre.textContent.trim());
        return {
          title: titleElement ? titleElement.textContent.trim() : null,
          thumbnail: imgElement ? imgElement.src : null,
          author: authorElement ? authorElement.textContent.trim() : null,
          status: statusElement ? statusElement.textContent.trim() : null,
          introduction: introduction ? introduction.textContent.trim() : null,
          likes: likeCountElement
            ? parseInt(likeCountElement.textContent.trim().replace(/,/g, ""))
            : 0,
          follows: followCountElement
            ? parseInt(followCountElement.textContent.trim().replace(/,/g, ""))
            : 0,
          views: readCountElement
            ? parseInt(readCountElement.textContent.trim().replace(/,/g, ""))
            : 0,
          genres: genres,
        };
      });

      let genreList = [];
      for (let genre of bookInfo.genres) {
        try {
          let genreObject = await genreRepository.getAllGenre(genre);
          if (genreObject) {
            genreList.push(genreObject);
          }
        } catch (error) {
          console.error(`Error fetching genre ${genre}:`, error);
        }
      }
      console.log("Final genre list:", genreList);

      let newBook = await bookRepository.insertBook({
        name: bookInfo.title,
        thumbnail: bookInfo.thumbnail,
        genres: genreList,
        author: bookInfo.author,
        introduction: bookInfo.introduction,
        viewCount: bookInfo.views,
        likeCount: bookInfo.likes,
        followCount: bookInfo.follows,
        status: bookInfo.status,
        chapters: [],
      });
      print(`Saved book ${newBook.name}`, OutPutType.SUCCESS);
      // Extract chapters
      const chapters = await page.$$eval(".works-chapter-item", (items) =>
        items.map((item) => {
          const titleElement = item.querySelector(".name-chap a");
          const dateElement = item.querySelector(".time-chap");

          return {
            title: titleElement ? titleElement.innerText.trim() : null,
            url: titleElement ? titleElement.href : null,
            date: dateElement ? dateElement.innerText.trim() : null,
          };
        })
      );

      const limitedChapters = chapters.length > 20 ? chapters.slice(0, 20) : chapters;
      // const limitedChapters = chapters.slice(0, 3);
      const chapterList = [];
      for (let chapter of limitedChapters) {
        const chapterData = await chapterCrawler(chapter.url);
        if (chapterData) {
          const newChapter = new Chapter({
            title: chapter.title,
            pages: chapterData.pages,
            book: newBook,
          });
          await newChapter.save();
          chapterList.push(newChapter);
        }
      }

      newBook.chapters = chapterList;
      await newBook.save();
      print(`Updated book ${newBook.name} with chapters`, OutPutType.SUCCESS);
    } catch (error) {
      console.error("Error while scraping:", error);
    } finally {
      await page.close();
    }
  }

  await browser.close();
})();

function extractGenres(genreString) {
  const genres = genreString.split(" - ").map((genre) => genre.trim());
  return genres;
}
