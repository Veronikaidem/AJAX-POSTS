let mainWraperPost = document.getElementById("post-wraperBlock");
let postOverlay = document.getElementById("overlay");
let overlayContent = document.getElementById("postcontent");
let overlayClose = document.getElementById("close");
let postAdd = document.getElementById('add');
let addOverlay=  document.getElementById('postoverlayAdd');
let forms = document.getElementById('form');
let input = document.getElementById('title');



//მთავარი ფუნქცია, რომლითაც სრულდება აჯაქს მოთხოვნა სერვერზე
function ajax(url, callback) {
  let requistPost = new XMLHttpRequest();
  requistPost.open("GET", url);
  requistPost.addEventListener("load", function () {
    // let response = requistPost.responseText;
    // let dataResponse = JSON.parse(response);
    let dataResponse = JSON.parse(requistPost.responseText);
    callback(dataResponse);
  });
  requistPost.send();
}

// ამ ფუნქციით იქმნება სათითაო დივი
function createPostRenderLogic(item) {
  const divWraper = document.createElement("div");
  divWraper.classList.add("posts");
  divWraper.setAttribute("data-id", item.id);

  const h3Post = document.createElement("h3");
  h3Post.innerText = item.id;

  const h2Post = document.createElement("h2");
  h2Post.innerText = item.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete This Post";
  deleteButton.setAttribute("data-id", item.id);

  divWraper.appendChild(h3Post);
  divWraper.appendChild(h2Post);
  divWraper.appendChild(deleteButton);

  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const id = event.target.getAttribute("data-id");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    fetch(url, {
      method: "DELETE",
    })
    .then( ()=> divWraper.remove());
   
  });

  divWraper.addEventListener("click", function (event) {
    const id = event.target.getAttribute("data-id");
    postOverlay.classList.add("activeOverlay");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(url, function () {
      let p = document.createElement("p");
      p.innerText = item.body;
      overlayContent.appendChild(p);
    });
  });

  mainWraperPost.appendChild(divWraper);
}



//პოსტის დამატება===========
postAdd.addEventListener('click', function(){
    addOverlay.classList.add('activeAdd');
    input.value = ' ';
    
})

forms.addEventListener('submit', function(event){
    event.preventDefault();
    let formData = {
        title: event.target[0].value
    }
    fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((newPost) => {
    createPostRenderLogic(newPost);
    addOverlay.classList.remove('activeAdd');
  });
});

// დახურვა პოპაპის
overlayClose.addEventListener("click", function () {
  postOverlay.classList.remove("activeOverlay");
  overlayContent.innerHTML = " ";
});




// მთავარი ფუნქციის გამოძახება აჯაქს
ajax("https://jsonplaceholder.typicode.com/posts", function (dataResponse) {
  dataResponse.forEach((item) => {
    createPostRenderLogic(item);
  });
});



