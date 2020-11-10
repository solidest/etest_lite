
import cfg from './dpd/config';
import Blockly from '../../Components/blockly/blockly_compressed';
import DpdBlocks from './dpd/blocks.js';
import Zh_smg from '../../Components/blockly/zh-hans';

function _init() {
    if(!DpdBlocks || !Zh_smg) {
        console.error('missed files of blockly');
    }
}
_init();

function setup(block_divid) {
    let workspace = Blockly.inject(block_divid, {theme: cfg.theme, toolbox: cfg.toolbox, media: 'media/'});
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(cfg.workspace), workspace);
}

export default {
    setup,
}
