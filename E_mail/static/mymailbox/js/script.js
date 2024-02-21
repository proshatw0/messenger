var grid = 0;
var selectedMessage = [];
var currentActiveMessageId = null;
var opened_message = 0;
var action_sure = [];

var new_message_button = document.getElementById("new_message");
document.getElementById("new_message").onclick = function() {
    document.getElementById("new_message_form").style.display = "block";
};

var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function() {
  document.getElementById("new_message_form").style.display = "none";
});

document.getElementById("new_message_text").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      this.focus();
    } else if (this.scrollHeight > this.clientHeight) {
      this.scrollTop = this.scrollHeight;
    }
});

function updateButtonsText() {
  let readButton = document.getElementById('read_all');
  let trashButton = document.getElementById('trash_all');
  
  if (selectedMessage.length > 0) {
      readButton.querySelector('.read_text').textContent = 'Read selected';
      trashButton.querySelector('.trash_text').textContent = 'Delete selected';
  } else {
      readButton.querySelector('.read_text').textContent = 'Read everything';
      trashButton.querySelector('.trash_text').textContent = 'Delete everything';
  }
}

function handleCheckboxChange(checkbox) {
  let messageId = checkbox.closest('.message').id;

  if (checkbox.checked) {
      selectedMessage.push(messageId);
  } else {
    let index = selectedMessage.indexOf(messageId);
      if (index !== -1) {
          selectedMessage.splice(index, 1);
      }
  }

  updateButtonsText();
  console.log(selectedMessage);
}

document.querySelectorAll('.checkbox').forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    handleCheckboxChange(this);
  });
});

