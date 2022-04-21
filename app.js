'use strict';
import * as tf from '@tensorflow/tfjs';

/**
 * Setup Data
 */

let celToFerData = [];
let ferToCelData = [];

for (let i = -500; i < 50000; i++) {
    celToFerData.push({
        c: i,
        f: (i * 1.8) + 32
    });
}
for (let i = -500; i < 5000; i++) {
    ferToCelData.push({
        c: (i - 32) * 0.5556,
        f: i,
    });
}

/**
 * State
 */

let modelLoaded = false;

/**
 * tfjs model
 */

console.log('boom! test data', celToFerData, ferToCelData);
// configure the model
const config = {
    epochs: 5,
    loss: 'meanSquaredError',
    optimizer: tf.train.adam(0.1)
}
let model = tf.sequential();
model.add(tf.layers.dense({
    inputShape: [1],
    activation: 'sigmoid',
    units: 5
}));
model.add(tf.layers.dense({
    inputShape: [5],
    activation: 'sigmoid',
    units: 3
}));
model.add(tf.layers.dense({
    inputShape: [3],
    activation: 'sigmoid',
    units: 1
}));
model.compile({
    loss: config.loss,
    optimizer: config.optimizer
});


// group training data with expected result
const training = {
    inputs: [],
    labels: []
};
for (let entry of celToFerData) {
    training.inputs.push(entry.c);
    training.labels.push(entry.f);
}


function onEpochEnd(data, logs) {
    console.log("epoc ended!", data, logs);
}



/**
 * train
 * 
 * Uses the generated test data to train a model, 
 * it then stores this model in local storage
 */
async function train() {
    model.fit(
        tf.tensor1d(training.inputs),
        tf.tensor1d(training.labels),
        {
            epochs: config.epochs,
            callbacks: { onEpochEnd }
        }).then(async (res) => {
            console.log("done!", res);

            await model.save('localstorage://converter-tt-1');

            const prediction = model.predict(tf.tensor([40]));
            const predictionPromise = prediction.data();

            predictionPromise.then((result) => {
                console.log("40 cel => fer ", result[0] * 100);
            });
        });
}


/**
 * hasModelLoaded
 * 
 * Loads the saved model from local storeage, if no model is found,
 * then the train function is triggered
 * 
 */
async function hasModelLoaded() {
    try {
        model = await tf.loadLayersModel('localstorage://converter-tt-1');
        modelLoaded = true;
        console.log("model", model);
    } catch (error) {
        console.log(error);
        train();
    }
}
hasModelLoaded();


/**
 * predict
 * 
 * Loads the saved model, the value from the input
 * then attempts to predict the appropriate converted value
 * 
 */
function predict() {
    // get input value
    // get model from local store
    // predict
    // display prediction
}

module.exports = { predict }