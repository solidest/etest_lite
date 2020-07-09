
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

    _entry_check(ast) {
        if(this.data.content && this.data.content.option && this.data.content.option.lib) {
            return;
        }
        let entry = false;
        if(ast.type === 'Chunk' && ast.body) {
            ast.body.forEach(a => {
                if(a.type === 'FunctionDeclaration' && a.identifier.name === 'entry') {
                    entry = true;
                }
            })
        }
        if(!entry) {
            this.proj.pushError('缺少entry入口函数', KIND, this.id, -1);
        }
    }

    _parser_check(script) {

        try {
            let ast = parser.parse(script);
            if(!ast) {
                this.proj.pushError('语法错误', KIND, this.id, -1);
            } else {
                this._entry_check(ast);
            }
        } catch (error) {
            this.proj.pushError(error.message, KIND, this.id, error.line);
        }
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