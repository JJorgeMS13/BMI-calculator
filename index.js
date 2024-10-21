const metric = document.getElementById('metric');
const imperial = document.getElementById('imperial');
const containerInput1 = document.getElementById('container-input1');
const containerInput2 = document.getElementById('container-input2');
const score = document.getElementById('score');
const rangeElement = document.getElementById('range');
const classificationElement = document.getElementById('classification');
const paragraph = document.getElementById('paragraph');

function createElement(inputOptions) {

    
    for (let index = 0; index < inputOptions.length; index++) {
        const p = document.createElement('p');
        const label = document.createElement('label');
        const span = document.createElement('span');
        const input = document.createElement('input');
        const spanMedida = document.createElement('span');

        label.setAttribute('for', 'height');
        label.textContent = inputOptions[index].nameLabel;

        span.classList.add('input-group')

        input.setAttribute('type', 'number');
        input.setAttribute('id', inputOptions[index].measurement);
        input.setAttribute('name', 'height');

        spanMedida.textContent = inputOptions[index].measurement;


        p.appendChild(label);
        span.appendChild(input);
        span.appendChild(spanMedida);
        p.appendChild(span);

        if (inputOptions[index].nameLabel === "Height") {
            containerInput1.appendChild(p);
        } else if (inputOptions[index].nameLabel === "Weight"){
            containerInput2.appendChild(p);
        }
        
        
    }
}

function checkSelected() {
    classificationElement.textContent = "";
    rangeElement.textContent = "";
    paragraph.textContent = "Enter your height and weight and you'll see your BMI result here.";
    score.textContent = "0.0";
    clearElementHMTL(containerInput1);
    clearElementHMTL(containerInput2);
    if (metric.checked) {
        const inputOptions = [
            { type: 'metric', nameLabel: 'Height', measurement: 'cm'},
            { type: 'metric', nameLabel: 'Weight', measurement: 'kg'},
        ];
        
        createElement(inputOptions);
    } else if (imperial.checked) {
        const inputOptions = [
            { type: 'imperial', nameLabel: 'Height', measurement: 'ft'},
            { type: 'imperial', nameLabel: 'Height', measurement: 'in'},
            { type: 'imperial', nameLabel: 'Weight', measurement: 'st'},
            { type: 'imperial', nameLabel: 'Weight', measurement: 'lbs'},
        ];

        createElement(inputOptions);
    }

}

