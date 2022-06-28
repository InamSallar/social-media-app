import Search from "./modules/search";
import Chat from "./modules/chat";
import registerationForm from "./modules/registerationForm";

if (document.querySelector("#registration-form")) {
    new registerationForm()
}

if (document.querySelector("#chat-wrapper")) {
    new Chat()
}

if (document.querySelector(".header-search-icon")) {
    new Search()
}
