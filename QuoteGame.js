/* Greg Conan
   Quote List Game
   Created 2019-03-12
   Updated 2024-12-21 */


/* TODO
 * Instead of showing all buttons in quotePool, add the correct 1 and
   3+ others randomly selected from quotePool?
 */

// import gfaQuotes from "./gfa_quotes.json" assert {type: "json"}

/* Global constants: File path of quote list, default list of people to
   randomly select quotes from, random joke API, and OAuth comment scrips */
const MY_USERNAME = "";
const QUOTES_FILE = "./names.json";  // "gfa_quotes.txt";
// const INITIAL_QUOTE_POOL = ["first1 last1", "first2 last2", ... "firstN lastN"]
const JOKE_API_URL = "https://official-joke-api.appspot.com/random_joke";
const OAUTH_BASE = "http://web.cs.georgefox.edu/comment/" + MY_USERNAME;

/* Functions below are in the following order:
1. Startup
2. In-game functionality
3. Helper tools
4. Authentication
5. Comment system
*/


/* ==============================================================
  1. Startup functions
============================================================== */

/* On page load:
* Build & fill arrays of quotes and names, then store them in sessionStorage
* Add buttons and checkboxes for each person, then hide buttons
* Check if user is logged in
* Add all comments to page
*/
function startup() {
   
   // Reset, and add all quotes to, sessionStorage
   window.sessionStorage.clear();

   collectQuotesFrom(QUOTES_FILE);
   // storage.people = Object.keys(rawQuotes)
   
   // Add every person's button and checkbox
   let storage = window.sessionStorage
   let people = Object.keys(storage)
   storage.people = '["' + people.join('","') + '"]';
   for (let i = 0; i < people.length; i++) {
	   addButtonAndCheckboxOf(people[i]);
   }

   resetScoreAndQuotePool();
   
   // Start the game
   getQuote();

   // console.log(gfaQuotes);
   // loadQuotesIntoStorageFrom(QUOTES_FILE);
   
   // Check if user is logged in
   // checkLoggedIn();
   
   // Add all previously posted comments to page
   // getAllComments();
} // startup


function collectQuotesFrom(filePath) {
	fetch(filePath).then((response) => response.json())
	.then((json) => processAndStoreQuotes(json));
}


function readTextFile1(file) {
   var rawFile = new XMLHttpRequest();
   rawFile.open("GET", file, false);
   rawFile.onreadystatechange = function () {
	 if(rawFile.readyState === 4)  {
	   if(rawFile.status === 200 || rawFile.status == 0) {
		 var allText = rawFile.responseText;
		}
	 }
   }
   rawFile.send(null);
} // https://stackoverflow.com/a/14446538/21206695


function readTextFile2(file) {
	let fr = new FileReader();
	fr.onload = function () {
		return fr.result;
	}
	storage.setItem("inputFileText", fr.readAsText(file));
}

// Use Ajax to get text from filePath and send it to processAndStoreQuotes
function loadQuotesIntoStorageFrom(filePath) {
   
   // Local variable: File request objects
   var fileRequest = new XMLHttpRequest();
   
   // Request should send its responseText to processAndStoreQuotes
   fileRequest.onreadystatechange = function() {
		if (this.readyState === 4 && (this.status === 200 ||
									  this.status === 0)) {
			processAndStoreQuotes(this.responseText);
		}
   };
   
   // Send request
   fileRequest.open("GET", filePath, true);
   fileRequest.send();

   // processAndStoreQuotes(readTextFile2(filePath));
} // loadQuotesIntoStorageFrom


/* Process quotes and save them to sessionStorage
* Then, if page isn't finished loading, call finishStartup
*/
function processAndStoreQuotes(rawQuotes) {
   
   // Local variables
   let storage = window.sessionStorage;      // sessionStorage alias
   storage.quotePool = JSON.stringify(rawQuotes)
   storage.people = JSON.stringify(Object.keys(rawQuotes))
   
   for (let eachName in rawQuotes) { // [name, values] in Object.entries(rawQuotes)) {
	   // innerArray = outerArray[i].split("**");
	   let values = rawQuotes[eachName];
	   storage.setItem(eachName, stringifyList(values));
   }
   
   // If page isn't finished loading, finish loading it
   // if (storage.people === undefined) { finishStartup(); }
   finishStartup()
} // processAndStoreQuotes


