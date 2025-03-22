// from chatgpt
export class SVM {
    constructor(learningRate = 0.01, lambda = 0.01, epochs = 1000) {
        this.learningRate = learningRate; // Step size for gradient descent
        this.lambda = lambda; // Regularization parameter to control margin softness
        this.epochs = epochs; // Number of training iterations
        this.w = [0, 0]; // Initialize weight vector (for 2D input space)
        this.b = 0; // Initialize bias term
    }

    train(data) {
        for (let epoch = 0; epoch < this.epochs; epoch++) { // Loop over epochs
            for (let i = 0; i < data.length; i++) { // Loop over all training data points
                let [x, y, label] = data[i]; // Extract x, y coordinates and label (+1 or -1)
                let margin = label * (this.w[0] * x + this.w[1] * y + this.b); // Compute margin

                if (margin >= 1) {
                    // If correctly classified (margin is sufficient), apply only regularization
                    this.w[0] -= this.learningRate * this.lambda * this.w[0]; // Update weight w0
                    this.w[1] -= this.learningRate * this.lambda * this.w[1]; // Update weight w1
                } else {
                    // If misclassified, apply hinge loss gradient update
                    this.w[0] -= this.learningRate * (this.lambda * this.w[0] - label * x); // Update w0
                    this.w[1] -= this.learningRate * (this.lambda * this.w[1] - label * y); // Update w1
                    this.b -= this.learningRate * (-label); // Update bias term
                }
            }
        }
    }

    predict(x, y) {
        // Compute the decision function value
        let result = this.w[0] * x + this.w[1] * y + this.b;
        return result >= 0 ? 1 : -1; // Return class label based on sign
    }
} 

// Example Usage
// const data = [
//     [2, 3, 1], [1, 1, 1], [3, 2, 1],   // Red class (+1)
//     [5, 5, -1], [6, 6, -1], [7, 8, -1] // Blue class (-1)
// ];

// let svm = new SVM(0.01, 0.01, 1000); // Create SVM instance with learning rate, lambda, and epochs
// svm.train(data); // Train SVM on given data

// console.log(svm.predict(4, 4)); // Predict class label for a new point (4,4)
