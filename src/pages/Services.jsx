import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useFBX, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import Spline from "@splinetool/react-spline";
import "./Services.css";

// -------------------- VIDEO BACKGROUND --------------------
function VideoBackground({ videoSrc, loopDuration = 2.8 }) {
  const meshRef = useRef();
  const videoRef = useRef(document.createElement("video"));
  const videoTextureRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("preload", "auto");

    const loopHandler = () => {
      if (video.currentTime >= loopDuration) {
        video.currentTime = 0;
        video.play();
      }
    };
    video.addEventListener("timeupdate", loopHandler);
    video.play().catch((err) => console.warn("Autoplay failed:", err));

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.encoding = THREE.sRGBEncoding;
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTextureRef.current = videoTexture;

    if (meshRef.current) {
      meshRef.current.material.map = videoTexture;
      meshRef.current.material.needsUpdate = true;
    }

    return () => {
      video.pause();
      video.removeEventListener("timeupdate", loopHandler);
      video.src = "";
    };
  }, [videoSrc, loopDuration]);

  useFrame(() => {
    if (videoTextureRef.current) videoTextureRef.current.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[5, 8.5, -30]}>
      <planeGeometry args={[320, 110]} />
      <meshBasicMaterial map={videoTextureRef.current} toneMapped={false} />
    </mesh>
  );
}

// -------------------- MODEL INSTANCE --------------------
function ModelInstance({ fbxPath, texturePaths, position, rotationY = 0 }) {
  const fbx = useFBX(fbxPath);
  const textures = useTexture(texturePaths);
  const ref = useRef();
  const mixer = useRef();

  useEffect(() => {
    if (!fbx) return;

    const defaultTexture =
      textures && textures.length
        ? textures[0]
        : new THREE.TextureLoader().load("/mymodel/Textures/default.png");
    defaultTexture.flipY = false;
    defaultTexture.encoding = THREE.sRGBEncoding;

    let textureIndex = 0;

    fbx.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();

        let textureToUse;
        if (
          fbxPath.includes("newold6.fbx") ||
          fbxPath.includes("newold9.fbx") ||
          fbxPath.includes("newold10.fbx")
        ) {
          textureToUse = defaultTexture;
        } else {
          textureToUse =
            textures && textures.length > 0
              ? textures[textureIndex % textures.length]
              : defaultTexture;
          textureIndex++;
        }

        if (textureToUse) {
          textureToUse.flipY = false;
          textureToUse.encoding = THREE.sRGBEncoding;
        }

        child.material = new THREE.MeshStandardMaterial({
          map: textureToUse,
          color: new THREE.Color(0xffffff),
          side: THREE.DoubleSide,
          metalness: 0,
          roughness: 1,
          skinning: !!child.skeleton,
        });

        child.material.vertexColors = false;
        child.material.needsUpdate = true;
      }
    });

    if (fbx.animations && fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx);
      const action = mixer.current.clipAction(fbx.animations[0]);
      action.play();
    }
  }, [fbx, textures, fbxPath]);

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  if (!fbx) return null;

  fbx.position.set(...position);
  fbx.scale.set(0.3, 0.3, 0.3);
  fbx.rotation.set(0, rotationY, 0);

  return <primitive ref={ref} object={fbx} />;
}

// -------------------- SCENE --------------------
function Scene({ models, videoPath }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 60);
    camera.lookAt(0, 1.6, 0);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.6, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  return (
    <>
      <VideoBackground videoSrc={videoPath} loopDuration={3} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[12, 12, 12]} intensity={1.5} />
      <pointLight position={[-10, 5, -10]} intensity={1} />
      <Environment preset="city" />

      {models.map((props, idx) => (
        <ModelInstance key={idx} {...props} />
      ))}

      <OrbitControls
        ref={controlsRef}
        target={[0, 1.6, 0]}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
    </>
  );
}

