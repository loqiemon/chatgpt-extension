

function setStorageValue(obj, callback=null) {
    chrome.storage.local.set(obj, callback);
}

function getStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function(result) {
                resolve(result[key]);
            });
        }catch(ex) {
            reject(ex)
        }
    });
}


export {setStorageValue, getStorageValue}