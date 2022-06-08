import Header from "./components/header";
import { Section } from "./components/section";
import './App.scss'


import { Canvas, useFrame } from "react-three-fiber";

import { Html, useGLTF} from '@react-three/drei'
import React, { Suspense, useEffect, useRef } from "react";

//PAGE STATES
import state from "./components/state";

//intersections
import {useInView} from 'react-intersection-observer'

//untuk import gambar
const Model = ({ modelPath }) => {
  const gltf = useGLTF(modelPath, true);
  return <primitive object={gltf.scene} dispose={null} />;
}

//Untuk design warna gambar
const Lights = () => {
  return (
    <>
        <ambientLight intensity={0.3}/>
        <directionalLight position={[10,10,4]} intensity={1}/>
        <spotLight position={[1000,0,0]}/>
    </>
    
  );
};


const HTMLContent = ({bgColor, domContent ,children, modelPath, positionY}) => {

//Untuk memutar gambar 
const useref = useRef()
// useFrame(() => (useref.current.rotation.y += 0.10))
useFrame(() => (useref.current.rotation.y += 0.04))

//Change color
const {refItem, inView} = useInView({
  threshold: 0
})

useEffect(() => {
  inView && (document.body.style.background = bgColor)
}, [inView])

//END 

  return(
    <Section factor={1.5} offset={0.8}>
      <group position={[0, positionY ,-5]}>
          <mesh ref={useref} position={[0,-24,0]}>
            <Model modelPath={modelPath}/>
          </mesh>
          <Html portal={domContent} fullscreen>
              <div className="container" ref={refItem}>
                  {children}
              </div>
          </Html>
      </group>
    </Section>
  );
};


export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({target:scrollArea.current}), [])
  return (
    <>
      <Header/>
      {/* UNTUK MENGATUR TATALETAK CAMERA DIVIEW PAGE */}
        <Canvas
          colorManagement
          camera={{position:[30,20,120,], fav:70}}
        >
          <Lights/>
          <Suspense fallback={null}>
            {/* Parsing data */}

             <HTMLContent 
                domContent={domContent}
                modelPath="/images/armchairYellow.gltf" 
                positionY={220}
                bgColor={'#f15946'}
              >
                  <h1 className="title">Yellow</h1>
              </HTMLContent>

            {/* Parsing data */}

          </Suspense>
         
          


          {/* <RoundedBox 
            args={[1, 1, 1]} 
            radius={0.05} 
            smoothness={4} 
            // {...meshProps}
            >
            <meshPhongMaterial color="#f3f3f3" />
          </RoundedBox> */}

        </Canvas>

        <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
          <div style={{position:"sticky", top:0}} ref={domContent}></div>
          <div style={{height: `${state.sections * 50}vh`}}></div>
        </div>
    
    </>
  );
}
