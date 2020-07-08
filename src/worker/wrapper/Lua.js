
import parser from 'luaparse';

const KIND = 'program';

class Lua {
    constructor(data, proj) {
        this.data = data;
        this.proj = proj;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.data.name;
    }

    _parser_check(script) {

        try {
            let ast = parser.parse(script);
            if(!ast) {
                this.proj.pushError('语法错误', KIND, this.id, 0);
            }
        } catch (error) {
            // console.log('msg', error.message);
            // console.log('line', error.line)
            // console.log('error object', error)
            this.proj.pushError(error.message, KIND, this.id, error.line);
        }
        // if(!checker.isPositiveNumber(cfg.baudrate)) {
        //     this.proj.pushError('语法错误', KIND, this.id, item.id);
        // }
        // if(![5, 6, 7, 8].includes(cfg.bytesize)) {
        //     this.proj.pushError('数据位设置错误', KIND, this.id, item.id);
        // }
        // if(![1, 2, 1.5].includes(cfg.stopbits)) {
        //     this.proj.pushError('停止位设置错误', KIND, this.id, item.id);
        // }
        // if(!['none', 'odd', 'event', 'mark', 'space'].includes(cfg.parity)) {
        //     this.proj.pushError('校验方式设置错误', KIND, this.id, item.id);
        // }
        // if(!['none', 'software', 'hardware'].includes(cfg.flowcontrol)) {
        //     this.proj.pushError('流控方式设置错误', KIND, this.id, item.id);
        // }
    }

    check() {
        if(!this.data.content) {
            return;
        }
        let script = this.data.content.script;
        if(!script || !script.trim()) {
            return;
        }
        this._parser_check(script);
    }
}

export default Lua;