function stringifyList(aList) {
	return '["' + aList.join('","') + '"]';
}


/* After quotes have been loaded and saved in sessionStorage:
* Build, fill, and store array of names
* Add buttons and checkboxes for each person, then hide buttons
*/
function finishStartup() {
   
   // Local variables
   var storage = window.sessionStorage; // sessionStorage alias
   var people = JSON.parse(storage.people);        // Local list of all person names
   
   // Store all person names
   // people = Object.keys(storage);
   // console.log("People")
   // console.log(people)
   // storage.people = JSON.stringify(people);

   resetScoreAndQuotePool();
   
   // Add every person's button and checkbox
   for (var i = 0; i < people.length; i++) {
	   addButtonAndCheckboxOf(people[i]);
   }
   
   // Start the game
   getQuote();
} // finishStartup


// Set score to zero and quotePool to its default
function resetScoreAndQuotePool() {
   
   // Local variable: sessionStorage alias
   var storage = window.sessionStorage;
   
   // Add variables to storage: # of correct and incorrect answers
   storage.correctAnswers = "0";
   storage.incorrectAnswers = "0";	
   
   // Fill array of people whose quotes to initially include in quotePool
   // storage.quotePool = storage.people // INITIAL_QUOTE_POOL;
} // resetScoreAndQuotePool


// Add each person's button and checkbox, with functionality, to page
function addButtonAndCheckboxOf(person) {
   
   // Create DOM object of person's button and checkbox to add to page
   var newButton = document.createElement("BUTTON");
   var newCheckBox = document.createElement("LABEL");
   
   // Add button's functionality
   newButton.id = person;
   newButton.innerHTML = person;
   newButton.addEventListener("click", function(){
	   
	   // Add event listener to run clicked(person's checkbox id) onclick
	   clicked(this.id);
   })
   
   // Add checkbox's functionality
   newCheckBox.id = "label " + person;
   newCheckBox.innerHTML =
   
	   // In person's label, add checkbox which runs checkedName onclick
	   "<input type = 'checkbox' class = 'allCheckboxes' id = 'checkbox " +
	   person + "' onclick = 'checkedName(this.id);'>" + person + "</input>";
   
   // Add button and checkbox to page
   document.getElementById("activePeople").appendChild(newButton);
   document.getElementById("checkboxes").appendChild(newCheckBox);
   
   resetButtonAndCheckboxOf(person);
} // addButtonAndCheckboxOf


/* If person is in initial quotePool, check person's checkbox;
  otherwise, hide person's button */
function resetButtonAndCheckboxOf(person) {
   personButton = document.getElementById(person);
   if (sessionStorage.quotePool.includes(person)) {
	   document.getElementById("checkbox " + person).checked = true;
	   personButton.style = "display: block";
   } else {
	   personButton.style = "display: none";
   }
} // resetButtonAndCheckboxOf


/* ==============================================================
  2. In-game functions
============================================================== */

// Randomly select quote and add it to the page
function getQuote() {
   
   // Local variables
   var storage = window.sessionStorage;            // sessionStorage alias
   console.log(storage.quotePool)
   console.log(JSON.parse(storage.quotePool))
   var quotePool = JSON.parse(storage.quotePool); // quotePool array
   var loopDone = false; // Flag so do-while loop does not repeat infinitely
   let people = Object.keys(quotePool)
   var person;          // Randomly selected person
   var personQuotes;   // Quotes belonging to randomly selected person
   
   // Randomly select a person to get a quote from
   do {
	   
	   // Randomly select person to get quote from, and get person's quotes
	   person = people[randInt(0, people.length)];
	   personQuotes = JSON.parse(storage.getItem(person));
	   
	   /* If person has no more quotes, then remove person from quotePool,
		  remove person's button, remove quote, & uncheck person's checkbox */
	   if (personQuotes !== null && personQuotes.length === 0) {
		   quotePool = removeFromStorage(person, "quotePool", quotePool, storage);
		   document.getElementById(person).style = "display: none";
		   document.getElementById("checkbox " + person).checked = false;
	   }
	   
	   // If quotePool is empty, stop looking for new quotes to select
	   if (quotePool.length === 0) {
		   loopDone = true;
	   }
	   
   // If quotes are left from people selected, randomly select 1 from those
   } while (!loopDone && (person === undefined || personQuotes.length === 0));
   
   // If person has quotes left, randomly select one and use it
   if (personQuotes !== null && personQuotes.length > 0) {
	   
	   // Randomly select quote from person, then write it to page
	   quote = personQuotes[randInt(0, personQuotes.length)];
	   document.getElementById("quote").innerHTML = quote;
	   
	   // The name of the person who said the quote is the right answer
	   storage.rightAnswer = person;
	   console.log("Answer: " + person);
	   
	   // Remove quote from list in sessionStorage
	   removeFromStorage(quote, person, personQuotes, storage);
   
   // Otherwise, hide person's quote
   } else {
	   document.getElementById("quote").innerHTML = "";
   }
} // getQuote


