// Your web app's Firebase configuration
var Config = {
  apiKey: "AIzaSyDekCxoDO6p9-my9412AgkttVg8rJUJbBw",
  authDomain: "fir-javascriptcrud-df58c.firebaseapp.com",
  databaseURL: "https://fir-javascriptcrud-df58c-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "fir-javascriptcrud-df58c",
  storageBucket: "fir-javascriptcrud-df58c.appspot.com",
  messagingSenderId: "355525907151",
  appId: "1:355525907151:web:1003b9cdfe98ee44ec9dba"
};

// Initialize Firebase
firebase.initializeApp(Config);

//setup variables
var db = firebase.database();
var reviews = document.getElementById("reviews");
var reviewsRef = db.ref("/reviews");

// user creates new or updates existing review
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault(); //prevet reloading



  Materialize.updateTextFields();

  var fullName = document.getElementById("fullName");
  var message = document.getElementById("message");
  var hiddenId = document.getElementById("hiddenId");

  var id = hiddenId.value || Date.now();

  db.ref("reviews/" + id).set({
    fullName: fullName.value,
    message: message.value,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });

  clearForm();
})

//when retrieving rviews from firebase to the web app
reviewsRef.on("child_added", data => {
  var li = document.createElement("li");
  li.id = data.key;
  li.innerHTML = reviewTemplate(data.val());
  reviews.appendChild(li);
});

reviews.addEventListener("click", e => {
  updateReview(e);
  deleteReview(e);
});

//Changes data on website in realtime when updated instead of page refresh
reviewsRef.on("child_changed", data => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
})
//removes deleted data in realtime
reviewsRef.on("child_removed", data => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
})

//delete review
function deleteReview(e) {
  var reviewNode = e.target.parentNode;

  if (e.target.classList.contains("delete")) {
    var id = reviewNode.id;
    db.ref("reviews/" + id).remove();
    clearForm();
  }
}

//update review
function updateReview(e) {
  var reviewNode = e.target.parentNode;

  if (e.target.classList.contains("edit")) {
    fullName.value = reviewNode.querySelector(".fullName").innerText;
    message.value = reviewNode.querySelector(".message").innerText;
    hiddenId.value = reviewNode.id;
    Materialize.updateTextFields();
  }
}



//template to output a review object in HTML
function reviewTemplate({ fullName, message, tags, createdAt }) {
  var createdAtFormatted = new Date(createdAt);

  return `
    <div>
        <label>Full Name:</label>
        <label class="fullName"><strong>${fullName}</strong></label>
    </div>
  
    <div>
        <label>Message:</label>
        <label class="message"><strong>${message}</strong></label>
    <br/>
    </div>
    <div>
        <label>Tags:</label>
        <label class="tags"><strong>${tags}</strong></label>
    <br/>
    </div>
    <div>
        <label>Created At:</label>
        <label class="createdAt"><strong>${createdAtFormatted}</strong></label>
    <br/>
    </div>
        <button class="waves-efffect waves-lighht btn delete">Delete</button>
        <button class="waves-efffect waves-lighht btn edit">Update</button>
    <br/>
    <br/>
    

    `;
}

function clearForm() {
  fullName.value = "";
  message.value = "";
  tags.value = "";
  hiddenId.value = "";
}