#!/usr/bin/env node
const fs = require('fs');   // fs模块读取文档类型
const program = require('commander'); //commander.js，可以自动的解析命令和参数，用于处理用户输入的命令。
const download = require('download-git-repo');  //download-git-repo，下载并提取 git 仓库，用于下载项目模板。
const handlebars = require('handlebars');   // handlebars.js，模板引擎，将用户提交的信息动态填充到文件中。
const inquirer = require('inquirer');   //Inquirer.js，通用的命令行用户界面集合，用于和用户进行交互。
const ora = require('ora');   //  ora，下载过程久的话，可以用于显示下载中的动画效果。
const chalk = require('chalk');  //  chalk，可以给终端的字体加上颜色。
const symbols = require('log-symbols');  // 可以在终端上显示出 √ 或 × 等的图标。


 
program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)){     // fs读取当前目录是否存在同名
    //commander中简单用户讯问交互
      inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answers) => {
        const spinner = ora('正在下载模板...');
        spinner.start();
         //  git clone 命令 进行项目构建(就是构建本地模板项目)
        download('https://github.com/Xieguoiang/xl-vue-cli#master', name, {clone: true}, (err) => {   //git clone 本地项目
          if(err){
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          }else{
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,          //  项目名称
              description: answers.description,   // 用户输入的描述 
              author: answers.author         //   用户输入的 作者
            }
            if(fs.existsSync(fileName)){   //fs功能可查文档具体了解
              const content = fs.readFileSync(fileName).toString();  //读取file名称转为字符串
              const result = handlebars.compile(content)(meta);  
              fs.writeFileSync(fileName, result);   
            }
            console.log(symbols.success, chalk.green('项目初始化完成'));
          }
        })
      })
    }else{
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
  
program.parse(process.argv);  //