// Whenever a person's name button is clicked, check if answer is correct
function clicked(personName) {
   
   // Local variables
   var storage = window.sessionStorage; // sessionStorage alias
   var score;                          // Number of right, or wrong, answers
   var showCorrectness =              // DOM object to show correctness
	   document.getElementById("correctness"); 
   
   // If there is no quote to check, do nothing; otherwise:
   if (document.getElementById("quote").innerHTML) {
	   
	   /* If clicked button was name of person who said quote,
		  then tell user so, and get a new quote */
	   if (personName === storage.rightAnswer) {
		   showCorrectness.innerHTML = "Correct!";
		   document.getElementById("scoreSection").style
			   = "background-color: #72e500;";
		   showCorrectness.style = "background-color: #72e500;";
		   score = parseInt(storage.correctAnswers);
		   storage.setItem("correctAnswers", ++score);
		   getQuote();
	   
	   // Otherwise, tell user so
	   } else {
		   showCorrectness.innerHTML = "Incorrect.";
		   showCorrectness.style = "background-color: red;";
		   document.getElementById("scoreSection").style
			   = "background-color: red;";
		   score = parseInt(storage.incorrectAnswers);
		   storage.setItem("incorrectAnswers", ++score);
	   }
	   
	   updateScore();
   }
} // clicked


// Calculate current score and display it to user
function updateScore() {
   
   // Local variables
   var storage = window.sessionStorage;              // sessionStorage alias
   var wrongs = parseInt(storage.incorrectAnswers); // # of incorrect answers
   var rights = parseInt(storage.correctAnswers);  // # of correct answers
   var score = document.getElementById("score");  // Score display DOM object
   
   // Calculate and show score
   score.innerHTML = "Score: " + rights + " out of " + (rights + wrongs) +
	   " (" + (rights/(rights + wrongs) * 100).toFixed(0) + "%)";
} // updateScore


// Update buttons & quote pool when a person's name checkbox is (un)checked
function checkedName(checkboxID) {
   
   // Local variables
   var storage = window.sessionStorage;            // sessionStorage alias
   var quotePool = JSON.parse(storage.quotePool); // quotePool array
   var person = checkboxID.substring(9);         // Name of person
   var personPos;                               // person's quotePool position
   
   /* If person's name is checked and person has quotes left, then add
   person's name to quote pool, show person's button, and deselect "Select
   None" button; if person has no quotes left, then tell user so */
   if (document.getElementById(checkboxID).checked) {
	   if (storage.getItem(person) === "[]") {
		   alert("Sorry, " + person + " has no more quotes.");
		   document.getElementById(checkboxID).checked = false;
	   } else {
		   quotePool.push(person);
		   document.getElementById(person).style = "display: block";
		   document.getElementById("deselectAll").checked = false;
	   }
	   
   /* If person's name is unchecked, then remove it from the quote pool, and
   uncheck Select All button */
   } else {
	   document.getElementById("selectAll").checked = false;
	   
	   // Get index of person in quotePool
	   personPos = findEl(person, 0, quotePool);
	   
	   // If person is found in quotePool, remove that person
	   if (personPos !== -1) {
		   
		   // Remove person's button
		   document.getElementById(person).style = "display: none";
		   
		   // Remove person's name from quotePool
		   quotePool.splice(personPos, 1);
		   
	   // Otherwise, send an error message
	   } else {
		   alert("Error: Person not in quotePool");
	   }
   }
   
   // Update stored quotePool with recent changes to local quotePool
   storage.quotePool = JSON.stringify(quotePool);
} // checkedName


