
import helper from '../../helper/helper';

class Protocol {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.name;
    }

    get_run_oneof(oneof) {
        if (!oneof.items) {
            return [];
        }
        let brs = [];
        oneof.items.forEach(br => {
            let segs = this.get_run_segments(br);
            brs.push({kind: 'oneof', seglist: segs, exp: br.condition});
        });
        return brs;
    }

    get_run_segment(seg) {
        let res = seg.parser;
        if(!res || typeof res === 'string') {
            return {kind: 'nil'}
        }
        res.name = seg.name;
        if (seg.autovalue) {
            res.autovalue = seg.autovalue;
        }
        if (seg.arrlen) {
            res.repeated = seg.arrlen;
        }
        if (seg.length) {
            res.length = seg.length;
        }
        if (seg.endwith) {
            res.endwith = seg.endwith;
        }
        return res;
    }

    get_run_segments(segs) {
        let seglist = [];
        let items =segs.items;
        if(items) {
            for(let it of items) {
                this.get_run_seg(seglist, it);
            }
        }
        
        let res = {kind: 'seggroup', name: segs.name, seglist: seglist};
        if (segs.autovalue) {
            res.autovalue = segs.autovalue;
        }
        if (segs.arrlen) {
            res.repeated = segs.arrlen;
        }
        return res;
    }

    get_run_seg(seglist, seg) {
        if(seg.kind === 'segment') {
            seglist.push(this.get_run_segment(seg));
        } else if(seg.kind === 'segments') {
            seglist.push(this.get_run_segments(seg));
        } else if(seg.kind === 'oneof') {
            if(seglist.length>0 && seglist[seglist.length-1].kind === 'oneof') {
                seglist.push({kind: 'nil'})
            }
            let oneofs = this.get_run_oneof(seg);
            if(oneofs.length > 0)
            seglist.push(...oneofs);
        }
    }

    get_run_ast() {
        let seglist = [];
        let items = this.data.content.items;
        for(let it of items) {
            this.get_run_seg(seglist, it);
        }
        console.log(this.data)
        return {
            kind: 'protocol',
            name: this.name,
            seglist: seglist
        }
    }
}

export default Protocol;