#!/usr/bin/env node

/**
 * ETL命令行执行入口模块
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { program } = require('commander');

function _get_idxfile() {
    let idxfile = program.idxfile;
    if(!idxfile) {
        return 'index.yml';
    } 
    return idxfile;
}

function _get_params() {
    let params = program.params;
    // console.log('params = ', params)
    if(!params) {
        return null;
    }
    return yaml.safeLoad(fs.readFileSync(params, 'utf8'));
}


program
    .option('-i, --idxfile <idxfile>', 'specify index file')
    // .option('-r, --realtime <realtime>', 'work on real time mode')
    .option('-t, --times <times>', 'repeat the specified number of times')
    .option('-p, --params <params>', 'params of command')
    .option('-a, --duration <duration>', 'auto run test program, no more than duration seconds ');

//state
program
    .command('state')
    .description('query status of etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_state(_get_idxfile());
    });

//stop
program
    .command('stop')
    .description('stop run on etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_stop(_get_idxfile());
    });

//setup
program
    .command('setup')
    .description('setup environment into etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_setup(_get_idxfile());
    });


//run
program
    .command('run <run_id>')
    .description('run special case on etestx')
    .action((run_id)=>{
        const cmd = require('./command');
        if (program.duration && program.duration>0) {
            cmd.set_auto_exit(program.duration);
        }
        let ts = program.times;
        if(ts && ts >0) {
            let runs = [];
            for (let index = 0; index < ts; index++) {
                runs.push(run_id);
            }
            cmd.cmd_runs(_get_idxfile(), runs);
        } else {
            cmd.cmd_run(_get_idxfile(), run_id);
        }
    });

//runs
program
    .command('runs <runs_id>')
    .description('run multi case on etestx')
    .action((runs_id)=>{
        const cmd = require('./command');
        if (program.duration && program.duration>0) {
            cmd.set_auto_exit(program.duration)
        }
        cmd.cmd_runs(_get_idxfile(), runs_id);
    });

//cmd
program
    .command('cmd <cmd_id>')
    .description('send special command to etestx')
    .action((cmd_id)=>{
        const cmd = require('./command');
        cmd.cmd_cmd(_get_idxfile(), cmd_id, _get_params());
    });

program.parse(process.argv);