// Select every checkbox
function selectAll() {
   
   // Local variables: alias for sessionStorage and array of everyone's names
   var storage = window.sessionStorage;
   var people = JSON.parse(storage.people);
   
   // Select every checkbox, show all buttons, and add all names to quotePool
   for (var i = 0; i < people.length; i++) {
	   document.getElementById("checkbox " + people[i]).checked = true;
	   document.getElementById(people[i]).style = "display: block";
	   people[i] = "\"" + people[i] + "\"";
   }
   storage.setItem("quotePool", "[" + people.toString() + "]");
   
   // Uncheck "Select None" button
   document.getElementById("deselectAll").checked = false;
} // selectAll


// Deselect every checkbox
function deselectAll() {
	   
   // Local variables: alias for sessionStorage and array of everyone's names
   var storage = window.sessionStorage;
   var people = JSON.parse(storage.people);
   
   // Uncheck every checkbox, hide all buttons, and clear quotePool
   for (var i = 0; i < people.length; i++) {
	   document.getElementById("checkbox " + people[i]).checked = false;
	   document.getElementById(people[i]).style = "display: none";
   }
   storage.setItem("quotePool", "[]");
   
   // Uncheck "Select All" button
   document.getElementById("selectAll").checked = false;
} // deselectAll


// Get new joke using external public API
function getJoke() {
	   
   // Local variable: Joke request object, joke JSON object
   var request = new XMLHttpRequest();
   var joke;
   
   // Design request to show joke once it has processed
   request.onreadystatechange = function() {
	   if (this.readyState === 4 && this.status === 200) {
		   
		   // Get joke and save it to sessionStorage
		   joke = this.responseText;
		   window.sessionStorage.setItem("joke", joke);
		   joke = JSON.parse(joke);
		   
		   // Set joke setup, show punchline button, and hide punchline
		   document.getElementById("setup").innerHTML = joke["setup"];
		   document.getElementById("punchlineButton").style
			   = "display: block;";
		   document.getElementById("punchline").style = "display: none";
	   }
   };
   
   // Send request
   request.open("GET", JOKE_API_URL, true);
   request.send();
} // getJoke


// Show punchline of joke
function showPunchline() {
   
   // Get joke from sessionStorage
   var joke = JSON.parse(window.sessionStorage.joke);
   
   // Set and show punchline, and hide its button
   document.getElementById("punchline").innerHTML = joke["punchline"];
   document.getElementById("punchlineButton").style = "display: none";
   document.getElementById("punchline").style = "display: block";
} // showPunchline


/* Set buttons, checkboxes, score, quotes, and quotePool back to their
  initial state without rebuilding any DOM objects */
function resetGame() {
   
   // Local variables
   var storage = window.sessionStorage;             // sessionStorage alias
   var people = JSON.parse(sessionStorage.people); // List of all people
   
   // Delete current score and rightAnswer
   document.getElementById("score").innerHTML = "";
   document.getElementById("correctness").innerHTML = "";
   storage.setItem("rightAnswer","");
   
   // Reset quotePool as well as everyone's quotes, button, and checkbox
   loadQuotesIntoStorageFrom(QUOTES_FILE);
   resetScoreAndQuotePool();	
   for (i in people) {
	   resetButtonAndCheckboxOf(people[i]);
   }
   
   // Uncheck all/none checkboxes
   document.getElementById("selectAll").checked = false;
   document.getElementById("deselectAll").checked = false;
   
   // Restart game
   getQuote();
} // resetGame


/* ==============================================================
  3. Helper tool functions
============================================================== */

// Remove element from local list and from list in storage; return local list
function removeFromStorage(toRemove, listNameInStorage, localList, storage) {

   // Remove toRemove from localList
   localList = localList.filter(function(value, index, arr) {
	   return (value !== toRemove);
   });
   
   // Set list in storage to localList without toRemove
   storage.setItem(listNameInStorage, JSON.stringify(localList));

   return localList;
} // removeFromStorage