// -------------------- MAIN UI --------------------
export default function KavishanUI() {
  const gap = 26;
  const depthGap = -10;

  const models = [
    { fbxPath: "/mymodel/newold.fbx", texturePaths: ["/mymodel/Textures/people_pal_s22.png"], position: [0, -31, 0], rotationY: 0 },
    { fbxPath: "/mymodel/newold10.fbx", texturePaths: ["/mymodel/Textures/people_pal_s22.png","/mymodel/Textures/const_tools.png"], position: [-gap, -32, depthGap], rotationY: (10*Math.PI)/180 },
    { fbxPath: "/mymodel/model1.fbx", texturePaths: ["/mymodel/Textures/people_pal_s22.png"], position: [-gap*2, -31, depthGap*2], rotationY: (15*Math.PI)/180 },
    { fbxPath: "/mymodel/newold6.fbx", texturePaths: ["/mymodel/Textures/people_pal_s22.png","/mymodel/Textures/people_pal_s1.png"], position: [gap, -32, depthGap], rotationY: (-10*Math.PI)/180 },
    { fbxPath: "/mymodel/newold3.fbx", texturePaths: ["/mymodel/Textures/people_pal_s22.png"], position: [gap*2, -31, depthGap*2], rotationY: (-15*Math.PI)/180 },
  ];

  const handleMouseEnter = (e) => {
    const video = e.currentTarget.querySelector("video");
    if (video) video.play();
  };

  const handleMouseLeave = (e) => {
    const video = e.currentTarget.querySelector("video");
    if (video) video.pause();
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <h1>FIXORA</h1>
        <div>
          <button>Home</button>
          <button>Services</button>
          <button>Contact</button>
        </div>
      </nav>

      <div className="background-3d" style={{ height: "550px" }}>
        <Canvas camera={{ fov: 50 }} dpr={window.devicePixelRatio} gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}>
          <Scene models={models} videoPath={"/videos/Futuristic_Booking_System_Animation-vmake.mp4"} />
        </Canvas>
      </div>

      <section className="wow-section">
        <div className="wow-left">
          <h2>Hire Trusted Workers, Anytime, Anywhere</h2>
          <p>Need a trusted worker for your home or office? Our app connects you with skilled professionals for plumbing, cleaning, gardening, electrical work, and more. All our workers are verified, reliable, and ready to help. Hire instantly and enjoy fast, affordable, and hassle-free service anytime!</p>
        </div>
        <div className="wow-right">
          {[
            { img: "/mymodel/Textures/photo-1535090467336-9501f96eef89-820x400.jpg", text: "Gardner" },
            { img: "/mymodel/Textures/professional-repair-engineer-repairing-broken-tv-professional-repair-engineer-repairing-broken-tv-118916498.webp", text: "Tv repair Tech" },
            { img: "/mymodel/Textures/istockphoto-1417833172-612x612.jpg", text: "Home cleaning" },
            { img: "/mymodel/Textures/Plumber-Sink-201709-003.jpg", text: "Plumber" },
            { img: "/mymodel/Textures/How-much-does-Garden-Cleaning-Cost-in-Sydney.png", text: "Gardner" },
            { img: "/mymodel/Textures/asian-young-man-and-woman-cleaning-service-worker-2023-11-27-05-00-57-utc-jpg.webp", text: "Home cleaning" },
          ].map((item, idx) => (
            <div className="wow-box auto-animate" key={idx} style={{ "--i": idx }}>
              <img src={item.img} alt={item.text} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="spline-section">
        <Spline scene="https://prod.spline.design/e6tuMkANJZg2zcHd/scene.splinecode" />
        <div className="spline-heading">
          <h1>CHOOSE YOUR SERVICES</h1>
        </div>

        <div className="corner-services">
          {[
            // Yes, this is correct if your public directory contains a "videos" folder with these files.
            // The video paths are relative to the public directory in Create React App or Vite.
            { title: "PLUMBER", video: "/videos/Plumber_Video_Generation.mp4", desc: "🔧From drips to disasters – we handle it all. Call your trusted plumber today!", pos: "top-left" },
            { title: "GARDNER", video: "/videos/Garden_Video_Generation.mp4", desc: "🌱 From lawns to landscapes – we make your outdoors bloom beautifully.", pos: "top-right" },
            { title: "Home Cleaners", video: "/videos/Video_Generation_of_Cleaning_Activity.mp4", desc: "✨ “From dust to dazzling – professional home cleaning you can trust.", pos: "bottom-left" },
            { title: "Electricians", video: "/videos/WhatsApp Video 2025-09-03 at 1.28.22 PM.mp4", desc: "⚡ “Power up your home – expert electrical service you can trust!”", pos: "bottom-right" },
          ].map((item, idx) => (
            <div className={`service-box ${item.pos}`} key={idx} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <h3>{item.title}</h3>
              <video src={item.video} muted loop playsInline />
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------- NEW SPLINE SECTION -------------------- */}
      <section className="new-spline-section">
        <div className="new-spline-left">
          <h2 className="glow-heading">Your Trust, Our Priority.</h2>
          <p className="glow-paragraph">
           Need skilled workers for plumbing, cleaning, gardening, or electrical work?
We connect you with verified, reliable professionals ready to help anytime.
Fast, affordable, and hassle-free service – right at your fingertips!
          </p>
        </div>
        <div className="new-spline-right">
          <Spline scene="https://prod.spline.design/URLf4x2kJAegPFxP/scene.splinecode" />
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 FIXORA. All rights reserved.</p>
      </footer>
    </div>
  );
}
