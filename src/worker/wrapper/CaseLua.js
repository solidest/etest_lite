
import parser from 'luaparse';
import yaml from 'js-yaml';

const KIND = 'program';

class CaseLua {
    constructor(data, proj, name) {
        this.data = data;
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get is_lib() {
        return (this.data.content && this.data.content.option && this.data.content.option.lib);
    }

    _option_check() {

        if(!this.data.content || !this.data.content.option) {
            return;
        }
        let opt = this.data.content.option||{};
        if(opt.vars) {
            try {
                yaml.safeLoad(opt.vars, 'utf8');
            } catch (error) {
                this.proj.pushError('输入参数设置错误', KIND, this.id, -1);
            }
        }

        if(!opt.lib) {
            if(!opt.topology) {
                this.proj.pushError('未设置连接拓扑', KIND, this.id, -1);
            } else {
                let tops = this.proj.topology;
                if(!tops || !tops.find(it=>it.id===opt.topology)) {
                    this.proj.pushError('连接拓扑为空', KIND, this.id, -1);
                }
            }

            if(opt.panel) {
                let panels = this.proj.panel;
                if(!panels || !panels.find(it=>it.id===opt.panel)) {
                    this.proj.pushError('监控面板为空', KIND, this.id, -1);
                }
            }
        }
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
            let ast = parser.parse(script, {luaVersion: '5.3'});
            if(!ast) {
                this.proj.pushError('语法错误', KIND, this.id, -1);
            } else if(this.data.content.option && !this.data.content.option.lib) {
                this._entry_check(ast);
            }
        } catch (error) {
            // console.log(error.message)
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
        this._option_check();
    }
}

export default CaseLua;