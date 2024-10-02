import chapterCrawler from "./chapterCrawler.js";

chapterCrawler("https://nettruyenviet.com/truyen-tranh/hunter-x-hunter/chuong-400").then((chapter) => {
  console.log(chapter);
})