function clearElementHMTL(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function handlerRadio() {
    const radios = document.getElementsByName('measurement-system');
    for (const radio of radios) {
        radio.addEventListener('change', checkSelected);
    }
}

function calculateBMIMetric(height, weight) {
    let result  = weight / Math.pow((height / 100), 2) ;
    
    return Math.round(result * 10) / 10;
}

function calculateBMImperial(height, weight) {

    let result  = (weight / Math.pow(height, 2)) * 703;    
    return Math.round(result * 10) / 10;
}

function calculateRangeWeight(imc, height) {
    
    let range = imc * Math.pow((height/100), 2);
    return Math.round(range * 10) / 10;
}
function calculateRangeWeightLbs(imc, height) {
    
    let range = imc * Math.pow((height), 2) / 703;
    return Math.round(range * 10) / 10;
}
function fillElement(valueHeight, valueWeight, option) {
    
    if (valueHeight === "0" || valueWeight === "0" || valueHeight === '' || valueWeight === '') {
        return;
    } else {
        
        let bmi = 0;   
        let minWeight = 0;
        let maxWeight = 0;
        let unitMeasurement = ''
        
        if (option === 'metric') {
            bmi = calculateBMIMetric(valueHeight, valueWeight);
            minWeight = calculateRangeWeight(18.5, valueHeight);
            maxWeight = calculateRangeWeight(24.9, valueHeight);
            unitMeasurement = 'kgs';
            rangeElement.textContent = `Your ideal weight is between ${minWeight} ${unitMeasurement} - ${maxWeight} ${unitMeasurement}`;
        } else if (option === 'imperialLbs'){
            bmi = calculateBMImperial(valueHeight, valueWeight);
            minWeight = calculateRangeWeightLbs(18.5, valueHeight);
            maxWeight = calculateRangeWeightLbs(24.9, valueHeight);
            unitMeasurement = 'lbs';
            rangeElement.textContent = `Your ideal weight is between ${minWeight} ${unitMeasurement} - ${maxWeight} ${unitMeasurement}`;
        } else if (option === 'imperialSt'){
            let weightStMin = 0;
            let weightStMax = 0;
            /* Convertir  stones a lbs*/
            valueWeight =  valueWeight * 14;
            /* Convertir pies a pulgadas */
            valueHeight = valueHeight * 12;
            
            bmi = calculateBMImperial(valueHeight, valueWeight);
            minWeight = calculateRangeWeightLbs(18.5, valueHeight);
            weightStMin = Math.round((minWeight / 14) * 10) / 10;

            maxWeight = calculateRangeWeightLbs(24.9, valueHeight);
            weightStMax = Math.round((maxWeight  /14) * 10) / 10;
            rangeElement.textContent = `Your ideal weight is between ${minWeight} lbs ${weightStMin} st - ${maxWeight} lbs ${weightStMax} st`;
        }
        score.textContent = bmi;


        let text = "Your BMI suggests you're ";
        paragraph.textContent = '';
        if (valueWeight >= minWeight  && valueWeight <= maxWeight) {
            classificationElement.textContent = text + 'a healthy weight.';
        } else if (valueWeight < minWeight){
            classificationElement.textContent = text + 'a low weight.';
        } else if (valueWeight > maxWeight){
            classificationElement.textContent = text + 'a high weight.';
        }
    }
}
function noNumberNegative(element) {
    if (element.value < 0) {
        element.value = 0;
      }
}
handlerRadio();

window.onload = function() {
    metric.checked = true;
    
    //crear y despachar un evento change.
    const event = new Event('change');
    metric.dispatchEvent(event);
    getInputMetric();

}
function getInputMetric() {
    const inputCm = document.getElementById('cm');
    const inputKg = document.getElementById('kg');

    inputCm.addEventListener('input', () => {
        noNumberNegative(inputCm);
        let valuCM = inputCm.value;
        let valuKg = inputKg.value;
        fillElement(valuCM, valuKg, 'metric');
    });

    inputKg.addEventListener('input', () => {  
        noNumberNegative(inputKg);
        let valuCM = inputCm.value;
        let valuKg = inputKg.value;   
        fillElement(valuCM, valuKg, 'metric');
    });
}
function getInputImperial() {
    if (imperial.checked) {
        const inputIn = document.getElementById('in');
        const inputLbs = document.getElementById('lbs');

        inputIn.addEventListener('input', () => {
            noNumberNegative(inputIn);
            let valueHeight = inputIn.value;
            let valueWeight = inputLbs.value;
            
            fillElement(valueHeight, valueWeight, 'imperialLbs');
        });
        inputLbs.addEventListener('input', () => {
            noNumberNegative(inputLbs);
            let valueHeight = inputIn.value;
            let valueWeight = inputLbs.value;
            
            fillElement(valueHeight, valueWeight, 'imperialLbs');
        });

        const inputFt = document.getElementById('ft');
        const inputSt = document.getElementById('st');

        inputFt.addEventListener('input', () => {
            noNumberNegative(inputFt);
            let valueHeight = inputFt.value;
            let valueWeight = inputSt.value;
            
            fillElement(valueHeight, valueWeight, 'imperialSt');
        });
        inputSt.addEventListener('input', () => {
            noNumberNegative(inputSt);
            let valueHeight = inputFt.value;
            let valueWeight = inputSt.value;
            
            fillElement(valueHeight, valueWeight, 'imperialSt');
        });

    }
}
metric.addEventListener('change', () => {
    getInputMetric();
});
imperial.addEventListener('change', () => {
    getInputImperial();
});