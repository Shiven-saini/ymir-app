'use client'

import { useState, useRef, useEffect } from 'react'
import * as ort from 'onnxruntime-web'

export default function WebcamSection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  
  const classNames = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 
    'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 
    'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 
    'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 
    'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 
    'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
  ];

  // Load ONNX model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        
        // Configure ONNX Runtime Web with correct paths
        ort.env.wasm.wasmPaths = {
          'ort-wasm-simd-threaded.wasm': '/ort-wasm-simd-threaded.wasm',
          'ort-wasm-simd-threaded.jsep.wasm': '/ort-wasm-simd-threaded.jsep.wasm'
        };

        // Create session with fallback providers
        const sessionOptions = {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        };
        
        const session = await ort.InferenceSession.create('/yolov8n.onnx', sessionOptions);
        
        setModel(session);
        console.log("YOLOv8 model loaded successfully with inputs:", session.inputNames);
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadModel();
  }, []);

  // Set up webcam access
  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        return () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    
    enableStream();
  }, []);

  // Process frames for detection
  useEffect(() => {
    if (!model || !videoRef.current || !stream) return;
    
    // Create a canvas for preprocessing
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    
    // Function to preprocess input image
    const prepareInput = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return null;
      
      // Draw video frame to canvas
      ctx.drawImage(
        videoRef.current, 
        0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
        0, 0, 640, 640
      );
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, 640, 640);
      const { data } = imageData;
      
      // Preprocess image data to CHW format
      const inputData = new Float32Array(3 * 640 * 640);
      
      for (let y = 0; y < 640; y++) {
        for (let x = 0; x < 640; x++) {
          const pixelIndex = (y * 640 + x) * 4; // RGBA
          
          // RGB channels in CHW order
          inputData[0 * 640 * 640 + y * 640 + x] = data[pixelIndex] / 255.0;     // R
          inputData[1 * 640 * 640 + y * 640 + x] = data[pixelIndex + 1] / 255.0; // G
          inputData[2 * 640 * 640 + y * 640 + x] = data[pixelIndex + 2] / 255.0; // B
        }
      }
      
      return inputData;
    };

    // Calculate IoU (Intersection over Union) between two boxes
    const calculateIoU = (boxA, boxB) => {
      // Convert from center coordinates to corners
      const boxAX1 = boxA.x - boxA.w / 2;
      const boxAY1 = boxA.y - boxA.h / 2;
      const boxAX2 = boxA.x + boxA.w / 2;
      const boxAY2 = boxA.y + boxA.h / 2;
      
      const boxBX1 = boxB.x - boxB.w / 2;
      const boxBY1 = boxB.y - boxB.h / 2;
      const boxBX2 = boxB.x + boxB.w / 2;
      const boxBY2 = boxB.y + boxB.h / 2;
      
      // Calculate intersection area
      const xOverlap = Math.max(0, Math.min(boxAX2, boxBX2) - Math.max(boxAX1, boxBX1));
      const yOverlap = Math.max(0, Math.min(boxAY2, boxBY2) - Math.max(boxAY1, boxBY1));
      const intersectionArea = xOverlap * yOverlap;
      
      // Calculate union area
      const boxAArea = (boxAX2 - boxAX1) * (boxAY2 - boxAY1);
      const boxBArea = (boxBX2 - boxBX1) * (boxBY2 - boxBY1);
      const unionArea = boxAArea + boxBArea - intersectionArea;
      
      // Return IoU
      return intersectionArea / unionArea;
    };

    // Perform Non-Maximum Suppression (NMS)
    const nonMaxSuppression = (boxes, scores, iouThreshold = 0.5) => {
      // Create indices array
      const indices = Array.from(Array(scores.length).keys());
      
      // Sort indices by score in descending order
      indices.sort((a, b) => scores[b] - scores[a]);
      
      const keepIndices = [];
      
      // NMS algorithm
      while (indices.length > 0) {
        const currentIndex = indices[0];
        keepIndices.push(currentIndex);
        
        // Filter indices based on IoU
        indices.splice(0, 1); // Remove current index
        
        const remainingIndices = [];
        
        for (let i = 0; i < indices.length; i++) {
          const iou = calculateIoU(boxes[currentIndex], boxes[indices[i]]);
          
          if (iou <= iouThreshold) {
            remainingIndices.push(indices[i]);
          }
        }
        
        indices.length = 0;
        indices.push(...remainingIndices);
      }
      
      return keepIndices;
    };

    // Function to run detection
    const runDetection = async () => {
      try {
        // Prepare input data
        const inputData = await prepareInput();
        if (!inputData) return;
        
        // Create input tensor
        const inputTensor = new ort.Tensor('float32', inputData, [1, 3, 640, 640]);
        
        // Run model
        const feeds = {};
        feeds[model.inputNames[0]] = inputTensor;
        const outputMap = await model.run(feeds);
        
        // Get output
        const output = outputMap[model.outputNames[0]];
        const outputData = output.data;
        const outputShape = output.dims;
        
        // Determine output format based on shape
        let rows, cols;
        
        if (outputShape[1] === 84 || (outputShape.length > 1 && outputShape[1] > outputShape[2])) {
          // Format: [1, 84, 8400]
          rows = outputShape[2]; // 8400
          cols = outputShape[1]; // 84
        } else {
          // Format: [1, 8400, 84]
          rows = outputShape[1]; // 8400
          cols = outputShape[2]; // 84
        }
        
        // Higher confidence thresholds to reduce false positives
        // Person detections need a higher threshold
        const personConfidenceThreshold = 0.7; // Much higher for person class
        const phoneConfidenceThreshold = 0.5; // Standard for phone class
        
        // Process detections
        const personBoxes = [];
        const personScores = [];
        const phoneBoxes = [];
        const phoneScores = [];
        
        // Extract detections based on format
        if (outputShape[1] === 84 || (outputShape.length > 1 && outputShape[1] > outputShape[2])) {
          // Format: [1, 84, 8400]
          // Process each of the 8400 predictions
          for (let i = 0; i < rows; i++) {
            // Get coordinates
            const x = outputData[0 * rows + i]; // center_x
            const y = outputData[1 * rows + i]; // center_y
            const w = outputData[2 * rows + i]; // width
            const h = outputData[3 * rows + i]; // height
            
            // Person class (index 0)
            const personScore = outputData[(4 + 0) * rows + i];
            
            // Phone class (index 67)
            const phoneScore = outputData[(4 + 67) * rows + i];
            
            // Check for person detections with high confidence
            if (personScore > personConfidenceThreshold) {
              personBoxes.push({ x, y, w, h });
              personScores.push(personScore);
            }
            
            // Check for phone detections
            if (phoneScore > phoneConfidenceThreshold) {
              phoneBoxes.push({ x, y, w, h });
              phoneScores.push(phoneScore);
            }
          }
        } else {
          // Format: [1, 8400, 84]
          for (let i = 0; i < rows; i++) {
            // Get coordinates
            const x = outputData[i * cols + 0]; // center_x
            const y = outputData[i * cols + 1]; // center_y
            const w = outputData[i * cols + 2]; // width
            const h = outputData[i * cols + 3]; // height
            
            // Person class (index 0)
            const personScore = outputData[i * cols + 4 + 0];
            
            // Phone class (index 67)
            const phoneScore = outputData[i * cols + 4 + 67];
            
            // Check for person detections with high confidence
            if (personScore > personConfidenceThreshold) {
              personBoxes.push({ x, y, w, h });
              personScores.push(personScore);
            }
            
            // Check for phone detections
            if (phoneScore > phoneConfidenceThreshold) {
              phoneBoxes.push({ x, y, w, h });
              phoneScores.push(phoneScore);
            }
          }
        }
        
        // Apply NMS with a high IoU threshold for persons (0.7 means boxes need to overlap a lot to be merged)
        const personKeepIndices = nonMaxSuppression(personBoxes, personScores, 0.7);
        const phoneKeepIndices = nonMaxSuppression(phoneBoxes, phoneScores, 0.5);
        
        // Get final counts after NMS
        const finalPersonCount = personKeepIndices.length;
        const finalPhoneCount = phoneKeepIndices.length;
        
        console.log(`After filtering: ${finalPersonCount} people, ${finalPhoneCount} phones`);
        
        // Update debug info
        setDebugInfo({
          peopleCount: finalPersonCount,
          phonesCount: finalPhoneCount
        });
        
        // Only generate warning if STRICTLY more than 1 person is detected
        if (finalPersonCount > 1) {
          const now = new Date();
          const timestamp = now.toLocaleTimeString();
          setWarnings(prev => {
            // Check if we already warned about multiple people recently
            const lastWarning = prev[0];
            if (lastWarning && 
                lastWarning.message.includes("Multiple people") && 
                (Date.now() - lastWarning.id) < 5000) {
              return prev; // Skip to avoid duplicates
            }
            
            return [
              {
                id: Date.now(),
                message: `Multiple people detected (${finalPersonCount})`,
                timestamp
              },
              ...prev
            ];
          });
        }
        
        // Generate warning for phones
        if (finalPhoneCount > 0) {
          const now = new Date();
          const timestamp = now.toLocaleTimeString();
          setWarnings(prev => {
            // Check if we already warned about phones recently
            const lastWarning = prev[0];
            if (lastWarning && 
                lastWarning.message.includes("Smartphone") && 
                (Date.now() - lastWarning.id) < 5000) {
              return prev; // Skip to avoid duplicates
            }
            
            return [
              {
                id: Date.now(),
                message: "Smartphone detected in frame",
                timestamp
              },
              ...prev
            ];
          });
        }
        
      } catch (error) {
        console.error("Detection error:", error);
      }
    };
    
    // Run detection every 2 seconds
    const detectionInterval = setInterval(runDetection, 2000);
    
    // Run once immediately
    runDetection();
    
    return () => {
      clearInterval(detectionInterval);
    };
  }, [model, stream]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative rounded-lg overflow-hidden shadow-lg border border-zinc-800">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="w-full h-auto min-h-[380px] bg-black rounded-lg"
        />
        {isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading YOLOv8 model...
            </div>
          </div>
        )}
        {debugInfo && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            <div>Status: {isModelLoading ? "Loading model..." : "Model ready"}</div>
            <div>Detected: {debugInfo.peopleCount} people, {debugInfo.phonesCount} phones</div>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/70 text-emerald-500 px-3 py-1 rounded-full text-sm border border-zinc-700 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Live
          </div>
        </div>
      </div>
      
      {/* Proctoring Warnings */}
      <div className="mt-4 bg-zinc-900 rounded-lg shadow-md p-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-zinc-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            Proctoring Warnings
          </h3>
          {warnings.length > 0 && (
            <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded-full border border-red-800/50">
              {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}
            </span>
          )}
        </div>
        
        {warnings.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-zinc-500 text-sm bg-zinc-800 rounded-lg border border-zinc-700">
            No warnings detected
          </div>
        ) : (
          <div className="max-h-[150px] overflow-y-auto custom-scrollbar">
            {warnings.map((warning, index) => (
              <div 
                key={warning.id} 
                className={`bg-red-900/20 border-l-4 border-red-500 p-3 rounded-r-lg ${
                  index === 0 
                    ? 'mb-2 border-red-500' 
                    : 'mb-2 border-red-500/70'
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className={`${index === 0 ? 'text-red-400 font-medium' : 'text-red-400/90'}`}>
                    {warning.message}
                    {index === 0 && <span className="ml-2 text-xs bg-red-500/20 px-2 py-0.5 rounded-full">Latest</span>}
                  </p>
                  <span className="text-zinc-400 text-xs">{warning.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
