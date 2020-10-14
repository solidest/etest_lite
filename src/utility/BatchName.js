class BatchName
{
    constructor(names) {
        let ns = [];
        names.forEach(name => {
            if(!name) {
                ns.push(['_', 1]);
            } else {
                let idx = name.search(/\d+$/);
                if(idx>=0) {
                    let nn = name.substring(idx);
                    ns.push([name.substring(0, idx), Number.parseInt(nn)+1]);
                } else {
                    ns.push([name, 1]);
                }                
            }
        });
        this.names = ns;
    }

    rename(items, idx) {
        for (let index = 0; index < this.names.length; index++) {
            items[index].name = `${this.names[index][0]}${this.names[index][1]+idx}`; 
        }
    }
}

export default BatchName;