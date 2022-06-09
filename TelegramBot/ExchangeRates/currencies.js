const axios = require('axios').default;
const cc = require('currency-codes');
const banks = {
  "bank-1" : "Приват Банк",
  "bank-2" : "Monobank",
};
const baseCurr = "UAH";
const currencies = ["USD", "EUR"];

const banksApiUrls = {
    "1" : "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    "2" : "https://api.monobank.ua/bank/currency"
};

const getExchangeRates = async (bankId) => {
    let date = new Date(Date.now());
    let msg = `"${banks[`bank-${bankId}`]}" - ${date.toLocaleString()}\n`;
    try {
        let response = await axios.get(banksApiUrls[bankId]);
        if(response.status === 200){
            switch (bankId){
              case "1" : msg = msg + prepareMessage(response.data);
                break;
              case "2" : msg = msg + parseDataFromMono(response.data);
            }
        }
    } catch (err){
      console.log(err);
    }
    return msg;
}

const prepareMessage = (data) => {
    let msg = '';
    for (let i=0; i<data.length; i++){
        if(currencies.indexOf(`${data[i].ccy}`) !== -1){
            let ccy = `${data[i].ccy}`;
            let buy = `${data[i].buy.substr(0, 5)} ${baseCurr}`;
            let sale = `${data[i].sale.substr(0, 5)} ${baseCurr}`;
            msg = msg + `${ccy}\n   Покупка - ${buy}\n   Продажа - ${sale}\n`;
        }
    }
     return msg;
}

const parseDataFromMono = (data) => {
    let arr = [];
    let currCodes = arrayColumn(data, 'currencyCodeA');
    for (let k in currencies){
        let obj = {};
        let currency = cc.code(currencies[k]);
        let index = currCodes.indexOf(parseInt(currency.number));
        obj.ccy = currencies[k];
        obj.buy = data[index].rateBuy.toFixed(2);
        obj.sale = data[index].rateSell.toFixed(2);
        arr.push(obj);
    }
    return prepareMessage(arr);
}

const arrayColumn = (array, column) => {
    return array.map(item => item[column]);
};

module.exports = { getExchangeRates, banks, banksApiUrls };
