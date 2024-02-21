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
    input1.className = 'email_registration';
    input1.id = 'email_registration';
    input1.name = 'email_registration';
    input1.placeholder = 'Email';

    var input2 = document.createElement('input');
    input2.type = 'password';
    input2.className = 'password_registration';
    input2.id = 'password_registration';
    input2.name = 'password_registration';
    input2.placeholder = 'Password';

    var input3 = document.createElement('input');
    input3.type = 'password';
    input3.className = 'repeat_password_registration';
    input3.id = 'repeat_password_registration';
    input3.name = 'repeat_password_registration';
    input3.placeholder = 'Repeat password';

    var button = document.createElement('button');
    button.className = 'Register';
    button.id = 'Register';
    button.textContent = 'Register';

    form = document.getElementById('registrationForm');
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(button);
    First = false
  }
}

function checkInput(mode){
  error = document.getElementById('email');
  if (mode == "login"){
    email = document.getElementById('email');
    password = document.getElementById('password');
    if (email.trim() === ''){
      error.innerHTML = 'Enter email'
      return false
    }
    if (password.trim() === ''){
      error.innerHTML = 'Enter password'
      return false
    }
  } else {
    email = document.getElementById('email_registration');
    password = document.getElementById('password_registration');
    repeat_password = document.getElementById('repeat_password_registration');
    if (email.trim() === ''){
      error.innerHTML = 'Enter email'
      return false
    }
    if (password.trim() === ''){
      error.innerHTML = 'Enter password'
      return false
    }
    if (repeat_password !== password){
      error.innerHTML = 'Password mismatch'
      return false
    }
  }
  return true
}

function login(){
  if (!checkInput("login")){
    return
  }
  document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
    var registrationForm = document.getElementById('registrationForm');

    loginForm.addEventListener('Login', function (event) {
        event.preventDefault();

        var formData = new FormData(loginForm);
        formData.append('mode', 'login');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '{% url "login" %}', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                // Обработка успешного ответа
                console.log(xhr.responseText);
            } else {
                // Обработка ошибки
                console.error('Произошла ошибка при отправке формы');
            }
        };

        xhr.send(formData);
    });

    registrationForm.addEventListener('Register', function (event) {
        event.preventDefault();

        var formData = new FormData(registrationForm);
        formData.append('mode', 'register');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '{% url "login" %}', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error('Произошла ошибка при отправке формы');
            }
        };

        xhr.send(formData);
    });
});
}