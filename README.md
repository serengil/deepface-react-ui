# DeepFace React UI

<div align="center">

[![Stars](https://img.shields.io/github/stars/serengil/deepface-react-ui?color=yellow&style=flat&label=%E2%AD%90%20stars)](https://github.com/serengil/deepface-react-ui/stargazers)
[![License](http://img.shields.io/:license-MIT-green.svg?style=flat)](https://github.com/serengil/deepface-react-ui/blob/main/LICENSE)

[![Blog](https://img.shields.io/:blog-sefiks.com-blue.svg?style=flat&logo=wordpress)](https://sefiks.com)
[![YouTube](https://img.shields.io/:youtube-@sefiks-red.svg?style=flat&logo=youtube)](https://www.youtube.com/@sefiks?sub_confirmation=1)
[![Twitter](https://img.shields.io/:follow-@serengil-blue.svg?style=flat&logo=x)](https://twitter.com/intent/user?screen_name=serengil)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dserengil%26type%3Dpatrons&style=flat)](https://www.patreon.com/serengil?repo=deepface)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/serengil?logo=GitHub&color=lightgray)](https://github.com/sponsors/serengil)
[![Buy Me a Coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://buymeacoffee.com/serengil)

[![DOI](http://img.shields.io/:DOI-10.17671/gazibtd.1399077-blue.svg?style=flat)](https://doi.org/10.17671/gazibtd.1399077)

</div>

deepface-react-ui is a comprehensive user interface for facial recognition built with ReactJS, designed specifically for streamlined face verification tasks using the [DeepFace](https://github.com/serengil/deepface) library. This UI not only simplifies the implementation of facial recognition features but also enhances security with built-in [anti-spoofing](https://youtu.be/UiK1aIjOBlQ) capabilities. Whether you're working on identity verification systems, security applications, or simply exploring facial recognition technology, this UI provides an intuitive platform to harness the power of DeepFace within your web applications.

Facial recognition technology plays a pivotal role in modern applications, from enhancing security measures to enabling personalized user experiences. The deepface-react-ui empowers developers and researchers to harness these capabilities effortlessly within their web applications.

<p align="center"><img src="https://raw.githubusercontent.com/serengil/deepface-react-ui/main/resources/tp.jpg" width="50%"></p>

## Configuration

There is `.env.example` file in the root of the project. You should copy this as `.env`. Required modifications are mentioned as comments. You basically need to add your facial database items into this file, prefixing each with `REACT_APP_USER_`, where the identity name with that prefix serves as the key and the base64-encoded string of their images serves as the value.

```yaml
# define your facial database
REACT_APP_USER_ALICE=data:image/png;base64,...
REACT_APP_USER_BOB=data:image/png;base64,...
REACT_APP_USER_CAROL=data:image/png;base64,...
```

DeepFace wraps many state-of-the-art facial recognition models: [`VGG-Face`](https://sefiks.com/2018/08/06/deep-face-recognition-with-keras/), [`FaceNet`](https://sefiks.com/2018/09/03/face-recognition-with-facenet-in-keras/), [`OpenFace`](https://sefiks.com/2019/07/21/face-recognition-with-openface-in-keras/), [`DeepFace`](https://sefiks.com/2020/02/17/face-recognition-with-facebook-deepface-in-keras/), [`DeepID`](https://sefiks.com/2020/06/16/face-recognition-with-deepid-in-keras/), [`ArcFace`](https://sefiks.com/2020/12/14/deep-face-recognition-with-arcface-in-keras-and-python/), [`Dlib`](https://sefiks.com/2020/07/11/face-recognition-with-dlib-in-python/), `SFace` and `GhostFaceNet`. According to [`experiments`],(https://github.com/serengil/deepface/tree/master/benchmarks), those models reached or passed human-level accuracy.

Similarly, it wraps many cutting-edge face detectors:  [`OpenCV`](https://sefiks.com/2020/02/23/face-alignment-for-face-recognition-in-python-within-opencv/), [`Ssd`](https://sefiks.com/2020/08/25/deep-face-detection-with-opencv-in-python/), [`Dlib`](https://sefiks.com/2020/07/11/face-recognition-with-dlib-in-python/),  [`MtCnn`](https://sefiks.com/2020/09/09/deep-face-detection-with-mtcnn-in-python/), `Faster MtCnn`, [`RetinaFace`](https://sefiks.com/2021/04/27/deep-face-detection-with-retinaface-in-python/), [`MediaPipe`](https://sefiks.com/2022/01/14/deep-face-detection-with-mediapipe/), `Yolo`, `YuNet` and `CenterFace`.

Both facial recognition models and face detectors can be set in the `.env` file.

## Running Service

Firstly, you have to run the deepface service.

```shell
# clone deepface repo
git clone git clone https://github.com/serengil/deepface.git

# go to project's directory
cd deepface/scripts

# run the dockerized service
./dockerize.sh

# or instead of running dockerized service, run it directly if you installed requirements.txt
# ./service.sh
```

In seperate terminal, you should run deepface react ui

```shell
# clone deepface react ui repo
git clone https://github.com/serengil/deepface-react-ui.git

# go to project's directory
cd deepface-react-ui/scripts

# run the dockerized service
./dockerize.sh

# or instead of running dockerized service, run it directly
# ./service.sh
```

## Running via Docker Compose

Instead of running deepface and deepface react ui seperately in different terminals, you can run the standalone docker compose.

```shell
# clone source code
git clone https://github.com/serengil/deepface-react-ui.git \
    && git clone https://github.com/serengil/deepface.git

# go to project's directory
cd deepface-react-ui/scripts

# run services
./compose.sh
```

# Using The App

Once you start the service, the DeepFace service will be accessible at `http://localhost:5005/`, and the DeepFace React UI will be available at `http://localhost:3000/`.

To use the DeepFace React UI, open `http://localhost:3000/` in your browser. The UI will prompt access to your webcam and search for identities within the current frame using the facial database specified in the `.env` file when you click on the "Verify" button.

## Support

There are many ways to support a project - starring⭐️ the GitHub repo is just one 🙏

If you do like this work, then you can support it on [Patreon](https://www.patreon.com/serengil?repo=deepface), [GitHub Sponsors](https://github.com/sponsors/serengil) or [Buy Me a Coffee](https://buymeacoffee.com/serengil).

<a href="https://www.patreon.com/serengil?repo=deepface">
<img src="https://raw.githubusercontent.com/serengil/deepface/master/icon/patreon.png" width="30%" height="30%">
</a>

<a href="https://buymeacoffee.com/serengil">
<img src="https://raw.githubusercontent.com/serengil/deepface/master/icon/bmc-button.png" width="25%" height="25%">
</a>

# Citation

Please cite deepface-react-ui in your publications if it helps your research. Here is its BibTex entry:

```BibTeX
@article{serengil2024lightface,
  title     = {A Benchmark of Facial Recognition Pipelines and Co-Usability Performances of Modules},
  author    = {Serengil, Sefik and Ozpinar, Alper},
  journal   = {Bilisim Teknolojileri Dergisi},
  volume    = {17},
  number    = {2},
  pages     = {95-107},
  year      = {2024},
  doi       = {10.17671/gazibtd.1399077},
  url       = {https://dergipark.org.tr/en/pub/gazibtd/issue/84331/1399077},
  publisher = {Gazi University}
}
```

## Licence

DeepFace React UI is licensed under the MIT License - see [`LICENSE`](https://github.com/serengil/deepface-react-ui/blob/main/LICENSE) for more details.
