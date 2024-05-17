let conversionRate
let newCurrency
let currencySymbols = {
    EUR: "€",
    MXN: "M$",
    JPY: "¥",
    CAD: "CA$",
}
let measurementConversionRates = {
    millimeter: 10,
    centimeter: 1,
    meter: 0.01,
    kilometer: 0.00001,
    inch: 0.393701,
    foot: 0.0328084,
    yard: 0.0109361,
    mile: 0.00000621371,
}
let volumeConversionRates = {
    usLiquidGallon: 0.264172,
    usLiquidQuart: 1.05669,
    usLiquidPint: 2.11338,
    usLegalCup: 4.16667,
    usFluidOunce: 33.814,
    usTablespoon: 67.628,
    usTeaspoon: 202.884,
    cubicMeter: 0.001,
    liter: 1,
    milliliter: 1000,
    imperialGallon: 0.219969,
    imperialQuart: 0.879877,
    imperialPint: 1.75975,
    imperialCup: 3.51951,
    imperialFluidOunce: 35.1951,
    imperialTablespoon: 56.3121,
    imperialTeaspoon: 168.936,
    cubicFoot: 0.0353147,
    cubicInch: 61.0237,
}
let massConversionRates = {
    metricTon: 0.001,
    kilogram: 1, 
    gram: 1000,
    milligram: 1000000,
    microgram: 1000000000,
    imperialTon: 0.000984207,
    usTon: 0.000984207,
    stone: 0.157473,
    pound: 2.20462,
    ounce: 35.274,
}
let areaConversionRates = {
    squareKilometer: 0.000001,
    squareMeter: 1,
    squareMile: 0.000000386102159,
    squareYard: 1.19599,
    squareFoot: 10.7639,
    squareInch: 1550,
    hectare: 0.0001,
    acre: 0.000247105,
}
let activeConverter = 0
let converters = [
    document.getElementById("measurementBox"),
    document.getElementById("volumeBox"),
    document.getElementById("massBox"),
    document.getElementById("areaBox"),
]
let api
class Freecurrencyapi {
    baseUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=';

    constructor(apiKey = '') {
        this.headers = {
            apikey: apiKey
        };
    }

    async call (endpoint, params = {}) {
        const paramString = new URLSearchParams({
            ...params
        }).toString();
        return fetch(`${this.baseUrl}${endpoint}?${paramString}`, { headers: this.headers })
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    status () {
        return this.call('status');
    }

    currencies (params) {
        return this.call('currencies', params);
    }

    latest (params) {
        return this.call('latest', params);
    }

    historical (params) {
        return this.call('historical', params);
    }

}
function convertCurrency() {
    api = new Freecurrencyapi('fca_live_qgFGVAsX4V7RiwoK1D8OtUvB0TtCFeqa3qhqyNX5')
    let oldAmount = Number(document.getElementById('initialCurrencyAmount').value)
    newCurrency = document.getElementById('selectedCurrency').value
    if (!oldAmount) {
        alert("Please input an amount.")
    }
    if (newCurrency != "Select a Currency") {
        document.getElementById('outputCurrencyAmount').value = "~~~~~~"
        api.currencies({
            base_currency: 'USD',
            currencies: newCurrency
        }).then(response => {
            conversionRate = response.data[newCurrency];
            let newAmount = String(Math.round((oldAmount * conversionRate)*100)/100)
            let split = newAmount.split('.')
            for (var x = split[1].length; x < 2; x++) {
                split[1] += "0"
            }
            document.getElementById('outputCurrencyAmount').value = currencySymbols[newCurrency] + split[0] + "." + split[1] + " - " + newCurrency
        });
    } else {
        alert("Please Select a Currency")
    }
}
function convertMeasurements() {
    let oldAmount = Number(document.getElementById('initialMeasurementAmount').value)
    let oldMeasurement = document.getElementById('oldMeasurement').value
    let newMeasurement = document.getElementById('selectedMeasurement').value
    let outputAmount = (oldAmount/measurementConversionRates[oldMeasurement]) * measurementConversionRates[newMeasurement]
    if (outputAmount > 0.0001 && outputAmount < 1) {
        outputAmount = Math.round(outputAmount*100000)/100000
    } else if (outputAmount > 0.0001 && outputAmount > 1) {
        outputAmount = Math.round(outputAmount*1000)/1000
    } else {
        outputAmount = Math.round(outputAmount*1000000)/1000000
    }
    document.getElementById('outputMeasurementAmount').value = outputAmount
}
function convertVolumes() {
    let oldAmount = Number(document.getElementById('initialVolumeAmount').value)
    let oldVolume = document.getElementById('oldVolume').value
    let newVolume = document.getElementById('selectedVolume').value
    let outputAmount = (oldAmount/volumeConversionRates[oldVolume]) * volumeConversionRates[newVolume]
    if (outputAmount > 0.0001 && outputAmount < 1) {
        outputAmount = Math.round(outputAmount*100000)/100000
    } else if (outputAmount > 0.0001 && outputAmount > 1) {
        outputAmount = Math.round(outputAmount*1000)/1000
    } else {
        outputAmount = Math.round(outputAmount*1000000)/1000000
    }
    document.getElementById('outputVolumeAmount').value = outputAmount
}
function convertMasses() {
    let oldAmount = Number(document.getElementById('initialMassAmount').value)
    let oldMass = document.getElementById('oldMass').value
    let newMass = document.getElementById('selectedMass').value
    let outputAmount = (oldAmount/massConversionRates[oldMass]) * massConversionRates[newMass]
    if (outputAmount > 0.0001 && outputAmount < 1) {
        outputAmount = Math.round(outputAmount*100000)/100000
    } else if (outputAmount > 0.0001 && outputAmount > 1) {
        outputAmount = Math.round(outputAmount*1000)/1000
    } else {
        outputAmount = Math.round(outputAmount*1000000)/1000000
    }
    document.getElementById('outputMassAmount').value = outputAmount
}
function convertAreas() {
    let oldAmount = Number(document.getElementById('initialAreaAmount').value)
    let oldArea = document.getElementById('oldArea').value
    let newArea = document.getElementById('selectedArea').value
    let outputAmount = (oldAmount/areaConversionRates[oldArea]) * areaConversionRates[newArea]
    if (outputAmount > 0.0001 && outputAmount < 1) {
        outputAmount = Math.round(outputAmount*100000)/100000
    } else if (outputAmount > 0.0001 && outputAmount > 1) {
        outputAmount = Math.round(outputAmount*1000)/1000
    } else {
        outputAmount = Math.round(outputAmount*1000000)/1000000
    }
    document.getElementById('outputAreaAmount').value = outputAmount
}
function changeConverter(x) {
    if (x != activeConverter) {
        converters[activeConverter].classList.add('d-none')
        converters[x].classList.remove('d-none')
        activeConverter = x
    }
}