'use strict';
import * as tf from '@tensorflow/tfjs';

let celToFerData = [];
let ferToCelData = [];

for (let i = -500; i < 5000; i++) {
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

console.log('boom! test data', celToFerData, ferToCelData);

// configure the model
const config = {
    epochs: 15,
    loss: 'meanSquaredError',
    optimizer: tf.train.adam(0.1)
}
const model = tf.sequential();
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
    training.inputs.push([entry.c]);
    training.labels.push([entry.f]);
}

function onEpochEnd(data, logs) {
    console.log("epoc ended!", data, logs);
}
// train && predict the things!
model.fit(
    tf.tensor(training.inputs),
    tf.tensor(training.labels),
    {
        epochs: config.epochs,
        callbacks: { onEpochEnd }
    }).then((res) => {
        console.log("done!", res);
        const prediction = model.predict(tf.tensor([40]));
        const predictionPromise = prediction.data();

        predictionPromise.then((result) => {
            console.log("40 cel => fer ",result[0] * 100);
        });
    });
