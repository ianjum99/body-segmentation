import React, {useRef} from "react";
//import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import './App.css';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodysegment = async () =>{
    const net = await bodyPix.load();
    console.log("Bodypix model loaded")
    setInterval(() => {
      detect(net)
    }, 100);
  };
  
  const detect = async (net) =>{
    //check data is available
    if(typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //get video properties
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;

      //set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.header = videoHeight;

      //make detections
      const person = await net.segmentPersonParts(video);
      console.log(person);

      //draw detections
      const coloredPartImage = bodyPix.toColoredPartMask(person);

      bodyPix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      );
}

};

  runBodysegment();


  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        style = {{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }} />
        <canvas ref={canvasRef}
        style = {{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }} />
      </header>
    </div>
  );
}

export default App;
