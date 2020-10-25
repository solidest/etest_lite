function save_json(doc, file) {
    let blob = new Blob([JSON.stringify(doc)], {
        type: 'application/json'
    });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file)
    link.click();
    link.remove();
}

async function open_json() {
    return new Promise((resolve) => {
        let input = document.createElement("input");
        input.type = "file";
        input.onchange = function () {
            try {
                if(!input.value) {
                    return resolve({result: 'cancel'});
                }
                let file = input.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function (oFREvent) {
                    try {
                        let txt = oFREvent.target.result;
                        return resolve({result: 'ok', value: JSON.parse(txt)});          
                    } catch (error) {
                        return resolve({result: 'error', value: error.message});   
                    }
                }                
            } catch (error) {
                return resolve({result: 'error', value: error.message});
            }
        }
        input.click();
        setTimeout(() => {
            input.remove()
        }, 200);
    });
}

export default {
    save_json,
    open_json,
}