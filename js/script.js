document.addEventListener("DOMContentLoaded", function(){

    const submitForm = document.getElementById("form");

    function clearForm(){
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("year").value = "";
    }

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
        clearForm();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});