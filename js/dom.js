const UNCOMPLETED_LIST_BOOK_ID = "uncompleted";
const COMPLETED_LIST_BOOK_ID = "completed"; 
const BOOK_ITEMID = "itemId";

function addBook(){
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookYear = document.getElementById("year").value;

    const book = createBook(bookTitle, bookAuthor, bookYear, false);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, false);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBookList.append(book);
    updateDataToStorage();
}

function createBook(bookTitle, bookAuthor, bookYear, isCompleted){
    const cover = document.createElement("img");
    cover.setAttribute("src", "assets/coverbook.jpg");
    cover.setAttribute("alt", "coverbook");

    const bookImage = document.createElement("div");
    bookImage.classList.add("book-image");
    bookImage.append(cover);

    const title = document.createElement("h3");
    title.innerText = bookTitle;

    const author = document.createElement("p");
    author.innerHTML = `Penulis: <span>${bookAuthor}</span>`;

    const year = document.createElement("p");
    year.innerHTML = `Tahun: <span>${bookYear}</span>`;

    const bookDesc = document.createElement("div");
    bookDesc.classList.add("book-desc");
    bookDesc.append(title, author, year);

    const buttons = document.createElement("div");
    buttons.classList.add("button");

    if(isCompleted){
        buttons.classList.add("completed");
        buttons.append(
            createUncompletedButton(),
            createTrashButton()
        );
    }else{
        buttons.classList.add("uncompleted");
        buttons.append(
            createCompletedButton(),
            createTrashButton()
        );
    }

    const container = document.createElement("div");
    container.classList.add("book");
    container.append(bookImage,bookDesc,buttons);

    return container;
}

function createButton(buttonTypeClass , eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);

    if(button.classList.contains("completed-button")){
        button.setAttribute("title", "Selesai Dibaca");

        const iconCompleted = document.createElement("i");
        iconCompleted.classList.add("fas");
        iconCompleted.classList.add("fa-check");

        button.appendChild(iconCompleted);
    }else if(button.classList.contains("uncompleted-button")){
        button.setAttribute("title", "Belum Selesai Dibaca");

        const iconUncompleted = document.createElement("i");
        iconUncompleted.classList.add("fas");
        iconUncompleted.classList.add("fa-book-open");

        button.appendChild(iconUncompleted);
    }else if(button.classList.contains("trash-button")){
        button.setAttribute("title", "Hapus Buku");
    }
    
    button.addEventListener("click", function(event){
        eventListener(event);
    });

    return button;
}

function addBookToCompleted(bookElement){
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book-desc h3").innerText;
    const bookAuthor = bookElement.querySelector(".book-desc p:nth-child(2) span").innerText;
    const bookYear = bookElement.querySelector(".book-desc p:nth-child(3) span").innerText;

    const newBook = createBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function createCompletedButton(){
    return createButton("completed-button", function(){
        addBookToCompleted(document.querySelector("#uncompleted .book"));
    });
}

function undoBookFromCompleted(bookElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book-desc h3").innerText;
    const bookAuthor = bookElement.querySelector(".book-desc p:nth-child(2) span").innerText;
    const bookYear = bookElement.querySelector(".book-desc p:nth-child(3) span").innerText;

    const newBook = createBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function createUncompletedButton(){
    return createButton("uncompleted-button", function(){
        undoBookFromCompleted(document.querySelector("#completed .book"));
    });
}

function removeBookFromCompleted(bookElement){
    const target = bookElement;
    const book = target.parentElement;
    const bookPosition = findBookIndex(book[BOOK_ITEMID]);

    Swal.fire({
        title: "Apakah anda ingin menghapus buku?",
        text: "",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Iya",
        denyButtonText: "Tidak",
        showCancelButton: false
    }).then((result) => {
        if(result.value){
            if(target.classList.contains("uncompleted")){
                books.splice(bookPosition, 1)
                book.remove();
                updateDataToStorage();
            }else if(target.classList.contains("completed")){
                books.splice(bookPosition, 1)
                book.remove();
                updateDataToStorage();
            }
            Swal.fire(
                "Deleted!",
                "Buku Berhasil di Hapus",
                "success"
            )
        }
    })
}

function createTrashButton(){
    return createButton("trash-button", function(event){
        removeBookFromCompleted(event.target.parentElement);
    });
}

const searchBook = document.getElementById("searchbook");

searchBook.addEventListener("keyup", function(e){
    const searchBook = e.target.value.toLowerCase();
    const books = document.querySelectorAll(".book");

    books.forEach((book) => {
        const bookDesc = book.childNodes[1];
        const bookTitle = bookDesc.firstChild.textContent.toLowerCase();

        if(bookTitle.indexOf(searchBook) != -1){
            book.setAttribute("style", "display: flex;");
        }else{
            book.setAttribute("style", "display: none !important;");
        }
    });
});