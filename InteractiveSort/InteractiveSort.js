const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

run();

function run()
{
    readline.question("Hello! Enter 10 words or digits deviding them in space:", (str) => {
        let questions = 'How would you like to sort values?\n' +
            '1. Sort words alphabetically. \n' +
            '2. Display numbers from smallest to largest\n' +
            '3. Display numbers from highest to lowest\n' +
            '4. Display words in ascending order by number of letters in words\n' +
            '5. Show only selected words\n' +
            'To exit the program, it is enough to type `exit` in case the program will repeat itself over and over again, requesting new data and sorting sources.\n';
        console.log('you entered: '+ str);
        console.log(questions);
        askQuestion(str.trim());
    })
}

function askQuestion(str)
{
    readline.question("Select (1 - 5) and press Enter: ", (select) => {
        let array = ['1', '2', '3', '4', '5'];
        if(array.indexOf(select) !== -1){
            switch(select) {
                case '1':
                    console.log(strSplit(str).sort());
                    break;
                case '2':
                    console.log(sortNumbers(getNumArray(str), 'min'));
                    break;
                case '3':
                    console.log(sortNumbers(getNumArray(str), 'max'));
                    break;
                case '4':
                    console.log(sortWordsOfLetters(str));
                    break;
                case '5':
                    console.log(strSplit(str).filter(onlyUnique));
                    break;
                default:
                // code block
            }
            run(str);
        } else if(select === 'exit') {
            readline.close();
        } else {
            console.log('incorrect select! Try again');
            askQuestion(str);
        }
    })
}

function strSplit(str)
{
    return str.split(' ');
}

function getNumArray(string)
{
    let resultArray = [];
    let strArray = strSplit(string);
    for(let key in strArray){
        let num = strArray[key].match(/\d+/);
        if(num !== null){
            resultArray.push(parseInt(num));
        }
    }
    return resultArray;
}

function sortNumbers(numArray, first){
    numArray.sort(function (a, b){
        return (first === 'min')? a-b : b-a;
    });
    return numArray;
}

function sortWordsOfLetters(string)
{
   let strArray = strSplit(string);
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

function onlyUnique(value, index, self)
{
    return self.indexOf(value) === index;
}
