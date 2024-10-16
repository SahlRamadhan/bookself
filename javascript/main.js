// variable untuk menyimpan data
const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];
let isEditing = false;
let editingBookId = null;

// varibale untuk menampung data
const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBook = document.getElementById("searchBook");

// event listener untuk memuat data
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem(STORAGE_KEY)) {
    books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  renderBooks();
});

// event listener untuk menambahkan buku
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (isEditing) {
    const bookIndex = books.findIndex((b) => b.id === editingBookId);
    if (bookIndex !== -1) {
      books[bookIndex].title = title;
      books[bookIndex].author = author;
      books[bookIndex].year = year;
      books[bookIndex].isComplete = isComplete;
    }
    isEditing = false;
    editingBookId = null;
    showSnackbar("Buku telah berhasil diedit!", "#4caf50");
  } else {
    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(book);
    if (isComplete) {
      showSnackbar("Buku telah berhasil dimasukkan ke rak selesai dibaca!", "#2196F3");
    } else {
      showSnackbar("Buku telah berhasil dimasukkan ke rak belum dibaca!", "#4caf50");
    }
  }

  saveBooks();
  renderBooks();
  bookForm.reset();
});

// fungsi untuk menampilkan semua buku
function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// fungsi untuk membuat elemen buku
function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  const titleElement = document.createElement("h3");
  titleElement.setAttribute("data-testid", "bookItemTitle");
  titleElement.textContent = book.title;

  const authorElement = document.createElement("p");
  authorElement.setAttribute("data-testid", "bookItemAuthor");
  authorElement.textContent = `Penulis: ${book.author}`;

  const yearElement = document.createElement("p");
  yearElement.setAttribute("data-testid", "bookItemYear");
  yearElement.textContent = `Tahun: ${book.year}`;

  const actionDiv = document.createElement("div");

  // Tombol selesai
  const toggleCompleteButton = document.createElement("button");
  toggleCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleCompleteButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleCompleteButton.addEventListener("click", () => toggleCompleteStatus(book.id));

  // tombol hapus
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  actionDiv.appendChild(toggleCompleteButton);
  actionDiv.appendChild(deleteButton);

  // Tombol edit
  if (!book.isComplete) {
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => editBook(book.id));
    actionDiv.appendChild(editButton);
  }

  bookItem.appendChild(titleElement);
  bookItem.appendChild(authorElement);
  bookItem.appendChild(yearElement);
  bookItem.appendChild(actionDiv);

  return bookItem;
}

// fungsi untuk mengubah status
function toggleCompleteStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
    showSnackbar(book.isComplete ? "Buku selesai dibaca!" : "Buku belum selesai dibaca!", "#2196F3");
  }
}

// fungsi untuk menghapus buku
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
  showSnackbar("Buku telah berhasil dihapus!", "#f44336");
}

// fungsi untuk mengedit buku
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
    isEditing = true;
    editingBookId = bookId;
    showSnackbar("Silakan edit buku!", "#ff9800");
  }
}

// fungsi menyimpan data ke localStorage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Fungsi untuk menapilkan pesan notifikasi
function showSnackbar(message, color) {
  const snackbar = document.createElement("div");
  snackbar.className = "snackbar";
  snackbar.style.backgroundColor = color;
  snackbar.textContent = message;
  document.body.appendChild(snackbar);

  setTimeout(() => {
    snackbar.classList.add("show");
  }, 100);

  setTimeout(() => {
    snackbar.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(snackbar);
    }, 300);
  }, 3000);
}

// event listener untuk mencari buku
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";
  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});
