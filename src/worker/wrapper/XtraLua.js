
import parser from 'luaparse';

const KIND = 'project';

class Lua {
    constructor(kind, script, proj) {
        this.kind = kind;
        this.script = script;
        this.proj = proj;
    }

    get id() {
        return this.kind;
    }

    get name() {
        return this.kind;
    }

    check() {
        if(!this.script || !this.script.trim()) {
            return;
        }
        try {
            let ast = parser.parse(this.script, {luaVersion: '5.3'});
            if(!ast) {
                this.proj.pushError('语法错误', KIND, this.kind, -1);
            }
        } catch (error) {
            this.proj.pushError(error.message, KIND, this.kind, error.line);
        }
    }
}

export default Lua;