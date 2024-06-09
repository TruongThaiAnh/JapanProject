japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);

$(window).resize(function () {
    japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);
});

//search
formSubmit.addEventListener("submit", function (event) {
    event.preventDefault(); //ngăn chặn hành vi mặc định của biểu mẫu (nghĩa là không gửi biểu mẫu và không làm mới trang).



    japaneseWrapper.innerHTML = "";// đặt lại nội dung của phần tử japaneseWrapper về trống.
    kanjiWrapper.style.display = "none"; //ẩn phần tử kanjiWrapper bằng cách thay đổi thuộc tính display của nó thành none.


    findInput = inputJp.value; // lấy giá trị từ ô nhập (inputJp) và gán nó cho biến findInput.
    drawKanji(findInput, "japanese-wrapper", btnListJapanese); //gọi hàm drawKanji với các tham số là findInput, "japanese-wrapper" và btnListJapanese. (Hàm này có thể vẽ chữ Kanji lên giao diện người dùng).
    japaneseReadingHira.innerHTML = `<div class="ps-1 text-start"> - ${getTalkingWord(findInput)}</div>`; //đặt nội dung HTML cho phần tử japaneseReadingHira với một giá trị mới, bao gồm một div chứa giá trị trả về từ hàm getTalkingWord(findInput).

    translate(findInput).then((res) => {
        // vietnameseMean.innerHTML = res[5][0][2].map(element => {
        //     return `<div class="ps-1 text-start"> - ${element[0]}</div>`;
        // }).join('');
        let data = removeDuplicatesByItem1(res[0]);
        // console.log(data);
        // vietnameseMean.innerHTML = `<div class="ps-1 text-start"> - ${res[0][0][0]}</div>`;
        japaneseReading.innerHTML = `<div class="ps-1 text-start"> - ${data.slice(-1).pop().slice(-1).pop()}</div>`;
        vietnameseMean.innerHTML = `<div class="ps-1 text-start"> - ${data.filter(item => item[1] != null).map(item => item[0]).join(' ')}</div>`;
    });
});

//JLPT
selectJLPT.addEventListener("change", function () {
    japaneseJLPT.innerHTML = "";
    let jlpt = selectJLPT.value;
    if (jlpt > 0) {
        japaneseJLPT.innerHTML = '';
        japaneseJLPT.style.display = "block";
        japaneseSearch.style.display = "none";

        let data = kanjiDataJSON.filter(item => item.level && item.level.includes(`N${jlpt}`)).map(item => `<h5 class="kanji border">${item.kanji}</h5>`).join('');
        japaneseJLPT.innerHTML = data;
        japaneseJLPT.querySelectorAll('.kanji').forEach(item => {
            item.addEventListener('click', () => {
                kanjiWrapper.style.display = "block";
                meanKanji(item.innerHTML);
                findInput = item.innerHTML;
                drawKanjiWord.innerHTML = "";
            });
        });
    } else {
        japaneseJLPT.style.display = "none";
        japaneseSearch.style.display = "block";
        japaneseWrapper.innerHTML = '';
    }
});


window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
};

//Đọc
inputReading.addEventListener('click', () => { textToSpeech() });

// Thêm dấu phân cách vào giữa các phần tử con
const dox = document.querySelectorAll('.d-detail > div');
dox.forEach((div, index) => {
    if (index !== dox.length - 1) {
        div.insertAdjacentHTML('afterend', '<span class="me-2"> , </span>');
    }
});