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

  const [isAnalyzed, setIsAnalyzed] = useState(null);
  const [analysis, setAnalysis] = useState([]);

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

  const captureImage = (task) => {
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

    // first click causes blank string
    if (base64Image === null || base64Image === "") {
      return
    }

    if (task === "verify") {
      verify(base64Image)
      console.log(`verification result is ${isVerified} - ${identity}`)
    }
    else if (task === "analyze") {
      analyze(base64Image)
    }
    
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

        const data = await response.json();

        if (response.status !== 200) {
          console.log(data.error);
          setIsVerified(false);
          return
        }
  
        if (data.verified === true) {
          setIsVerified(true);
          setIsAnalyzed(false);
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
      console.error('Exception while verifying image:', error);
    }

  };

  const analyze = async (base64Image) => {
    const result = []
    setIsAnalyzed(false)
    try {  
      const requestBody = JSON.stringify(
        {
          detector_backend: faceDetector,
          align: true,
          img_path: base64Image,
          enforce_detection: false,
          anti_spoofing: antiSpoofing,
        }
      );

      const response = await fetch(`${serviceEndpoint}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      const data = await response.json();

      if (response.status !== 200) {
        console.log(data.error);
        return
      }

      for (const instance of data.results){
        const summary = `${instance.age} years old ${instance.dominant_race} ${instance.dominant_gender} with ${instance.dominant_emotion} mood.`
        console.log(summary)
        result.push(summary)
      }

      if (result.length > 0) {
        setIsAnalyzed(true);
        setIsVerified(null);
        setAnalysis(result);
      }
      
    }
    catch (error) {
      console.error('Exception while analyzing image:', error);
    }
    return result

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
        {isAnalyzed === true && <p style={{ color: 'green' }}>{analysis.join()}</p>}
        <video ref={videoRef} style={{ width: '100%', maxWidth: '500px' }} />
        <br></br><br></br>
        <button onClick={() => captureImage('verify')}>Verify</button>
        <button onClick={() => captureImage('analyze')}>Analyze</button>
        <br></br><br></br>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {/*base64Image && <img src={base64Image} alt="Captured frame" />*/}
      </header>
    </div>
  );
}

export default App;
