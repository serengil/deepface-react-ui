import React, { useRef, useEffect, useState } from 'react';

function App() {
  const facialRecognitionModel = process.env.REACT_APP_FACE_RECOGNITION_MODEL || "Facenet";
  const faceDetector = process.env.REACT_APP_DETECTOR_BACKEND || "opencv";
  const distanceMetric = process.env.REACT_APP_DISTANCE_METRIC || "cosine";

  const serviceEndpoint = process.env.REACT_APP_SERVICE_ENDPOINT;
  const antiSpoofing = process.env.REACT_APP_ANTI_SPOOFING === "1"

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [base64Image, setBase64Image] = useState('');
  const [isVerified, setIsVerified] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [facialDb, setFacialDb] = useState({});

  useEffect(() => {
    const loadFacialDb = async () => {
      const envVarsWithPrefix = {};
      for (const key in process.env) {
        if (key.startsWith("REACT_APP_USER_")) {
          envVarsWithPrefix[key.replace("REACT_APP_USER_", "")] = process.env[key];
        }
      }
      return envVarsWithPrefix;
    };
  
    const fetchFacialDb = async () => {
      try {
        const loadedFacialDb = await loadFacialDb();
        setFacialDb(loadedFacialDb);
      } catch (error) {
        console.error('Error loading facial database:', error);
      }
    };
  
    fetchFacialDb();

  }, [facialDb]);

  useEffect(() => {
    let video = videoRef.current;
    if (video) {
      const getVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          await video.play();
        } catch (err) {
          console.error("Error accessing webcam: ", err);
        }
      };
      getVideo();
    }
  }, []);

  const captureImage = () => {
    // flush variable states when you click verify
    setIsVerified(null);
    setIdentity(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Img = canvas.toDataURL('image/png');
    setBase64Image(base64Img);

    verify(base64Image)

    console.log(`verification result is ${isVerified} - ${identity}`)

  };

  const verify = async (base64Image) => {
    try {
      for (const key in facialDb) {
        const targetEmbedding = facialDb[key];

        const requestBody = JSON.stringify(
          {
            model_name: facialRecognitionModel,
            detector_backend: faceDetector,
            distance_metric: distanceMetric,
            align: true,
            img1_path: base64Image,
            img2_path: targetEmbedding,
            enforce_detection: false,
            anti_spoofing: antiSpoofing,
          }
        );

        console.log(`calling service endpoint ${serviceEndpoint}/verify`)
  
        const response = await fetch(`${serviceEndpoint}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        if (response.status !== 200) {
          const responseMsg = await response.json();
          console.log(responseMsg.error);
          setIsVerified(false);
        }
  
        const data = await response.json();

        if (data.verified === true) {
          setIsVerified(true);
          setIdentity(key);
          break;
        }

      }

      // if isVerified key is not true after for loop, then it is false
      if (isVerified === null) {
        setIsVerified(false);
      }
      
    }
    catch (error) {
      console.error('Error uploading image:', error);
    }

  };

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: '#282c34',
        color: 'white'
      }}
    >
      <header className="App-header">
        <h1>DeepFace React App</h1>
        {/* Conditional rendering based on verification status */}
        {isVerified === true && <p style={{ color: 'green' }}>Verified. Welcome {identity}</p>}
        {isVerified === false && <p style={{ color: 'red' }}>Not Verified</p>}
        <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }} />
        <br></br>
        <button onClick={captureImage}>Verify</button>
        <br></br>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {/*base64Image && <img src={base64Image} alt="Captured frame" />*/}
      </header>
    </div>
  );
}

export default App;
