const showcase = document.querySelector(".showcase");
const add_to_cart = document.querySelector(".book_btn");
const load_more = document.querySelector(".showcase_btn");
const category_list = document.querySelector(".categories_list");
const cart = document.querySelector(".cart");
const start_category = document.querySelector('.categories_btn_active').textContent;


let books = [];

function Book(id, cover, authors, title, raiting, count, description, price) {
	this.id = id;
	this.cover = cover;
	this.authors = authors;
	this.title = title;
	this.raiting = raiting;
	this.count = count;
	this.description = description;
	this.price = price
}

Book.prototype.render = function () {};
let id = 0;
let index = 0;
let category = start_category;

function getBooks() {
	fetch(`https://www.googleapis.com/books/v1/volumes?q=${category}&key=AIzaSyA33u6Vy5_rE0bumpGmDcUllKBefScJ66E&printType=books&index=${index}&maxResults=6&langRestrict=en`).then((
    	response=>response.json()
    )).then((
       	data=>{
       		data.items.forEach((item=>{
	       		++id;
				let cover = item.volumeInfo.imageLinks?.thumbnail;
				let authors = item.volumeInfo.authors?.join(", ");
				let title = item.volumeInfo.title??"No title available";
				let raiting = item.volumeInfo.averageRating??"No rating available";
				let count = item.volumeInfo.ratingsCount??"0";
				let description = item.volumeInfo.description??"No description available";
				let price = item.saleInfo?.retailPrice?.amount;
				let book = new Book(id, cover, authors, title, raiting, count, description, price);

				book.render();
				books.push(book);
				let raitingHtml="";

				for(let i=0;i<Math.round(book.raiting);i++){
					raitingHtml+='<span class="raiting">&#9733;</span>'
				}
				for(let i=Math.round(book.raiting);i<5;i++){
					raitingHtml+='<span class="raiting">&#9734;</span>'
				}
				let bookHtml=`\n<div id="book-${book.id}" class="book">\n<img class="book_img" src="${book.cover}" alt="book"/>\n<div class="book_main-text">\n${book.authors?`<p class="book_authors">${book.authors}</p>`:""}\n${book.title?`<p class="book_title">${book.title}</p>`:""}\n${raitingHtml&&book.count?`<p class="book_raiting">${raitingHtml}, ${book.count} review</p>`:""}\n${book.description?`<p class="book_info">${book.description}</p>`:""}\n${book.price?`<p class="book_price">${book.price} RUB</p>`:`<p class="book_price">No price available</p>`}\n<button class="book_btn">buy now</button>\n</div>\n</div>\n`;
				showcase.insertAdjacentHTML("beforeEnd",bookHtml)
			}))
       	}
    )).catch((error=>{
	    console.error(error)
	}))
}

load_more.addEventListener("click",(()=>{index+=6}));
getBooks();
load_more.addEventListener("click",getBooks);

category_list.addEventListener("click",(event=>{
	if(event.target.classList.contains("categories_btn")){
		document.querySelector(".categories_btn_active").classList.remove("categories_btn_active");
		showcase.innerHTML="";
		category=event.target.textContent;
		index=0}event.target.classList.add("categories_btn_active");
		category=event.target.textContent;
		getBooks();
		showcase.innerHTML="";
	}
));

showcase.addEventListener("click",(event=>{
	if(event.target.classList.contains("book_btn")){
		if(event.target.classList.contains("book_btn_active")){
			event.target.innerHTML="buy now"
		}
		else{
			event.target.innerHTML="in the cart"
		}
		event.target.classList.toggle("book_btn_active")
	}
}));

let count=0;

showcase.addEventListener("click",(event=>{
	if(event.target.classList.contains("book_btn_active")){
		count+=1;
		if(count>localStorage.getItem("cartCount")){
			localStorage.setItem("cartCount",count)
		}
		const cartCount=`<div class='count'>${count}</div>`;
		cart.insertAdjacentHTML("beforeEnd",cartCount)
	}
	else if(event.target.classList.contains("book_btn")){
		if(count>0){
			count-=1;
			let cartItems=document.querySelectorAll(".count");
			let lastItem=cartItems[cartItems.length-1];
			lastItem.remove()
		}
	}
}));