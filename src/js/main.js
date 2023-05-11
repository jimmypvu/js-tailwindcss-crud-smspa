//form input and rendered post container elements
let postForm = document.getElementById("postForm");
let postInput = document.getElementById("postInput");
let postsContainer = document.getElementById("posts");

//form submit event listener and form validation
postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    validateForm();
});

let validateForm = () => {
    let postError = document.getElementById("postFormErrorMessage");

    if(postInput.value.trim() == ""){
        postError.innerText = "Post can't be blank!";
    }else{
        acceptFormData();
        renderPosts(postsData);
        postError.innerText = "";
        //resize create post textarea back to original
        // postInput.style = "";
    }
}

//get new post / input field data and store in new post object, push object to postsData array in posts.js, save posts data in local storage for now until db layer is added
let acceptFormData = () => {
    //create new post object
    let newPost = {post_id: generatePostId(), text: postInput.value, likes: 0, created_on: getTimestamp(), edited_on: null};

    //add to postsData array and reset input value
    postsData.push(newPost);
    postInput.value = "";

    //store updated postsData array in localstorage
    localStorage.setItem("posts", JSON.stringify(postsData));
}

//render all posts in postsData to page
let renderPosts = (postsData) => {
    //clear existing html in posts container
    postsContainer.innerHTML = "";

    //loop through each post item in posts array and append post html to postsContainer
    postsData.forEach((post, index) => {
        //dynamically add spacing if first post in array to offset flex-col-reverse
        let firstPostMargin = index === 0 ? "mt-8" : "";
        //lg:w-[14rem] w-3/4 on comment input
        let postHTML = `
        <div class="flex flex-col justify-between space-y-3 p-2.5 border-green-700 border-2 rounded-[0.25rem] ${firstPostMargin} sm:min-w-full sm:w-80">
            <div class="lg:flex justify-between items-center">
                <div class="flex space-x-3 lg:justify-between justify-start items-center">
                    <h3 class="text-base text-slate-200 font-semibold brand-font">DefinitelyNotElon2</h3>
                    <img src="img/elon.webp" class="h-7 w-7 rounded-[0.25rem] object-cover"/>
                </div>
                <p class="text-xs text-slate-300 font-light italic">${post.created_on}</p>
            </div>
            <p name="postBody" class="text-sm text-slate-100 max-w-sm long-string-wrap pl-1"></p>
            <span name="editValidationMessage" class="text-xs text-red-600 px-1"></span>
            <div class="flex justify-between space-x-4 text-base text-slate-100 border-t-[1px] border-slate-100 pt-3 items-center pb-1">
                <div class="flex justify-between space-x-6">
                    <i name="like" class="fas fa-heart hover:text-green-700 hover:cursor-pointer"></i>
                    <i name="repost" class="fas fa-recycle hover:text-green-700 hover:cursor-pointer"></i>
                    <i name="viewComments" class="fas fa-comment hover:text-green-700 hover:cursor-pointer"></i>
                </div>
                <input name="commentInput" type="text" placeholder="Add a comment                   &#9166" class="h-6 w-[14rem] sm:hidden focus:outline-none text-neutral-900 text-sm pl-2 rounded-[0.25rem]" />
                <i id="edit" onclick="editPost(this)" class="fa-solid fa-pen-to-square hover:text-green-700 hover:cursor-pointer"></i>
                <i id="delete" onclick="deletePost(this)" class="fas fa-trash hover:text-neutral-600 hover:cursor-pointer"></i>
            </div>
        </div>
        `;

        //sanitize input text before rendering to dom to prevent html from being rendered / xss attacks
        let sanitizedInput = DOMPurify.sanitize(post.text, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx|mms|ftp|ssh|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
            ALLOW_DATA_ATTR: false,
            ALLOW_UNKNOWN_PROTOCOLS: false,
            KEEP_CONTENT: true,
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM: false,
            RETURN_TRUSTED_TYPE: false,
            WHOLE_DOCUMENT: false,
            SAFE_FOR_TEMPLATES: true,
            FORBID_TAGS: ["script", "style"],
            FORBID_ATTR: ["style", "on*"],
            FORCE_BODY: false,
            SANITIZE_DOM: true,
        });

        //can't directly concatenate post html to postsContainer innerHTML or you can render added html from the text input, create a new div element, set textContent instead of innerHTML to the post's 'text' value, and append the resulting child of the new container ele
        let postContainer = document.createElement("div");
        postContainer.innerHTML = postHTML.trim();
        postContainer.querySelector("[name='postBody']").textContent = sanitizedInput;
        postsContainer.append(postContainer.firstChild);
    })
}

