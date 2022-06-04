const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
let string = '';
let strArray = '';

run();

function run()
{
    readline.question("Hello! Enter 10 words or digits deviding them in space:", (str) => {
        string = str;
        strArray = str.trim().split(' ');
        let questions = 'How would you like to sort values?\n' +
            '1. Sort words alphabetically. \n' +
            '2. Display numbers from smallest to largest\n' +
            '3. Display numbers from highest to lowest\n' +
            '4. Display words in ascending order by number of letters in words\n' +
            '5. Show only selected words\n' +
            '6. Show unique value from string\n' +
            'To exit the program, it is enough to type `exit` in case the program will repeat itself over and over again, requesting new data and sorting sources.\n';
        console.log('you entered: '+ str);
        console.log(questions);
        askQuestion();
    })
}
const askQuestion = () => {
    readline.question("Select (1 - 5) and press Enter: ", (select) => {
        let array = ['1', '2', '3', '4', '5', '6'];
        if(array.indexOf(select) !== -1){
            switch(select) {
                case '1':
                    console.log(strArray.sort());
                    break;
                case '2':
                    console.log(sortNumbers(getNumArray(), 'min'));
                    break;
                case '3':
                    console.log(sortNumbers(getNumArray(), 'max'));
                    break;
                case '4':
                    console.log(sortWordsOfLetters());
                    break;
                case '5':
                    console.log(showUniqueWords());
                    break;
                case '6':
                    console.log(strArray.filter(onlyUnique));
                    break;
                default:
                // code block
            }
            run();
        } else if(select === 'exit') {
            readline.close();
        } else {
            console.log('incorrect select! Try again');
            askQuestion();
        }
    });
}
const getNumArray = () => {
    let resultArray = [];
    for(let key in strArray){
        if(!isNaN(strArray[key])){
            resultArray.push(strArray[key]);
        }
    }
    return resultArray;
}

const sortNumbers = (numArray, first) => {
    numArray.sort(function (a, b){
        return (first === 'min')? a-b : b-a;
    });
    return numArray;
}

const sortWordsOfLetters = () => {
    strArray.sort(function (a, b) {
        if (a.length < b.length) {
            return -1;
        }
        if (a.length > b.length) {
            return 1;
        }
        return 0;
    });
    return strArray;
}

const showUniqueWords = () => {
    let resultArray = [];
    for(let key in strArray){
        if(isNaN(strArray[key])){
            resultArray.push(strArray[key]);
        }
    }
    return resultArray.filter(onlyUnique);
}

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}
