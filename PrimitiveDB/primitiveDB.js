let inquirer = require('inquirer');
let fs = require('fs');
let papa = require('papaparse');
let userData = {};

function run()
{
    userData = {};
    inquirer.prompt([{
            type: 'input',
            name: 'user',
            message: 'Enter the user\'s name. To cancel press ENTER: ',
            validate(value){
                if(value !== '' && value.match(/^[a-zA-za-яA-Я\-_]+$/) === null){
                    return 'Please enter a valid name!';
                }
                return true;
            }
        }]).then((answers) => {
        if(answers.user !== ''){
            userData.user = answers.user;
            next();
        } else {
            tellShowUsersList();
        }
    });
}

function next()
{
    inquirer.prompt([{
            type: 'list',
            name: 'gender',
            message: 'Choose your Gender. ',
            choices: ['male', 'female'],
            filter(value) {
                return value.toLowerCase();
            },
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter your Age: ',
            validate(value){
                if(value.match(/^\d+$/) === null || value > 100){
                    return 'Please enter a valid age!';
                }
                return true;
            }
        }]).then((answers) => {
            userData.gender = answers.gender;
            userData.age = answers.age;
        if(answers.age){
            setDataToDb()
            run();
        }
    });
}

function setDataToDb()
{
    let string = `${userData.user},${userData.gender},${userData.age}`;
    fs.stat(__dirname+'/db.csv', function (err, stat){
        if(err == null){
            fs.appendFileSync(__dirname+'/db.csv', string+'\n');
        } else {
            fs.createWriteStream(__dirname+'/db.csv');
            fs.appendFileSync(__dirname+'/db.csv', 'user,gender,age\n');
            fs.appendFileSync(__dirname+'/db.csv', string+'\n');
        }
    })
}

function tellShowUsersList()
{
    inquirer.prompt([{
        type: 'confirm',
        name: 'list',
        message: 'Would you to search values in DB?',
        default: false
    }]).then((answers) => {
        if(answers.list){
            // fs.createReadStream(__dirname+'/db.csv').pipe(getParser());
            console.log(getParser());
            setTimeout(function () {
                tellEnterUserName();
            }, 200);

        }
    });
}

function tellEnterUserName()
{
    inquirer.prompt([{
        type: 'input',
        name: 'user',
        message: 'Enter the user name you wanna find in DB: ',
        validate(value){
            if(value.match(/^[a-zA-za-яA-Я\-_]+$/) === null){
                return 'Please enter a valid name!';
            }
            return true;
        }
    }]).then((answers) => {
        getUserByName(answers.user);
    });
}

function getParser()
{
    return papa.parse(fs.readFileSync(__dirname+'/db.csv', {encoding:'utf8', flag:'r'}).trim(), {header: true}).data;
}

function getUserByName(name)
{
    let csv = getParser();
    let result = csv.filter(row => row.user === name)
    if(result.length === 0){
        console.log('User not found!');
    } else {
        for(let key in result){
            console.log(JSON.stringify(result[key]))
        }
    }
}

run();



