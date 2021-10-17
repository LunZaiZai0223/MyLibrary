const myLibrary = [];

function Book (title, author, pages, haveRead) {
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.haveRead = haveRead,
  this.info = function () {
    return `書名：${title} 作者：${author}，${title}共${pages}頁，讀過了嗎？${haveRead}`;
  }
}

const book1 = new Book('原子習慣', 'James Clear, 譯者：蔡世偉', 304, true);
console.log(book1.info());

function PrintStuff (myDocuments) {
  this.documents = myDocuments;
}
PrintStuff.prototype.print = function () { console.log(this.documents); };

const newObj = new PrintStuff ("I am a new Object and I can print.");
newObj.print();


// constructor 多為大寫開頭
function Account () {
  this.func = function() { console.log('天線寶寶'); }
}
console.dir(Account);

const userAccount = new Account (); 
userAccount.name = 'Hello';

const b = {
	age: 1,
	__proto__: userAccount
};
// obj.constructor => 找到繼承哪個 constructor
console.log(userAccount.constructor);
console.log(b);

function Account2 () {
}

var userAccount2 = new Account2 ()
console.log(userAccount2);

const myFriends = {name: "Pete"};
console.dir(myFriends);
console.log(myFriends);
console.log(myFriends.toString());

function Plant () {
  this.country = "Mexico";
  this.isOrganic = true;
  this.func = function () {
    console.log(this.isOrganic, this.country);
  };
  this.func2 = function () {
    console.log(this.name, this.color);
  };
}

function Fruit (fruitName, fruitColor) {
  this.name = fruitName;
  this.color = fruitColor;
}

console.dir(Fruit);

// 原本是繼承 Object.prototype，但被洗掉了。但還是會繼承到，因為
// 所有的物件都是繼承 Object.prototype，此例指示改路徑而已
// Fruit -> Object.prototype
// 變成 Fruit -> Plant -> Object.prototype
Fruit.prototype = new Plant();

const aBanana = new Fruit('Banana', 'Yellow');
aBanana.func2();
// console.log(aBanana.func2);
// aBanana.func();
// const anApple = new Plant();
// anApple.func2();


let animal = {
  walk() {
    if (!this.isSleeping) {
      alert(`I walk`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: "White Rabbit",
  __proto__: animal
};

rabbit.sleep();

// alert(rabbit.isSleeping); // true
// alert(animal.isSleeping); // undefined (no such property in the prototype)

let head = {
  glasses: 1
};

let table = {
  __proto__: head,
  pen: 3
};

let bed = {
  __proto__: table,
  sheet: 1,
  pillow: 2
};

let pockets = {
  __proto__: bed,
  money: 2000
};

console.log(bed.glasses);



let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// This one found the food
speedy.eat("apple");
console.log( speedy.stomach ); // apple

// This one also has it, why? fix please.
console.log( lazy.stomach ); // apple
console.log(hamster.stomach);

const cat = {
  makeSound: function () { console.log(this.sound); }
};


// 用 new constructorName() 要確保被繼承的是 constructor
// 因為此例 cat 不是 constructor，所以會報錯
// Uncaught TypeError: cat is not a constructor
// const mark = new cat();

// 另一個方法就是 Object.create()
// 可以從一個非 constructor 繼承其 prototype 

const mark = Object.create(cat);
console.log(mark);
mark.sound = 'hello';
mark.makeSound();


