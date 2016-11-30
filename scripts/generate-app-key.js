const debug = require('debug')('api:scripts');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const inquirer = require('inquirer');
const colors = require('colors');

const fileName = '../lib/app-keys.json';

const appKeys = require(fileName);

const questions = [{
  type: 'input',
  name: 'appName',
  message: 'Enter the application name'
}];

inquirer.prompt(questions).then((answers) => {
  if (answers.appName && answers.appName !== '') {
    const id = uuid.v4();
    appKeys[id] = answers.appName;
    fs.writeFile(path.resolve(__dirname, fileName), JSON.stringify(appKeys), (err) => {
      if (err) return console.log(err);
      console.log(
        `App Key ${colors.green(id)} generated for application ${answers.appName}`
      );
      console.log('\n\nDon\'t forget to commit to Github and push to Heroku to activate your app key.');
    });
  } else {
    console.warn(colors.red('App name is required'));
  }
});
