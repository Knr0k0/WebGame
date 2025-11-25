import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

// Initialize TensorFlow
export const initializeTensorFlow = async () => {
  try {
    await tf.ready();
    const backend = tf.getBackend();
    console.log('TensorFlow.js initialized with backend:', backend);
    return true;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    return false;
  }
};

// Example: Predict gesture from tensor data
export const predictGesture = async (inputData, model) => {
  if (!model) {
    console.warn('Model not loaded');
    return null;
  }

  try {
    // Convert input to tensor and make prediction
    const tensor = tf.tensor(inputData);
    const prediction = model.predict(tensor);
    const result = await prediction.data();
    
    // Clean up tensors
    tensor.dispose();
    prediction.dispose();
    
    return result;
  } catch (error) {
    console.error('Prediction error:', error);
    return null;
  }
};

// Load a custom model
export const loadCustomModel = async (modelPath) => {
  try {
    const model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
};

// Dispose of tensors to free memory
export const disposeTensors = (tensors) => {
  if (Array.isArray(tensors)) {
    tensors.forEach(tensor => tensor?.dispose?.());
  } else {
    tensors?.dispose?.();
  }
};
