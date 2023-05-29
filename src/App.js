
import { useEffect, useRef } from "react";
import './App.css';
import * as faceapi from "face-api.js";
import img1 from './assets/Rach-monica.jpg' 


function App() {
  const imgRef = useRef()
  const canvasRef = useRef()

  const handleImage = async()=> {
    const detect = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks()
    .withFaceExpressions();

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width:"940",
      height:"500",
    })

    const resized = faceapi.resizeResults(detect,{
      width:"940",
      height:"500",
    })
    faceapi.draw.drawDetections(canvasRef.current,resized);
    faceapi.draw.drawFaceExpressions(canvasRef.current,resized);
    faceapi.draw.drawFaceLandmarks(canvasRef.current,resized);
    // faceapi.draw.drawFaceRecognition(canvasRef.current,resized);
    console.log(detect);
  }  
  useEffect (()=>{
    const loadModels = () => {
      const MODEL_URL =  '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])
      .then(handleImage)
      .catch((e) => console.log(e));
    }
    imgRef && loadModels();
  },[]
    )
  return (
    <div className="App">
      <img 
       ref={imgRef}
       src = {img1} 
       alt="hello"
       width="940"
       height="500"
      />
      {/* canvas to draw shape in our container
      our container will have images */}
      <canvas ref={ canvasRef } width="940" height="500"/>
    </div>
  );
}

export default App;