// Returns a randomly selected integer between min and max
function randInt(min, max) {
   var rand = new Random();
   return Math.floor(rand.random() * (max - min)) + min;
} // randInt


// Starting at index, return the index of first matching element in an array
function findEl(el, index, arr) {
   var result = -1;
   while (index < arr.length && result === -1) {
	   if (arr[index] === el) {
		   result = index;
	   }
	   index++;
   }
   return result;
} // findEl


/* ==============================================================
  4. Authentication functions
============================================================== */

// If the specified form is shown, hide it; if not, show it
function toggleShown(formID) {
   
   // Local variables:
   var formDisplay = document.getElementById(formID + "Div"); // Section containing form
   var allForms = ["login", "signup"];                       // Both form section names

   // Toggle whether the form section is shown
   if (formDisplay.style.display === "block") {
	   formDisplay.style.display = "none";
   } else {
	   formDisplay.style.display = "block";
   }
   
   // If the other form is shown, hide it
   if (formID === allForms[0]) {
	   document.getElementById(allForms[1] + "Div").style.display = "none";
   } else {
	   document.getElementById(allForms[0] + "Div").style.display = "none";
   }
} // toggleShown


// Create new user
function signup(user, pass) {
   
   // Local variables
   var targetURL = OAUTH_BASE + "/user/" + user;
   var jsonData = {"password": pass};
   
   // Create and send jQuery Ajax request
   $.ajax({
	   type: "POST",
	   url: targetURL,
	   dataType: "json",
	   contentType: "application/json",
	   data: JSON.stringify(jsonData),
	   
	   // If user account is successfully created, login as that account
	   success: function(response) {
		   login(user, pass);
	   },
	   
	   // If user account is not successfully created, inform current user
	   error: function(xhr, desc, err) {
		   console.log("signup error: " + err);
		   alert("Error: Sign up failed. " +
			   "This could be because that username is taken.");
	   }
   });
} // signup


// If user is already logged in onload, update page accordingly
function checkLoggedIn() {
   
   // Local variable: request URL
   var targetURL = OAUTH_BASE + "/login";
	   
   $.ajax({
	   type: "GET",
	   url: targetURL,
	   
	   // If user is logged in according to web.cs.georgefox.edu, log them in
	   success: function(response) {
		   if (response.user !== "") {
			   loginSuccess(response.user);
		   }
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("login check error: " + err);
	   }
   });
} // checkLoggedIn


// Login as previously existing user
function login(user, pass) {
   
   // Local variables: request URL, data to send there
   var targetURL = OAUTH_BASE + "/login";
   var jsonData = {"username": user, "password": pass};
	   
   // Create and send jQuery Ajax request
   $.ajax({
	   type: "POST",
	   url: targetURL,
	   dataType: "json",
	   contentType: "application/json",
	   data: JSON.stringify(jsonData),
	   success: function() {
		   loginSuccess(user);
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("login error: " + err);
	   }
   });
} // login


// Update page after login
function loginSuccess(user) {
   
   /* Local variables: For loop iterator and array to iterate over, 
	  and list of edit/delete buttons to hide */
   var i;
   var els; 
   var buttons = document.getElementsByClassName(user);
	   
   // Save the user info in sessionStorage
   window.sessionStorage.setItem("user", user);
	   
   // Hide signup and login buttons, as well as signup/login forms
   els = document.getElementsByClassName("initial")
   for (i = 0; i < els.length; i++) {
	   els[i].style.display = "none";
   }
   els = document.getElementsByClassName("forms")
   for (i = 0; i < els.length; i++) {
	   els[i].style.display = "none";
   }
   
   // Show logout button, username, and newComment textarea
   document.getElementById("navBarUsername").innerHTML
	   = "<h3>" +user+ "</h3>";
   els = document.getElementsByClassName("afterLogin");
   for (i = 0; i < els.length; i++) {
	   els[i].style.display = "block";
   }
   document.getElementById("newComment").style.display = "block";
   
   showEditAndDelete(buttons);
} // loginSuccess


// Show edit/delete buttons on comments posted by user who's logging in
function showEditAndDelete(buttons) {
   for (i = 0; i < buttons.length; i++ ) {
	   buttons[i].style.display = "block";
   }
} // showEditAndDelete


