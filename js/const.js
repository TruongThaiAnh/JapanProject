const btnListKanji = {
    // play: "draw-kanji-p",
    // stop: "draw-kanji-s",
    // next: "draw-kanji-n",
    // back: "draw-kanji-b",
    // reset: "draw-kanji-r",
    back: "draw-kanji-b",
    stop: "draw-kanji-s",
    play: "draw-kanji-p",
    reset: "draw-kanji-r",
    next: "draw-kanji-n",
}

const btnListJapanese = {
    back: "japanese-wrapper-b",
    stop: "japanese-wrapper-s",
    play: "japanese-wrapper-p",
    reset: "japanese-wrapper-r",
    next: "japanese-wrapper-n",
}

const japaneseWrapper = document.getElementById("japanese-wrapper");
const japaneseSearch = document.getElementById("japanese-search");
const japaneseJLPT = document.getElementById("japanese-jlpt");
const inputJp = document.getElementById("input-Jp");
const japaneseReading = document.getElementById("japanese-reading");
const vietnameseMean = document.getElementById("vietnamese-mean");
const selectJLPT = document.getElementById("select-jlpt");
const kanjiMean = document.getElementById("kanji-mean");
const kanjiDetail = document.getElementById("kanji-detail");
const kanjiKunyomi = document.getElementById("kanji-kunyomi");
const kanjiOnyomi = document.getElementById("kanji-onyomi");
const kanjiWrapper = document.getElementById("kanji-wrapper");
const formSubmit = document.getElementById("form-submit");
const drawKanjiWord = document.getElementById("draw-kanji");
const inputReading = document.getElementById("reading");
const japaneseReadingHira = document.getElementById("japanese-reading-hira");

let findInput;
let readingJapanese;