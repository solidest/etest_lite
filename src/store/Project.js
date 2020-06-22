
const shortid = require('shortid');
class Project {
    constructor(data) {
        this._data = data || {};
        if(!this._data.id) {
            this._data.id = shortid.generate();
        }
    }

}

export default Project
