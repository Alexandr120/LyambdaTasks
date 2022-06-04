let inquirer = require('inquirer');
let fs = require('fs');
let userData = {};

const run = () => {
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

const next = () =>{
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

const setDataToDb = () => {
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

const tellShowUsersList = () => {
    inquirer.prompt([{
        type: 'confirm',
        name: 'list',
        message: 'Would you to search values in DB?',
        default: false
    }]).then((answers) => {
        if(answers.list){
            console.log(getParser());
            setTimeout(function () {
                tellEnterUserName();
            }, 200);

        }
    });
}

const tellEnterUserName = () => {
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

const getParser = () => {
    let result = [];
    let strArr = fs.readFileSync(__dirname+'/db.csv', {encoding:'utf8', flag:'r'}).trim().split('\n');
    let headers = strArr[0].split(',');
    for(let i=1; i<strArr.length; i++){
        let userDataArray = strArr[i].split(',');
        let obj = {};
        for(let j=0; j<userDataArray.length; j++){
            obj[headers[j]] = userDataArray[j];
        }
        result.push(obj);
    }
    return result;
}

const getUserByName = (name) => {
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