// Log current user out
function logout() {
   
   // Local variable: request URL
   var targetURL = OAUTH_BASE + "/login";
   
   // Create and send jQuery Ajax request
   $.ajax({
	   type: "DELETE",
	   url: targetURL,
	   success: function() {
		   logoutSuccess();
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("logout error: " + err);
	   }
   });
} // logout


// Update page after logout
function logoutSuccess() {
   
   /* Local variables: For loop iterator and array to iterate over, 
	  and list of edit/delete buttons to hide */
   var i;
   var els; 
   var buttons = document.getElementsByClassName(window.sessionStorage.user);

   // Remove username from sessionStorage
   window.sessionStorage.removeItem("user");
   
   // Show signup and login buttons
   els = document.getElementsByClassName("initial")
   for (i = 0; i < els.length; i++) {
	   els[i].style.display = "block";
   }
   
   // Hide logout button, topnav bar username, and newComment textarea
   document.getElementById("navBarUsername").innerHTML = "<p>" +user+ "</p>";
   els = document.getElementsByClassName("afterLogin");
   for (i = 0; i < els.length; i++) {
	   els[i].style.display = "none";
   }
   document.getElementById("newComment").style.display = "none";
	   
   // Hide edit/delete buttons on comments posted by user who's logging out
   for (i = 0; i < buttons.length; i++ ) {
	   buttons[i].style.display = "none";
   }
} // logoutSuccess


/* ==============================================================
  5. Comment functions
============================================================== */

// Get comments from server
function getAllComments() {
   
   // Local variable: request URL
   var targetURL = OAUTH_BASE + "/comment/comment";
   
   // Create and send jQuery Ajax request
   $.ajax({
	   type: "GET",
	   url: targetURL,
	   success: function(response) {
		   addCommentsToPage(response);
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("getComment error: " + desc + ", " + err);
	   }
   });
} // getAllComments


// Add all previously posted comments to page
function addCommentsToPage(allComments) {
   
   // Local variables: Comments section, comment DOM obj, edit/del buttons
   var commentsSection = document.getElementById("oldComments");
   var commentDOM;
   var newElement;
   
   // Build each comment and add it to the comments section
   for (var i = 0; i < allComments.length; i++) {
	   
	   // Add a break
	   newElement = document.createElement("BR");
	   commentsSection.appendChild(newElement);
	   
	   // Build comment DOM object
	   commentDOM = document.createElement("DIV");
	   commentDOM.id = allComments[i]["id"];
	   commentDOM.classList.add("postedComment");
	   commentDOM.innerHTML = "<p>" +
		   allComments[i]["post_text"] + "<br />Posted by " +
		   allComments[i]["username"] + " at " +
		   allComments[i]["created"] + "<br /></p>";
	   
	   // Add comment DOM object to page
	   commentsSection.appendChild(commentDOM);
	   
      // TODO MODULARIZE CODE BLOCKS BELOW

	   // Add "edit" option to comment object
	   newElement = document.createElement("BUTTON");
	   newElement.setAttribute("onclick","editComment(this.id);")
	   newElement.classList.add(allComments[i]["username"]);
	   newElement.id = allComments[i]["id"] + "edit";
	   newElement.setAttribute("style", "display: none;");
	   newElement.innerHTML = "Edit";
	   commentDOM.appendChild(newElement);
	   
	   // Add and hide textarea below edit button
	   newElement = document.createElement("TEXTAREA");
	   newElement.innerHTML = allComments[i]["post_text"];
	   newElement.setAttribute("style", "display: none; width: 400px;");
	   newElement.id = allComments[i]["id"] + "text";
	   commentDOM.appendChild(newElement);

	   // Add and hide edit-submit button below edit button
	   newElement = document.createElement("BUTTON");
	   newElement.setAttribute("onclick", "submitEdit(this.id);");
	   newElement.setAttribute("style", "display: none;");
	   newElement.id = allComments[i]["id"] + "submit";
	   newElement.innerHTML = "Submit";
	   commentDOM.appendChild(newElement);
	   
	   // Add and hide edit-cancel button below edit button
	   newElement = document.createElement("BUTTON");
	   newElement.setAttribute("onclick", "cancelEdit(this.id);");
	   newElement.setAttribute("style", "display: none;");
	   newElement.id = allComments[i]["id"] + "cancel";
	   newElement.innerHTML = "Cancel";
	   commentDOM.appendChild(newElement);
	   
	   // Add "delete" option to comment object
	   newElement = document.createElement("BUTTON");
	   newElement.setAttribute("onclick","deleteComment(this.id);")
	   newElement.setAttribute("style", "display: none;");
	   newElement.classList.add(allComments[i]["username"]);
	   newElement.id = allComments[i]["id"] + "delete";
	   newElement.innerHTML = "Delete";
	   commentDOM.appendChild(newElement);
   }
   
   // Show edit/delete buttons only for comments of current user
   showEditAndDelete(document.getElementsByClassName(
	   window.sessionStorage.user));
   
} // addCommentsToPage


