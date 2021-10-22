const addForm = document.querySelector('.add-form');
const bookTitle = document.querySelector('#book-title');
const bookAuthor = document.querySelector('#book-author');
const bookPages = document.querySelector('#book-pages');
const bookAddDate = document.querySelector('#book-add-date');
const bookHaveRead = document.getElementById('book-haveRead');
const openModalBtn = document.querySelector('#modal-btn');
const closeModalBtn = document.querySelector('.close-add-form-btn');
const overlay = document.querySelector('#overlay');
const filterHaveReadRadioBtns = document.querySelectorAll('input[type="radio"][name="filter-haveRead"]');

const myLibrary = JSON.parse(localStorage.getItem('books')) || [];

// 渲染頁面
function render () {
  const booksContainerDiv = document.querySelector('.books-container');
  const cardDivs = document.getElementsByClassName('card');
  const welcomeGuideEle = document.querySelector('.welcome-guide');
  // 沒書就出現提醒
  if (myLibrary.length === 0) {
    welcomeGuideEle.style.display = 'block';
  } else {
    welcomeGuideEle.style.display = 'none';
  }
  let str = '';
  myLibrary.forEach((value, indexNum) => {
    if (value.haveRead === '讀了😃') {
     str += `
      <div class="card has-read" data-index="${indexNum}">
        <h2 class="title">${value.title}</h2>
        <h3>作者：${value.author}</h3>
        <h3>頁數：${value.pages}</h3>
        <h3>${value.haveRead}</h3>
        <span class="add-date">加入時間：${value.addDate.year}/${value.addDate.month}</span>
        <div class="btn-group">
          <button class="edit-btn far fa-edit"></button>
          <button class="delete-btn far fa-trash-alt"></button>
        </div>
      </div>
     `;
    } else {
     str += `
      <div class="card has-not-read" data-index="${indexNum}">
        <h2 class="title">${value.title}</h2>
        <h3>作者：${value.author}</h3>
        <h3>頁數：${value.pages}</h3>
        <h3>${value.haveRead}</h3>
        <span class="add-date">加入時間：${value.addDate.year}/${value.addDate.month}</span>
        <div class="btn-group">
          <button class="edit-btn far fa-edit"></button>
          <button class="delete-btn far fa-trash-alt"></button>
        </div>
      </div>
     `;
    }
  });
  booksContainerDiv.innerHTML = str;
  // 每個 book-card 的案件綁定事件（事件傳遞）
  for (let card of cardDivs) {
    card.addEventListener('click', (event) => {
      const isEditBtn = event.target.className.includes('edit-btn');
      const isDeleteBtn = event.target.className.includes('delete-btn');
      // 判斷對應的按鈕送任務
      if (isEditBtn) { changeHaveReadStatus(event, null); }
      if (isDeleteBtn) { deleteBook(event, null); }
    });
  }
  BookCounter();
}
// Constructor
function Book (title, author, addDate, pages, haveRead) {
  this.title = title;
  this.author = author;
  this.addDate = addDate;
  this.pages = pages;
  if (haveRead === 'true') {
    this.haveRead = '讀了😃';
  } else {
    this.haveRead = '還沒讀😢';
  }
}
// 以 constructor 的結構新增資料到主要 Array
function addBookToLibrary () {
  // 有接受表單資料記得用 str.trim() 去掉頭尾空白
  const bookTitleValue = bookTitle.value.trim();
  const bookAuthorValue = bookAuthor.value.trim();
  const bookPagesValue = bookPages.value.trim();
  const bookAddDateValue = bookAddDate.value.trim();
  const bookHaveReadValue = bookHaveRead.value.trim();
  const addDate = {year:bookAddDateValue.slice(0, 4), month:bookAddDateValue.slice(5, 7)};
  // 通過 validation 才會新增資料
  if (formValidation(bookTitleValue, bookAuthorValue, bookPagesValue, bookAddDateValue, bookHaveReadValue)) {
    const book = new Book(bookTitleValue, bookAuthorValue, addDate, bookPagesValue, bookHaveReadValue);
    // 把值取出來
    const {title, author, pages, haveRead} = book;
    // 再用{}把全部包起來
    myLibrary.push({title, author, addDate, pages, haveRead});
    // 新增資料到 localStorage
    localStorage.setItem('books', JSON.stringify(myLibrary));
    // 把因為 Validation 新增的 class 移除 => 下次能有一張空白的 form
    removeFormValidationClasses();
    addForm.reset();
    render();
  }
}
function changeHaveReadStatus (event, value) {
  // 冒泡找到實際綁定事件的元素（也就是 class: card）
  const ele = event.currentTarget;
  const bookId = ele.dataset.index;
  // 藉由第二個參數判定是否為篩選狀態
  // 篩選刪掉更改的東西
  if (value) {
    // data-attribute = myLibrary 的 indexNum
    // 再以 myLibrary[data-attribute] 為基礎找該值在篩選出的陣列的 index 為何
    // => 讓電腦知道這個已不符合當前的篩選，不用再 render 出來
    const foundArr = myLibrary[bookId];
    const index = value.indexOf(foundArr);
    value.splice(index, 1);
    filterRender(value);
  }
  // 更新 myLibrary 的資料
  if (myLibrary[bookId].haveRead === '讀了😃') {
    myLibrary[bookId].haveRead = '還沒讀😢';
  } else {
    myLibrary[bookId].haveRead = '讀了😃';
  }
  BookCounter();
  // 更改 localStorage 中的資料
  localStorage.setItem('books', JSON.stringify(myLibrary));
  if (!value) {
    render();
  }
} 
function deleteBook (event, value) {
  // 冒泡找到實際綁定事件的元素
  const ele = event.currentTarget;
  const bookId = ele.dataset.index;
  if (value) {
    const indexNum = value.indexOf(myLibrary[bookId]);
    // 篩選頁面是靠 value 的陣列渲染，所以要先刪掉渲染的
    value.splice(indexNum, 1);
    // 重新 render 以前要刪掉主 arr => 避免渲染的 data-index 對不上
    myLibrary.splice(bookId, 1);
    filterRender(value);
  }
  BookCounter();
  if (!value) {
    myLibrary.splice(bookId, 1);
    render();
  }
  // 更改 localStorage 中的資料
  localStorage.setItem('books', JSON.stringify(myLibrary));
}
function formValidation (bookTitleValue, bookAuthorValue, bookPagesValue, bookAddDateValue, bookHaveReadValue) {
  addForm.classList.add('has-validation');
  // 檢查是否已用相同書（by 書名）
  if(isBookAlreadyExisted(bookTitleValue)) { return; }
  if (bookTitleValue === '' || bookTitleValue === null) {
    setInvalidFeedback(bookTitle, '書名不可空白');
  } else {
    setValidFeedback(bookTitle);
  }  
  if (bookAuthorValue === '' || bookAuthorValue === null) {
    setInvalidFeedback(bookAuthor, '作者不可空白');
  } else {
    setValidFeedback(bookAuthor);
  }
  if (bookPagesValue === '' || bookPagesValue === null) {
    setInvalidFeedback(bookPages, '頁數不可空白');
  } else {
    setValidFeedback(bookPages);
  }
  if (bookAddDateValue === '' || bookAddDateValue === null) {
    setInvalidFeedback(bookAddDate, '讓我知道這本書什麼時候被加入的吧！');
  } else {
    setValidFeedback(bookAddDate);
  }
  if (bookHaveReadValue === '') {
    setInvalidFeedback(bookHaveRead, '告訴我書讀了沒好嗎？');
  } else {
    setValidFeedback(bookHaveRead);
  }
  if (bookTitle.parentElement.className === 'form-control valid-feedback' && bookAuthor.parentElement.className === 'form-control valid-feedback' && bookPages.parentElement.className === 'form-control valid-feedback' && bookAddDate.parentElement.className === 'form-control valid-feedback' && bookHaveRead.parentElement.className === 'form-control valid-feedback' ) {
    areAllValid = true;
  } else {
    areAllValid = false;
  }
  return areAllValid;
}
function removeFormValidationClasses () {
  if (!addForm.className.includes('has-validation')) return;
  addForm.classList.remove('has-validation');
  const addFormChildren = addForm.children;
  for (child of addFormChildren) {
    if (child.className.includes('valid-feedback')) {
      child.className = 'form-control';
    }
    if (child.children.length > 2) {
      child.lastChild.remove();
    }
  }
}
function openPopupAddForm () {
  openModalBtn.classList.add('is-active');
  addForm.classList.add('is-active');
  overlay.classList.add('is-active');
  removeFormValidationClasses();
}
function closePopupAddForm () {
  openModalBtn.classList.remove('is-active');
  addForm.classList.remove('is-active');
  overlay.classList.remove('is-active');
}
function setValidFeedback (input) {
  const formControll = input.parentElement;
  formControll.className = 'form-control valid-feedback';
  // 送出 => 檢查 => 成功(沒東西) => 失敗顯示提醒 / 成功不會提醒（結束資料上傳） => 直到成功資料才會上傳
  // 刪除原本的錯誤提醒
  if (formControll.children.length > 2) {
    formControll.lastChild.remove();
  }
}
function setInvalidFeedback (input, errorMessage) {
  const formControll = input.parentElement;
  formControll.className = 'form-control invalid-feedback';
  // 已經有錯誤提醒的話就不再顯示
  if (formControll.children.length < 3 ) {
  const errorEle = document.createElement('small');
  errorEle.innerText = errorMessage;
  formControll.append(errorEle);
  }
}
function isBookAlreadyExisted (bookName) {
  let isExisted = false;
  myLibrary.forEach(bookProperty => {
    if (bookProperty.title === bookName) {
      setInvalidFeedback(bookTitle, `館內已有 ${bookName} 了`);
      isExisted = true;
    }
  });
  return isExisted;
}
function fillterByHaveReadOrNot () {
  const filterValue = this.value;
  // 假如選擇「全部」就推全部的資料
  if (filterValue === 'all') {
    return render();
  }
  // 篩出符合條件的書本
  const filter = myLibrary.filter(value => value.haveRead === filterValue);
  filterRender(filter);
}
function filterRender (filterArrByReadRadioBtnValue) {
  const booksContainerDiv = document.querySelector('.books-container');
  const cardDivs = document.getElementsByClassName('card');
  let str = '';
  filterArrByReadRadioBtnValue.forEach((value) => {
    // 確保重新渲染的頁面 data-index = 主 arr 的 index
    // => 為了資料修改後還可以修改主要 arr 的資料
    // 但是渲染是獨立篩出來的 arr
    const indexNum = myLibrary.indexOf(value);
    if (value.haveRead === '讀了😃') {
      str += `
        <div class="card has-read" data-index="${indexNum}">
          <h2 class="title">${value.title}</h2>
          <h3>作者：${value.author}</h3>
          <h3>頁數：${value.pages}</h3>
          <h3>${value.haveRead}</h3>
          <span class="add-date">加入時間：${value.addDate.year}/${value.addDate.month}</span>
          <div class="btn-group">
            <button class="edit-btn far fa-edit"></button>
            <button class="delete-btn far fa-trash-alt"></button>
          </div>
        </div>
    `;
    } else {
      str += `
        <div class="card has-not-read" data-index="${indexNum}">
          <h2 class="title">${value.title}</h2>
          <h3>作者：${value.author}</h3>
          <h3>頁數：${value.pages}</h3>
          <h3>${value.haveRead}</h3>
          <span class="add-date">加入時間：${value.addDate.year}/${value.addDate.month}</span>
          <div class="btn-group">
            <button class="edit-btn far fa-edit"></button>
            <button class="delete-btn far fa-trash-alt"></button>
          </div>
        </div>
     `;
    }
  });
  booksContainerDiv.innerHTML = str;
  for (let card of cardDivs) {
    card.addEventListener('click', (event) => {
      const isEditBtn = event.target.className.includes('edit-btn');
      const isDeleteBtn = event.target.className.includes('delete-btn');
      if (isEditBtn) {
        // 改變狀態的書本監聽事件新增第二個參數
        // => 為什麼要傳入篩選出來的陣列？
        // => 因為希望讓使用者在已經篩出資料的同時可以直接修改資料，所以開兩個不同的 render
        // => 篩選 => 更改狀態 => 還是 render 符合篩選的資料
        changeHaveReadStatus(event, filterArrByReadRadioBtnValue);
      }
      if (isDeleteBtn) {
        deleteBook(event, filterArrByReadRadioBtnValue);
      }
    })
  }
}
function BookCounter () {
  const counterHasReadBooksNum = document.querySelector('#counter-has-read-books-num');
  const counterHasNotReadBooksNum = document.querySelector('#counter-has-not-read-books-num');
  const counterTotalBooksNum = document.querySelector('#counter-total-books-num');
  let totoalBooksNum = myLibrary.length;
  let hasReadBooksNum = 0;
  let hasNotReadBooksNum = 0;
  myLibrary.forEach(bookProperty => {
    if (bookProperty.haveRead === '讀了😃') {
      hasReadBooksNum += 1;
    } else {
      hasNotReadBooksNum += 1;
    }
  });
  counterHasReadBooksNum.innerText = hasReadBooksNum;
  counterHasNotReadBooksNum.innerText = hasNotReadBooksNum;
  counterTotalBooksNum.innerText = totoalBooksNum;
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  removeFormValidationClasses();
  addBookToLibrary();
});
openModalBtn.addEventListener('click', openPopupAddForm);
closeModalBtn.addEventListener('click', closePopupAddForm);
overlay.addEventListener('click', closePopupAddForm);
// 用 radio btn 當作篩選的按鈕 => 綁定事件
for (radioBtn of filterHaveReadRadioBtns) {
  radioBtn.addEventListener('change', fillterByHaveReadOrNot);
}

render();