let getTimestamp = () => {
    let now = new Date();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let day = days[now.getDay()];
    let month = now.toLocaleString("default", {month: "numeric"});
    let date = now.toLocaleString("en-us", {day: "numeric"});
    let year = now.toLocaleString("default", {year: "2-digit"});
    let time = now.toLocaleString("en-us", {hour: "numeric", minute: "numeric", hour12: true}).toLowerCase().replace(" ", "");
    
    return `${month}/${date}/${year}, ${day} at ${time}`;
}

let generatePostId = () => {
    let timestamp = Date.now();
    let random = Math.floor(Math.random() * 100000);
    return `${timestamp}-${random}`
}

//event listener to resize textarea input for create post
// postInput.addEventListener("input", () => {
//     postInput.style.height = "auto";
//     postInput.style.minHeight = "6rem";
//     postInput.style.height = `${postInput.scrollHeight/16}rem`;
// });

//on page load check for any existing/saved posts and load posts if any
window.onload = () => {
    let savedPostsData = localStorage.getItem("posts");
    if (savedPostsData) {
      postsData = JSON.parse(savedPostsData);
    }
    renderPosts(postsData);
}

//delete a post
let deletePost = (e) => {
    let post = e.parentElement.parentElement;
    let postIndex = Array.from(postsContainer.children).indexOf(post);
    postsData.splice(postIndex, 1);
    post.remove();
    localStorage.setItem("posts", JSON.stringify(postsData));
    renderPosts(postsData);
}

//edit a post
let editPost = (e) => {
    let post = e.parentElement.parentElement; 
    let postBody = post.querySelector("p[name='postBody']");

    let textareaEdit = document.createElement("textarea");
    textareaEdit.value = postBody.innerText;
    textareaEdit.className = "scrollbar-hide resize-none focus:outline-none rounded-[0.25rem] text-sm text-neutral-900 p-2";
    textareaEdit.rows = postBody.clientHeight/20;
    textareaEdit.cols = postBody.clientWidth/10;
    // textareaEdit.style.height = `${postBody.clientHeight/16}rem`;
    textareaEdit.setAttribute("maxlength", "420");
    textareaEdit.name = "editBox";

    // event listener for input event, resize textarea as user inputs more/less text
    textareaEdit.addEventListener("input", () => {
        textareaEdit.style.height = "auto";
        textareaEdit.style.height = `${textareaEdit.scrollHeight}px`;
    });

    postBody.replaceWith(textareaEdit);

    textareaEdit.focus();
    textareaEdit.selectionStart = textareaEdit.selectionEnd;

    //change edit & delete icons and onclick to confirm and discard icons and confirmEdit/discardEdit onclick
    toggleEditDeleteIcons(post);
}

let toggleEditDeleteIcons = (post) => {
    let editIcon = post.querySelector("#edit");
    let deleteIcon = post.querySelector("#delete");

    if(editIcon.getAttribute("onclick") === "editPost(this)"){
        editIcon.className = "fa-solid fa-check hover:text-green-700 hover:cursor-pointer";
        deleteIcon.className = "fa-solid fa-xmark hover:text-red-600 hover:cursor-pointer";
        editIcon.setAttribute("onclick", "confirmEdit(this)");
        deleteIcon.setAttribute("onclick", "discardEdit(this)");
    }else{
        editIcon.className = "fa-solid fa-pen-to-square hover:text-green-700 hover:cursor-pointer";
        deleteIcon.className = "fas fa-trash hover:text-neutral-600 hover:cursor-pointer";
        editIcon.setAttribute("onclick", "editPost(this)");
        deleteIcon.setAttribute("onclick", "deletePost(this)");
    }
}

