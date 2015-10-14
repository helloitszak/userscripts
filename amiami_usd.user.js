
// ==UserScript==
// @name         AmiAmi USD
// @namespace    http://safarimike.net
// @version      0.1
// @description  Adds USD to AmiAmi pages
// @author       魔法少女ザッコちゃん
// @include      http://amiami.com/*
// @include      http://*.amiami.com/*
// ==/UserScript==

var regex = /([\d,]+)\s+JPY/;

function addUsd(exchangeRate) {
    $(".price").each(function(i, ele) {
        var text = ele.innerText.match(regex)[1];
        var cleanText = parseInt(text.replace(",",""));

        var output = (cleanText * exchangeRate).toFixed(2);

        $(ele).append("<br />$" + output + " USD");
    });
}

if (localStorage.getItem("exchangeRate_lastUpdated") &&
    parseInt(localStorage.getItem("exchangeRate_lastUpdated")) < (Date.now() / 1000 | 0) &&
    localStorage.getItem("exchangeRate_value")) {
    console.log("hit cache, getting exchange rate from localStorage");

    addUsd(parseFloat(localStorage.getItem("exchangeRate_value")));
} else {
    $.ajax({
        url: "http://api.fixer.io/latest?base=JPY&symbols=USD",
        jsonp: "callback",
        dataType: "jsonp",
        success: function(t) {
            console.log("hit API, saving exchange rate to localStorage");
            localStorage.setItem("exchangeRate_lastUpdated", (Date.now / 1000 | 0) + 86400);
            localStorage.setItem("exchangeRate_value", 0.00);
            addUsd(t.rates.USD);
        }
    });
}