document.querySelectorAll('.message-container').forEach(function(container) {
  let checkbox = container.querySelector('.checkbox');
  let iconMessage = container.querySelector('.icon_message');

  container.addEventListener('mouseenter', function() {
    if (!checkbox.checked) {
      iconMessage.style.display = 'none';
      checkbox.style.display = 'block';
      checkbox.style.opacity = 1;
    }
  });

  container.addEventListener('mouseleave', function() {
    if (!checkbox.checked) {
      iconMessage.style.display = 'block';
      checkbox.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  let fileInput = document.getElementById('file');
  let selectFileButton = document.getElementById('select_file');

  fileInput.addEventListener('change', function() {
    let fileName = fileInput.files[0].name;
    selectFileButton.querySelector('.span_select_file').innerText = fileName;
    selectFileButton.querySelector('.span_select_file').title = fileName;
    selectFileButton.querySelector('.span_select_file').style.color = '#FFFFFF';
    selectFileButton.disabled = true;
    document.getElementById('Send_message').disabled = true;
    let percent = 0;
    let interval = setInterval(function() {
        percent += 1;
        selectFileButton.style.backgroundImage = 'linear-gradient(to right, #4B51CE ' + percent + '%, #ffffff ' + percent + '%)';
        if (percent >= 100) {
            clearInterval(interval);
            selectFileButton.disabled = false;
            document.getElementById('Send_message').disabled = false;
        }
    }, 10); 
  });
});


function new_message(message){
  let newMessage = document.createElement("a");
  if (grid == 1) {
    newMessage.className = "message message-grid";
  } else {
    newMessage.className = "message message-flex";
  }
  newMessage.id = message.id;
  newMessage.href = `send/${message.id}`

  let readStatus = document.createElement("div");
  if (grid == 1) {
    readStatus.className = "read read-grid";
  } else {
    readStatus.className = "read read-flex";
  }

  let messageContainer = document.createElement("div");
  if (grid == 1) {
    messageContainer.className = "message-container message-container-grid";
  } else {
    messageContainer.className = "message-container message-container-flex";
  }

  let iconMessage = document.createElement("img");
  iconMessage.src = message.icon_url;
  iconMessage.alt = "";
  iconMessage.className = "icon_message";

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.id = "checkbox";

  if (message.checked) {
    checkbox.checked = true;
  }

  checkbox.addEventListener('change', function() {
    handleCheckboxChange(this);
  });

  let emailSender = document.createElement("span");
  if (grid == 1) {
    emailSender.className = "email_senders email_senders-grid";
  } else {
    emailSender.className = "email_senders email_senders-flex";
  }
  emailSender.title = message.email; 
  emailSender.textContent = message.email; 

  let titleMessage = document.createElement("p");
  if (grid == 1) {
    titleMessage.className = "title_message title_message-grid";
  } else {
    titleMessage.className = "title_message title_message-flex";
  }
  titleMessage.textContent = message.title; 

  let valueMessage = document.createElement("p");
  if (grid == 1) {
    valueMessage.className = "value_message value_message-grid";
  } else {
    valueMessage.className = "value_message value_message-flex";
  }
  valueMessage.textContent = message.text; 

  let dataMessage = document.createElement("p");
  if (grid == 1) {
    dataMessage.className = "data_message data_message-grid";
  } else {
    dataMessage.className = "data_message data_message-flex";
  }
  let sentAtTimestamp = message.data;
  let sentAtDate = new Date(sentAtTimestamp);

  let formattedDate = sentAtDate.getFullYear() + '.' +
                      ('0' + (sentAtDate.getMonth() + 1)).slice(-2) + '.' +
                      ('0' + sentAtDate.getDate()).slice(-2) + ' ' +
                      ('0' + sentAtDate.getHours()).slice(-2) + ':' +
                      ('0' + sentAtDate.getMinutes()).slice(-2);
  dataMessage.textContent = formattedDate;

  messageContainer.appendChild(iconMessage);
  messageContainer.appendChild(checkbox);

  newMessage.appendChild(readStatus);
  newMessage.appendChild(messageContainer);
  newMessage.appendChild(emailSender);
  newMessage.appendChild(titleMessage);
  newMessage.appendChild(valueMessage);
  newMessage.appendChild(dataMessage);

  let chatContainer = document.getElementById("chat");
  chatContainer.insertBefore(newMessage, chatContainer.firstChild);

  document.querySelectorAll('.message-container').forEach(function(container) {
    let checkbox = container.querySelector('.checkbox');
    let iconMessage = container.querySelector('.icon_message');
  
    container.addEventListener('mouseenter', function() {
      if (!checkbox.checked) {
        iconMessage.style.display = 'none';
        checkbox.style.display = 'block';
        checkbox.style.opacity = 1;
      }
    });
  
    container.addEventListener('mouseleave', function() {
      if (!checkbox.checked) {
        iconMessage.style.display = 'block';
        checkbox.style.display = 'none';
      }
    });
  });
}


$(document).ready(function() {
    $('#Send_message').on('click', function(e) {
        e.preventDefault();

        let formData = new FormData($('#new_messageForm')[0]);

        $.ajax({
            type: 'POST',
            url: '/mailbox/new/',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    document.getElementById("new_message_form").style.display = "none";  
                    let selectFileButton = document.getElementById('select_file');
                    selectFileButton.querySelector('.span_select_file').innerText = "Select file";
                    selectFileButton.querySelector('.span_select_file').title = "Select file for send";
                    $('#error_new_message').text('');
                    $('#new_message_title').text('');
                    $('#new_message_text').text('');
                    $('#file').val('');
                    $('#error_new_message').text('');

                    let currentUrl = window.location.href;
                    let parts = currentUrl.split('/');
                    if ((parts[parts.length - 1] == "sent") || (parts[parts.length - 2] == "sent")){
                      new_message(response.message)
                    }
                    let empty = document.getElementById('clear_mailbox');
                    if(empty) {
                      empty.remove();
                    }
                } else {
                    $('#error_new_message').text(response.error);
                }
            },
            error: function(error) {
            }
        });
    });
});

function mailbox_activ(){
  let mailboxElement = document.getElementById(`mailbox`);
  mailboxElement.classList.add('active');
  chat = mailboxElement.querySelector('.chat');
  chat.classList.add('active');
  let message = document.querySelectorAll('.message');
  if (message.length !== 0){
    message.forEach(function (element) {
      if (!element.classList.contains('active1')){
        element.classList.add('active2');
      }
      title_message = element.querySelector('.title_message');
      title_message.classList.add('active');

      value_message = element.querySelector('.value_message');
      value_message.classList.add('active');
    });
  }
  opened_message = 1
}

function chat_to_grid(){
  let flexElements = document.querySelectorAll('.message-flex');

  if (flexElements.length !== 0){
    flexElements.forEach(function (element) {
      element.classList.remove('message-flex');
      element.classList.add('message-grid');

      read = element.querySelector('.read');
      if (read){
        read.classList.remove('read-flex');
        read.classList.add('read-grid');
      } else{
        unread = element.querySelector('.unread');
        unread.classList.remove('unread-flex');
        unread.classList.add('unread-grid');
      }

      message_container = element.querySelector('.message-container');
      message_container.classList.remove('message-container-flex');
      message_container.classList.add('message-container-grid');

      email_senders = element.querySelector('.email_senders');
      email_senders.classList.remove('email_senders-flex');
      email_senders.classList.add('email_senders-grid');

      title_message = element.querySelector('.title_message');
      title_message.classList.remove('title_message-flex');
      title_message.classList.add('title_message-grid');

      value_message = element.querySelector('.value_message');
      value_message.classList.remove('value_message-flex');
      value_message.classList.add('value_message-grid');

      data_message = element.querySelector('.data_message');
      data_message.classList.remove('data_message-flex');
      data_message.classList.add('data_message-grid');
    });
  }
  grid = 1;
}

function active_message(id){
  let parentElement = document.getElementById(`/message/${id}`);

  if (currentActiveMessageId !== null) {
    let currentActiveElement = document.getElementById(currentActiveMessageId);
    currentActiveElement.classList.remove('active1');
    currentActiveElement.classList.add('active2');
  }
  parentElement.classList.add('active1');
  parentElement.classList.remove('active2');
    
  currentActiveMessageId = `/message/${id}`;

  childElement = parentElement.querySelector('.unread');
if (childElement) {
    childElement.className = "";
    childElement.classList.add('read', 'read-grid');
}

}

function open_message(data){
  active_message(data.id);
  message_place = document.getElementById('message_place');
    message_place.style.width = '50%';
    message_place.style.padding = '30px';
    message_place.style.padding = '30px';
    message_place.style.paddingTop = '10px';
    title = document.getElementById('title_main');
    title.textContent = data.title;
    perantElement = document.getElementById(`/message/${data.id}`);
    icon_original = perantElement.querySelector('.icon_message');
    icon_url = icon_original.getAttribute('src');
    message_icon = document.getElementById('message_icon');
    message_icon.src = icon_url;
    if (data.from_you){
      email_senders_main = document.getElementById('email_senders_main');
      email_senders_main.textContent = data.email;
      email_recipient_main = document.getElementById('email_recipient_main');
      email_recipient_main.textContent = "To You";
    } else {
      email_senders_main = document.getElementById('email_senders_main');
      email_senders_main.textContent = "You";
      email_recipient_main = document.getElementById('email_recipient_main');
      email_recipient_main.textContent = data.email;
    }
    data_main = document.getElementById('data_main');
    let sentAtTimestamp = data.sent_at;
    let sentAtDate = new Date(sentAtTimestamp);

    let formattedDate = sentAtDate.getFullYear() + '.' +
                          ('0' + (sentAtDate.getMonth() + 1)).slice(-2) + '.' +
                          ('0' + sentAtDate.getDate()).slice(-2) + ' ' +
                          ('0' + sentAtDate.getHours()).slice(-2) + ':' +
                          ('0' + sentAtDate.getMinutes()).slice(-2);
    data_main.textContent = formattedDate;
    data_main = document.getElementById('text_main');
    data_main.textContent = data.value;
    console.log(data.file_name);
    
    if (data.file_name){
      downloud_file = document.getElementById('downloud_file');
      downloud_file.style.display = 'block';
      file_span = document.getElementById('span_download_file');
      file_span.innerText = data.file_name;
      file_span.title = data.file_name;
      message_id = document.getElementById('message-main-id');
      message_id.value = data.id;
      console.log(data.id);
    } else {
      downloud_file = document.getElementById('downloud_file');
      downloud_file.style.display = 'none';
    }
  if (opened_message == 0){
    chat_to_grid();
    mailbox_activ();
  }
}

function sendAjaxRequest(event, url) {
  if (event.target.type !== 'checkbox') {
    event.preventDefault();
    let element = document.getElementById('you_email');
    let value = element.textContent || element.innerText;
    new_url = `/mailbox/${value}${url}`
    $.ajax({
      type: 'GET',
      url: new_url,
      success: function(data) {
        open_message(data.message)
      },
      error: function(error) {
        console.error('Ajax request failed:', error);
      }
    });
  }
}

function sendAjaxRequestForFile(event) {
  event.preventDefault();
  let value = document.getElementById('message-main-id').value;
  let new_url = `/mailbox/file/${value}`;
  $.ajax({
    type: 'GET',
    url: new_url,
    xhrFields: {
      responseType: 'blob' 
    },
    success: function (data) {
      let a = document.createElement('a');
      let url = window.URL.createObjectURL(data);
      a.href = url;
      file_name = document.getElementById('span_download_file').title;
      a.download = file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    error: function (error) {
      console.error('Ajax request failed:', error);
    }
  });
}

function read_all() {
  document.getElementById('you-sure').style.display = 'block';
  if (document.getElementById('read_text').textContent == 'Read everything') {
    action_sure = ['read', 'all'];
  } else {
    action_sure = ['read', 'selected'];
  }
}

function trash_all() {
  document.getElementById('you-sure').style.display = 'block';
  if (document.getElementById('trash_text').textContent == 'Delete everything') {
    action_sure = ['trash', 'all'];
  } else {
    action_sure = ['trash', 'selected'];

  }
}

function no_accept() {
  document.getElementById('you-sure').style.display = 'none';
  action_sure = [];
}

function accept() {
  console.log('пока не готово, ну вы держитесь там')
  let numbersOnly;

  if (selectedMessage.length) {
      numbersOnly = selectedMessage.map(selectedMessage => {
          const match = selectedMessage.match(/\d+/);
          return match ? match[0] : null;
      });
  }

  console.log(numbersOnly);

  document.getElementById('you-sure').style.display = 'none';
  action_sure = [];
}
