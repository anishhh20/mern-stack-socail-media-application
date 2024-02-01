import React, { useContext, useEffect } from 'react'


const Loding = (load) => {

  useEffect(() => {
    console.log(load)
  }, [load])
    

  return (
    <>

    {load  ? <div className="loading-bar" style={{
        display: "block",
        position: "absolute",
        top: "0",
        backgroundColor: "red",
        width: "100%",
        height: ".1rem",
        transition: "all 3s ease"
      }}></div> : undefined }
    </>
    
  )
}

export default Loding
