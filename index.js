//Should not be here but...
function addListener(selector, event, callback) {
  document.querySelector(selector).addEventListener(event, callback)
}


function setStorageValue(obj, callback = null) {
  chrome.storage.local.set(obj, callback);
}


function getStorageValue(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (result) {
        resolve(result[key]);
      });
    } catch (ex) {
      reject(ex)
    }
  });
}

//

const dialogStyle = `
    position: fixed;
    top: 10%;
    left: 10%;
    transform: translate(-50%, -50%);
    background: white;
    border: solid 1px black;
    padding: 20px;
    z-index: 9999;
    cursor: move;
`;


async function askGpt(text) {
  try {
    getStorageValue('apikey').then(token => {
      if (token) {
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { "role": "system", "content": "You are a helpful assistant." },
              { "role": "user", "content": text }
            ]
          })
        })
          .then(response => response.json())
          .then(response => alert(response.choices[0].message.content))
      }
    })
  } catch (error) {
    alert(error)
  }
}


function showDialog(text) {
  document.body.innerHTML += `
    <div style="${dialogStyle}" id="gpt_ext_modal">
      <textarea id="gpt_ext_question">${text}</textarea>
      <button id="gpt_ext_ask">Спросить</button>
      <button id="gpt_ext_close">Закрыть</button>
    </div>
  `;
  addListener('#gpt_ext_close', 'click', () => { document.querySelector('#gpt_ext_modal').remove() })
  addListener('#gpt_ext_ask', 'click', () => { askGpt(document.querySelector('#gpt_ext_question').value) })
}


document.addEventListener('mouseup', () => {
  const selection = window.getSelection().toString();
  getStorageValue('isActive').then(value => {
    if (selection && value) {
      try {
        document.querySelector('#gpt_ext_modal').remove()
      } catch (ex) {
        console.log(ex)
      }
      showDialog(selection);
      modalMove();
    }
  })
});


function modalMove() {
  const modal = document.querySelector('#gpt_ext_modal');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  modal.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      modal.style.top = `${e.clientY - offsetY}px`;
      modal.style.left = `${e.clientX - offsetX}px`;
    }
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}