// Submit a new comment 
function newComment() {
   
   // Local variables: request URL, data to send there
   var targetURL = OAUTH_BASE + "/comment/comment/" +
	   window.sessionStorage.user;
   var jsonData = {"comment":
	   document.getElementById("newCommentText").value};
   var commentText = document.getElementById("newCommentText").value;
   var jsonData2 = "{'comment': '" + commentText + "'}";

   console.log("sending " + JSON.stringify(jsonData) + " to " + targetURL);

   // Create and send comment post request, then reload page on success
   $.ajax({
	   type: "POST",
	   url: targetURL,
	   dataType: "json",
	   contentType: "application/json",
	   data: JSON.stringify(jsonData),
	   success: function(response) {
		   window.location.reload();
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("comment error: " + desc + ", " + err +
			   "status: " + xhr.status);
	   }
   });
} // newComment


// Edit a comment posted by the logged in user
function editComment(editID) {
   
   // Local variable: id of comment
   var commentID = editID.substring(0, editID.length - 4);
   
   // Show textarea and submit- & cancel-edit buttons hide edit button 
   document.getElementById(commentID + "text").style.display = "block";
   document.getElementById(commentID + "submit").style.display = "block";
   document.getElementById(commentID + "cancel").style.display = "block";
   document.getElementById(editID).style.display = "none";

} // editComment


// Cancel editing a comment
function cancelEdit(cancelID) {
   
   // Local variable: id of comment
   var commentID = cancelID.substring(0, cancelID.length - 6);
   
   // Show textarea, hide edit button, show submit- and cancel-edit buttons
   document.getElementById(commentID + "text").style.display = "none";
   document.getElementById(commentID + "edit").style.display = "block";
   document.getElementById(commentID + "submit").style.display = "none";
   document.getElementById(cancelID).style.display = "none";
} // cancelEdit


// Submit an edit of a comment
function submitEdit(submitID) {
   
   console.log("submitted");
   console.log("id: " + submitID);
   
   // Local variables: comment ID, request URL, data to send there
   var commentID = submitID.substring(0, submitID.length - 6);
   var targetURL = OAUTH_BASE + "/comment/comment/" +
	   window.sessionStorage.user + "/" + commentID;
   var jsonData = {"comment":
	   document.getElementById(commentID + "text").value};

   // Submit edit request and, on success, reload page
   $.ajax({
	   type: "PUT",
	   url: targetURL,
	   dataType: "json",
	   contentType: "application/json",
	   data: JSON.stringify(jsonData),
	   success: function(response) {
		   window.location.reload();
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("comment edit error: " + desc + ", " + err +
			   "status: " + xhr.status);
	   }
   });
} // submitEdit


// Delete a comment
function deleteComment(deleteID) {
	   
   // Local variables: id of comment, request URL
   var commentID = deleteID.substring(0, deleteID.length - 6);
   var targetURL = OAUTH_BASE + "/comment/comment/" +
	   window.sessionStorage.user + "/" + commentID;
	   
   console.log("comment ID: " + commentID);

   // Submit delete request and, on success, reload page
   $.ajax({
	   type: "DELETE",
	   url: targetURL,
	   success: function(response) {
		   window.location.reload();
	   }, 
	   error: function(xhr, desc, err) {
		   console.log("comment delete error: " + desc + ", " + err +
			   "status: " + xhr.status);
	   }
   });	
} // deleteComment