let confirmEdit = (e) => {
    // console.log("Edit approved")
    let post = e.parentElement.parentElement;
    let edit = post.querySelector("textarea[name='editBox']");

    if(validateEdit(edit)){
        let postEle = document.createElement("p");
        postEle.setAttribute("name", "postBody");
        postEle.className = "text-sm text-slate-100 max-w-sm long-string-wrap pl-1";
        postEle.innerText = edit.value.trim();

        edit.replaceWith(postEle);
        // console.log(postEle.innerHTML)

        //update post values for post object in postsData array and save to localstorage after successful edit
        let postIndex = Array.from(postsContainer.children).indexOf(post);
        postsData[postIndex].text = edit.value;
        postsData[postIndex].edited_on = getTimestamp();
        localStorage.setItem("posts", JSON.stringify(postsData));

        //update edit & delete icons and onclick
        toggleEditDeleteIcons(post);
    };
}

let validateEdit = (edit) => {
    let post = edit.parentElement;
    let editBody = post.querySelector("textarea[name='editBox']")
    let editMessage = post.querySelector("span[name='editValidationMessage']")

    if(editBody.value.trim() == ""){
        // console.log("edit cannot be blank")
        editMessage.innerText = "Edit cannot be blank"
        editBody.focus();
        editBody.selectionStart = editBody.selectionEnd
        return false;
    }else{
        // console.log("valid edit")
        editMessage.innerText = "";
        return true;
    }
}

let discardEdit = (edit) => {
    // console.log("edit discarded")
    let post = edit.parentElement.parentElement;
    let editEle = post.querySelector("textarea[name='editBox']");
    let postIndex = Array.from(postsContainer.children).indexOf(post);
    let editMessage = post.querySelector("span[name='editValidationMessage']")

    let postEle = document.createElement("p");
    postEle.setAttribute("name", "postBody");
    postEle.className = "text-sm text-slate-100 max-w-sm long-string-wrap pl-1";
    postEle.innerText = postsData[postIndex].text;

    editEle.replaceWith(postEle);
    // console.log(postEle.innerHTML)

    //reset edit & delete icons
    toggleEditDeleteIcons(post);

    editMessage.innerText = "";
}


//create new post element with template literal getting value from data object and append to posts container (moved to renderPosts() method)
// let newPostData = {};
// let createPost = () => {
//     postsContainer.innerHTML +=

//     `<div class="flex flex-col justify-between space-y-3 p-2.5 border-green-700 border-2 rounded-[0.25rem] ${postsContainer.childElementCount === 0 ? 'mt-8' : ''}">
//         <div class="flex justify-between items-center">
//             <div class="flex space-x-3 justify-between items-center">
//                 <h3 class="text-base text-slate-200 font-semibold brand-font">DefinitelyNotElon2</h3>
//                 <img src="img/elon.webp" class="h-7 w-7 rounded-[0.25rem] object-cover"/>
//             </div>
//             <p class="text-xs text-slate-300 font-light italic">${getTimestamp()}</p>
//         </div>
//         <p name="postBody" class="text-sm text-slate-100 max-w-sm long-string-wrap pl-1">${newPostData.text}</p>
//         <span name="editValidationMessage" class="text-xs text-red-600 px-1"></span>
//         <div class="flex justify-between space-x-4 text-base text-slate-100 border-t-[1px] border-slate-100 pt-3 items-center pb-1">
//             <div class="flex justify-between space-x-6">
//                 <i name="like" class="fas fa-heart hover:text-green-700 hover:cursor-pointer"></i>
//                 <i name="repost" class="fas fa-recycle hover:text-green-700 hover:cursor-pointer"></i>
//                 <i name="viewComments" class="fas fa-comment hover:text-green-700 hover:cursor-pointer"></i>
//             </div>
//             <input name="commentInput" type="text" placeholder="Add a comment                       &#9166" class="h-6 w-[14rem] focus:outline-none text-neutral-900 text-sm pl-2 rounded-[0.25rem]" />
//             <i id="edit" onclick="editPost(this)" class="fa-solid fa-pen-to-square hover:text-green-700 hover:cursor-pointer"></i>
//             <i id="delete" onclick="deletePost(this)" class="fas fa-trash hover:text-neutral-600 hover:cursor-pointer"></i>
//         </div>
//     </div>`;

//     postInput.value = "";
// }