function setupDmakControls(dmak, btnList) {
    var p = document.getElementById(btnList.back);
    if (p) p.onclick = function () { dmak.eraseLastStrokes(1); };
    var s = document.getElementById(btnList.stop);
    if (s) s.onclick = function () { dmak.pause(); };
    var g = document.getElementById(btnList.play);
    if (g) g.onclick = function () { dmak.render(); };
    var n = document.getElementById(btnList.next);
    if (n) n.onclick = function () { dmak.renderNextStrokes(1); };
    var r = document.getElementById(btnList.reset);
    if (r) r.onclick = function () { dmak.erase(); };
}

function drawKanji(kanji, element, btnList, options = {}) {
    const defaultOptions = {
        'element': element,
        "stroke": { "attr": { "stroke": "#FF0000" } },
        "uri": "kanji/"
    };

    // dmak's internal `assign` will handle merging the options object.
    var dmak = new Dmak(kanji, { ...defaultOptions, ...options });

    setupDmakControls(dmak, btnList);

    return dmak;
}

async function translate(q) {
    const tl = 'vi';
    const sl = 'auto';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(q)}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

function findKanji(str) {
    var kanjiRegex = /[\u4e00-\u9faf]/g;
    var kanjiMatches = str.match(kanjiRegex);
    if (!kanjiMatches) {
        return [];
    }
    return kanjiMatches;
}

function isSubstringOfAnyOtherWord(word, data) {
    return data.some(item => item.word !== word && item.word.includes(word));
}

function getTalkingWord(input) {
    // Lọc các đối tượng có words xuất hiện trong input
    let filteredData = wordDataJSON.filter(item => input.includes(item.word));
    // Lọc các đối tượng có words không phải là một phần của từ khác
    filteredData = filteredData.filter(item => !isSubstringOfAnyOtherWord(item.word, filteredData));

    let replacedInput = input;
    filteredData.forEach(item => {
        const regex = new RegExp(item.word, 'g'); // Tạo biểu thức chính quy để thay thế tất cả các lần xuất hiện
        replacedInput = replacedInput.replace(regex, item.phonetic);
    });

    return replacedInput.replace('.', '');
}

function meanKanji(kanji) {
    const kanjiDetailHeader = document.getElementById("kanji-detail-header");
    const kanjiWrapper = document.getElementById("kanji-wrapper");
    const drawKanjiWord = document.getElementById("draw-kanji");
    const kanjiMean = document.getElementById("kanji-mean");
    const kanjiOnyomi = document.getElementById("kanji-onyomi");
    const kanjiKunyomi = document.getElementById("kanji-kunyomi");
    const kanjiDetail = document.getElementById("kanji-detail");
    const btnListKanji = {
        back: "draw-kanji-b", stop: "draw-kanji-s",
        play: "draw-kanji-p", reset: "draw-kanji-r", next: "draw-kanji-n",
    };

    if (kanjiDetailHeader) kanjiDetailHeader.style.display = "flex";
    if (kanjiWrapper) kanjiWrapper.style.display = "block";
    if (drawKanjiWord) drawKanjiWord.innerHTML = '';

    var dmak = new Dmak(kanji, {
        'element': "draw-kanji", "stroke": { "attr": { "stroke": "hsl" } }, "uri": "kanji/"
    });
    setupDmakControls(dmak, btnListKanji);

    let _kanjiDetail = findDetailKanji(kanji);
    if (!_kanjiDetail) return;
    if (kanjiMean) kanjiMean.innerHTML = _kanjiDetail.mean.map(item => `<div>${item}</div>`).join(' ');
    if (kanjiOnyomi) kanjiOnyomi.innerHTML = _kanjiDetail.on.map(item => `<div>${item}</div>`).join(' ');
    if (kanjiKunyomi) kanjiKunyomi.innerHTML = _kanjiDetail.kun.map(item => `<div>${item}</div>`).join(' ');
    if (kanjiDetail) kanjiDetail.innerHTML = _kanjiDetail.detail.split('##').map(item => `<div class="ps-2 text-start"> - ${item}</div>`).join(' ');
}

function findDetailKanji(kanji) {
    return kanjiDataJSON.find(item => item.kanji == kanji);
}

function textToSpeech() {
    const inputJp = document.getElementById("input-Jp");
    const text = inputJp ? inputJp.value : "";
    const msg = new SpeechSynthesisUtterance();
    msg.text = getTalkingWord(text);

    // Chọn giọng nói phù hợp với ngôn ngữ (nếu có)
    const voices = window.speechSynthesis.getVoices();
    for (let voice of voices) {
        if (voice.lang === "ja-JP") {
            msg.voice = voice;
            break;
        }
    }

    window.speechSynthesis.speak(msg);
}

function removeDuplicatesByItem1(array) {
    const uniqueItems = [];
    const checker = new Set();

    array.forEach(item => {
        const item1 = item[1];
        const key = JSON.stringify(item1);
        if (!checker.has(key)) {
            checker.add(key);
            uniqueItems.push(item);
        }
    });

    return uniqueItems;
}