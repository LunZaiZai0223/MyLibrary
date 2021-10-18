const addForm = document.querySelector('.add-form');
const btnGroupDiv = document.getElementsByClassName('btn-group');
const bookTitle = document.querySelector('#book-title');
const bookAuthor = document.querySelector('#book-author');
const bookPages = document.querySelector('#book-pages');
const bookAddDate = document.querySelector('#book-add-date');
const bookHaveRead = document.getElementById('book-haveRead');
const openModalBtn = document.querySelector('#modal-btn');
const closeModalBtn = document.querySelector('.close-add-form-btn');
const overlay = document.querySelector('#overlay');
const filterHaveReadRadioBtns = document.querySelectorAll('input[type="radio"][name="filter-haveRead"]');
let filterHaveReadArr;
let filterHaveReadRadioValue;


const myLibrary = JSON.parse(localStorage.getItem('books')) || [];
// const myLibrary = [{}];

// 渲染頁面
function render () {
      // <div class="card">
      //     <h2 class="title">原子習慣</h2>
      //     <h3>作者</h3>
      //     <h3>頁數：350頁</h3>
      //     <h3>還沒讀😢</h3>
      //     <div class="btn-group">
      //       <button class="edit-btn"><i class="far fa-edit"></i></button>
      //       <button class="delete-btn"><i class="far fa-trash-alt"></i></button>
      //     </div>
      // </div>
  const booksContainerDiv = document.querySelector('.books-container');
  const cardDivs = document.getElementsByClassName('card');
  // const booksInLocalStorage = JSON.parse(localStorage.getItem('books'));
  // console.log(booksInLocalStorage);
  console.log(cardDivs);
  let str = '';
  // if (!booksInLocalStorage) return;
  myLibrary.forEach((value, indexNum) => {
    value.id = indexNum;
    str += `
      <div class="card" data-index="${value.id}">
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
  });
  booksContainerDiv.innerHTML = str;
  for (let card of cardDivs) {
    // card.addEventListener('click', changeHaveReadStatus);
    // card.addEventListener('click', deleteBook);
    card.addEventListener('click', (event) => {
      const isEditBtn = event.target.className.includes('edit-btn');
      const isDeleteBtn = event.target.className.includes('delete-btn');
      if (isEditBtn) { changeHaveReadStatus(event, null); }
      if (isDeleteBtn) { deleteBook (event, null); }
    });
  }
  // booksContainerDiv.addEventListener('click', changeHaveReadStatus);
  // if (btnGroupDiv.length > 0) {
  //   btnGroupDiv.forEach(btn => {
  //     btn.addEventListener('click', changeHaveReadStatus);
  //   });
  // }
}


function Book (id, title, author, addDate, pages, haveRead) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.addDate = addDate;
  this.pages = pages;
  if (haveRead === 'true') {
    this.haveRead = '讀了😃';
  } else {
    this.haveRead = '還沒讀😢';
  }
  // this.haveRead = haveRead;
}

// const textBook1 = new Book('原子習慣', 'JAMES, 譯者：蔡世偉', '304', 'false');
// const textBook2 = new Book('原子習慣', 'JAMES', '304', 'false');
// const textBook3 = new Book('原子習慣', 'JAMES', '304', 'false');
// const textBook4 = new Book('原子習慣', 'JAMES', '304', 'false'); 
// myLibrary.push(textBook1, textBook2, textBook3, textBook4);


function addBookToLibrary () {
  const bookTitleValue = bookTitle.value.trim();
  const bookAuthorValue = bookAuthor.value.trim();
  const bookPagesValue = bookPages.value.trim();
  const bookAddDateValue = bookAddDate.value.trim();
  const bookHaveReadValue = bookHaveRead.value.trim();
  const addDate = {year:bookAddDateValue.slice(0, 4), month:bookAddDateValue.slice(5, 7)};
  // input
  // console.log(bookTitle, bookAuthor, bookPages, bookHaveRead, bookAddDate);
  console.log(bookTitleValue, bookAuthorValue, bookPagesValue, bookAddDateValue, bookHaveReadValue);
  if (formValidation(bookTitleValue, bookAuthorValue, bookPagesValue, bookAddDateValue, bookHaveReadValue)) {
    console.log('All Ok');
    const book = new Book(myLibrary.length, bookTitleValue, bookAuthorValue, addDate, bookPagesValue, bookHaveReadValue);
    console.log(book);
    // 把值取出來
    const {id, title, author, pages, haveRead} = book;
    // 再用{}把全部包起來
    myLibrary.push({id, title, author, addDate, pages, haveRead});
    console.log(myLibrary);
    // 新增資料到 localStorage
    localStorage.setItem('books', JSON.stringify(myLibrary));
    removeFormValidationClasses();
    addForm.reset();
    render();
  }
  // console.log(typeof(bookAddDate));
  // console.log(bookAddDate.slice(0, 4), bookAddDate.slice(5, 7));
  // console.log(addDate);

  // const book = new Book(bookTitle, bookAuthor, addDate, bookPages, bookHaveRead);
}
function changeHaveReadStatus (event, value) {
  // console.log(event.target);
  // const isEditBtn = event.target.className.includes('edit-btn');
  // console.log(isEditBtn);

  // 冒泡找到實際綁定事件的元素
  const ele = event.currentTarget;
  const bookId = ele.dataset.index;
  console.log(bookId);
  // console.log(bookId);
  // // if (isEditBtn) {
    myLibrary.forEach(value => {
      console.log(value);
      // 一開始建立的資料是 number
      if (value.id === parseInt(bookId)) {
        if (value.haveRead === '讀了😃') {
          value.haveRead = '還沒讀😢';
        } else {
          value.haveRead = '讀了😃';
        }
      }
    });
    // if (myLibrary[indexNum].haveRead === '讀了😃') {
    //   myLibrary[indexNum].haveRead = '還沒讀😢';
    // } else {
    //   myLibrary[indexNum].haveRead = '讀了😃';
    // }
  // }
  // 更改 localStorage 中的資料
  localStorage.setItem('books', JSON.stringify(myLibrary));
  // console.log(event.target);
  // console.log(this.dataset.index);
  if (value) {
    // 只丟符合的資料
    const sortedArr = value.filter(arr => arr.haveRead === filterHaveReadRadioValue);
    filterRender(sortedArr);
  } else {
    render();
  }
} 
function deleteBook (event, value) {
  // const isDeleteBtn = event.target.className.includes('delete-btn');
  // console.log(isDeleteBtn);
  // const indexNum = this.dataset.index;

  // 冒泡找到實際綁定事件的元素
  const ele = event.currentTarget;
  const bookId = ele.dataset.index;
  console.log(bookId);
  // console.log(indexNum);
  // if (isDeleteBtn) {
  myLibrary.forEach(value => {
    if (value.id === parseInt(bookId)) {
      const indexNum = myLibrary.indexOf(value);
      console.log(indexNum);
      myLibrary.splice(indexNum, 1);
      console.log(myLibrary);
    }
  });
    // myLibrary.splice(indexNum, 1);
  // }
  // 更改 localStorage 中的資料
  localStorage.setItem('books', JSON.stringify(myLibrary));
  console.log(myLibrary);
  if (value) {
    console.log(bookId);
    // const sortedArr = value.filter(arr => arr.haveRead === filterHaveReadRadioValue);
    // console.log(sortedArr);
    value.forEach(arr => {
      if (arr.id === parseInt(bookId)) {
        console.log(arr);
        const indexNum = value.indexOf(arr);
        console.log(indexNum);
        value.splice(indexNum, 1);
      }
    });
    console.log(value);
    filterRender(value);
  } else {
    render();
  }
}
function formValidation (bookTitleValue, bookAuthorValue, bookPagesValue, bookAddDateValue, bookHaveReadValue) {
  addForm.classList.add('has-validation');
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
  if (formControll.children.length > 2) {
    formControll.lastChild.remove();
  }
}
function setInvalidFeedback (input, errorMessage) {
  const formControll = input.parentElement;
  formControll.className = 'form-control invalid-feedback';
  if (formControll.children.length < 3 ) {
  const errorEle = document.createElement('small');
  errorEle.innerText = errorMessage;
  formControll.append(errorEle);
  }
}
function fillterByHaveReadOrNot () {
  // const isTargetIncludeInputEle = event.target.nodeName.includes('INPUT');
  // if (isTargetIncludeInputEle) {
  //   console.log(event.target.value);
  // }
  const filterValue = this.value;
  console.log(filterValue);
  if (filterValue === 'all') {
    return render();
  }
  filterHaveReadRadioValue = filterValue;
  const filter = myLibrary.filter(value => value.haveRead === filterValue);
  filterHaveReadArr = filter;
  console.log(filter);
  filterRender(filter);
}
function filterRender (filterValue) {
  console.log(filterValue);
  const booksContainerDiv = document.querySelector('.books-container');
  const cardDivs = document.getElementsByClassName('card');
  let str = '';
  filterValue.forEach((value) => {
    str += `
      <div class="card" data-index="${value.id}">
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
  });
  booksContainerDiv.innerHTML = str;
  for (let card of cardDivs) {
    // card.addEventListener('click', changeHaveReadStatus);
    // card.addEventListener('click', deleteBook);
    card.addEventListener('click', (event) => {
      const isEditBtn = event.target.className.includes('edit-btn');
      const isDeleteBtn = event.target.className.includes('delete-btn');
      if (isEditBtn) {
        changeHaveReadStatus(event, filterHaveReadArr);
      }
      if (isDeleteBtn) {
        deleteBook(event, filterHaveReadArr);
      }
    })
  }
}
// function filterChangeHaveReadStatus (event) {
  
// }

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  removeFormValidationClasses();
  addBookToLibrary();
});
openModalBtn.addEventListener('click', openPopupAddForm);
closeModalBtn.addEventListener('click', closePopupAddForm);
overlay.addEventListener('click', closePopupAddForm);
for (radioBtn of filterHaveReadRadioBtns) {
  radioBtn.addEventListener('change', fillterByHaveReadOrNot);
}

render();
