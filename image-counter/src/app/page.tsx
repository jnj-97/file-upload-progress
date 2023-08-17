'use client'
import { useRef,useState } from "react"
import axios from 'axios';

export default function Home() {
  const [files,setFiles]=useState([])
  const [uploadedFiles,setUploadedFiles]=useState([])
  const [showProgress,setShowProgress]=useState(false)
  const fileInputRef=useRef(null)
  const fileHandleInputClick=()=>{
    //@ts-ignore
    fileInputRef.current.click()
  }
  const uploadFile=(event:any)=>{
    const file=event.target.files[0]
    if(!file) return;
    const filename=file.name.length>12?`${file.name.substring(0,13)}... .${file.name.split('.')[1]}`:file.name;
    const formdata=new FormData();
    formdata.append('file',file)
    //@ts-ignore
    setFiles(prevState=>[...prevState,{name:filename,loading:0}])
    setShowProgress(true)
    axios.post('http://localhost:5000/',formdata,{
      onUploadProgress:({loaded,total})=>{
        setFiles(prevState=>{
          const newFiles=[...prevState];
          //@ts-ignore
          newFiles[newFiles.length-1].loading=Math.floor((loaded/total)*100)
          return newFiles
        })
        if(loaded==total){
          const filesize=total<1024?`${total} KB`:`${(loaded/(1024*1024)).toFixed(2)} MB`
          //@ts-ignore
          setUploadedFiles([...uploadedFiles,{name:filename,size:filesize}])
          setFiles([])
          setShowProgress(false)

        }
      },
    }).catch(console.error)
  }
  return (
      <div className="upload-box">
        <p>Upload your file</p>
       <form>
        <input className='file-input' type="file" name='file' hidden ref={fileInputRef} onChange={uploadFile}/>
        <div className='icon' onClick={fileHandleInputClick}>
          <img src="uploadfile.svg"/>
          </div>
       </form>
      {showProgress && 
       (<section className='loading-area'>
        {files.map((file,index)=>(
          <li className='row' key={index}> 
         <i className='fas fa-file-alt'></i>
         <div className='content'>
           <div className='details'>
             <div className='name'>
               {/* @ts-ignore */}
               {`${file.name} - uploading`}
             </div>
             <div className="percent">
               {/* @ts-ignore */}
               {`${file.loading}%`}
             </div>
             <div className='loading-bar'>
              {/* @ts-ignore */}
               <div className='loading' style={{width:`${file.loading}%`}}></div>
             </div>
           </div>
         </div>
       </li>
        ))}
       
      </section>)}
       <section className='uploaded-area'>
        {uploadedFiles.map((file,index)=>( 
          <li className='row'>
          <div className='content upload'>
            <i className='fas fa-file-alt'></i>
            <div className='details'>
              {/*@ts-ignore*/}
              <span className='name'>{file.name}</span>
              {/*@ts-ignore*/}
              <span className='size'>{file.size}</span>
            </div>
          </div>
          <i className='fas fa-check'></i>
        </li>
        ))}
        
       </section>
      </div>
  )
}
