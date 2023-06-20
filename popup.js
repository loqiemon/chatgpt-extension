import { setStorageValue, getStorageValue } from "./store.js";


document.querySelector('#save').addEventListener('click', (e) => {
    const key = document.querySelector('#apikey').value;
    setStorageValue({'apikey': key})
})


function addListen() {
    document.querySelector('#isOn').addEventListener('click', (e) => {
        setStorageValue({ 'isActive': e.target.checked });    
    })
}


const promise = new Promise(function (resolve, reject) {
    try {
        getStorageValue('isActive').then(value => {
            const check = value ? 'checked': '';
            document.body.insertAdjacentHTML('beforeend', `<input type="checkbox" id="isOn" ${check}>`) 
            addListen()
        })
    }catch (ex) {
        document.body.insertAdjacentHTML('beforeend', `<input type="checkbox" id="isOn">`);
        addListen()
    }
})





