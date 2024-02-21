window.addEventListener('resize', function () {
  if (window.innerWidth < 600 || window.innerHeight < 400) {
    window.resizeTo(800, 600);
  }
});

function clearUsernameField() {
  var usernameField = document.getElementById("username");
  if (usernameField){
  } else{
    usernameField = document.getElementById("username_registration");
  }
  if (usernameField.value === "Username") {
    usernameField.value = "";
  }
}

function preserveUsernameField() {
  var usernameField = document.getElementById("username");
  if (usernameField){
  } else{
    usernameField = document.getElementById("username_registration");
  }
  if (usernameField.value === "") {
    usernameField.value = "Username";
  }
}

function clearPasswordField() {
    var passwordField = document.getElementById("password");
    if (passwordField){
    } else{
      passwordField = document.getElementById("password_registration");
    }
    if (passwordField.value === "Password") {
      passwordField.value = "";
    }
}

function preservePasswordField() {
  var passwordField = document.getElementById("password");
    if (passwordField){
    } else{
      passwordField = document.getElementById("password_registration");
    }
    if (passwordField.value === "") {
      passwordField.value = "Password";
    }
}

function clearRepeatPasswordField() {
  var passwordField = document.getElementById("repeat_password_registration");
  if (passwordField.value === "Repeat password") {
    passwordField.value = "";
  }
}

function preserveRepeatPasswordField() {
var usernameField = document.getElementById("repeat_password_registration");
if (usernameField.value === "") {
  usernameField.value = "Repeat password";
}
}

var removedElementsLogin = null;
var removedElementsRegistration = null;
var First = true

function activateButtonRegistration(button) {
  activateButton(button);
  const buttonRegistration = document.querySelector('.Login_mode');
  buttonRegistration.disabled = true;

  moveOutLogin();
  setTimeout(function () {
    removedElementsLogin = removeElements(document.querySelector(".moveable-elements-Login"), removedElementsLogin);
    controlHeight()
    setTimeout(function () {
      restoreElements(document.querySelector(".moveable-elements-Registration"), removedElementsRegistration)
      moveInRegistration()
      setTimeout(function () {
        buttonRegistration.disabled = false;
      }, 600);
    }, 300);
  }, 600);
}

function activateButtonLogin(button) {
  activateButton(button);
  const buttonRegistration = document.querySelector('.Registration_mode');
  buttonRegistration.disabled = true;

  moveOutRegistration();
  setTimeout(function () {
    removedElementsRegistration = removeElements(document.querySelector(".moveable-elements-Registration"), removedElementsRegistration);
    controlHeight()
    setTimeout(function () {
      restoreElements(document.querySelector(".moveable-elements-Login"), removedElementsLogin)
      moveInLogin()
      setTimeout(function () {
        buttonRegistration.disabled = false;
      }, 600);
    }, 300);
  }, 600);
}

function activateButton(button) {
  const buttons = document.querySelectorAll('.Login_mode, .Registration_mode');
  
  buttons.forEach(function (btn) {
    btn.classList.remove('active');
    btn.disabled = false;
  });
  
  button.classList.add('active');
  button.disabled = true; 
}

function moveInLogin() {
  var container = document.querySelector(".moveable-elements-Login");

  if (container) {
    container.style.transform = "translateX(0)";
  }
}

function moveOutLogin() {
  var container = document.querySelector(".moveable-elements-Login");

  if (container) {
    container.style.transform = "translateX(-325px)";
  }
}

function moveInRegistration() {
  var container = document.querySelector(".moveable-elements-Registration");

  if (container) {
    container.style.transform = "translateX(0)";
  }
}

function moveOutRegistration() {
  var container = document.querySelector(".moveable-elements-Registration");

  if (container) {
    container.style.transform = "translateX(+325px)";
  }
}

function removeElements(container, removedElements) {
  if (container) {
    removedElements = Array.from(container.children);
    container.innerHTML = "";
  }
  return removedElements
}

function restoreElements(container, removedElements) {

  if (First === true){
    addElementsRegistration(container)
    return
  }

  if (container && removedElements && First === false) {
    removedElements.forEach(function (element) {
      container.appendChild(element);
    });
  }
}

function controlHeight() {
  var element = document.getElementById("stroke");
  if (element) {
    var initialHeight = parseInt(element.style.height) || element.clientHeight;
    console.log(initialHeight)
    if (initialHeight == 340 || initialHeight == 296){
      element.style.height = "360px";
    } else if (initialHeight == 360){
      element.style.height = "296px";
    }
  }
}

function addElementsRegistration(container) {
  if (container) {
    var input1 = document.createElement('input');
    input1.type = 'text';
    input1.className = 'username_registration';
    input1.id = 'username_registration';
    input1.name = 'username_registration';
    input1.value = 'Username';
    input1.setAttribute('onfocus', 'clearUsernameField()');
    input1.setAttribute('onblur', 'preserveUsernameField()');

    var input2 = document.createElement('input');
    input2.type = 'text';
    input2.className = 'password_registration';
    input2.id = 'password_registration';
    input2.name = 'password_registration';
    input2.value = 'Password';
    input2.setAttribute('onfocus', 'clearPasswordField()');
    input2.setAttribute('onblur', 'preservePasswordField()');

    var input3 = document.createElement('input');
    input3.type = 'text';
    input3.className = 'repeat_password_registration';
    input3.id = 'repeat_password_registration';
    input3.name = 'repeat_password_registration';
    input3.value = 'Repeat password';
    input3.setAttribute('onfocus', 'clearRepeatPasswordField()');
    input3.setAttribute('onblur', 'preserveRepeatPasswordField()');

    var button = document.createElement('button');
    button.className = 'Register';
    button.id = 'Register';
    button.textContent = 'Register';

    container.appendChild(input1);
    container.appendChild(input2);
    container.appendChild(input3);
    container.appendChild(button);
    First = false
  }
}

