

const KIND = 'panel';

class Device {
    constructor(data, proj, name) {
        this.data = data;
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    check() {
        return KIND;
    }
}

export default Device;