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
  const uploadFile = async (event:any) => {
    const files = event.target.files;
    if (files.length === 0) return;
//@ts-ignore
    setFiles((prevState) => [
      ...prevState,
      ...Array.from(files).map((file) => ({
        name:
        //@ts-ignore
          file.name.length > 12
//@ts-ignore
          ? `${file.name.substring(0, 13)}... .${file.name.split('.')[1]}`
          //@ts-ignore  
          : file.name,
        loading: 0,
      })),
    ]);
    setShowProgress(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      //@ts-ignore
      formData.append('file', file);

      return axios.post('http://localhost:5000/', formData, {
        onUploadProgress: ({ loaded, total }) => {
          setFiles((prevState) => {
            const newFiles = [...prevState];
            //@ts-ignore
            const index = newFiles.findIndex((f) => f.name === file.name);
            if (index !== -1) {
              //@ts-ignore
              newFiles[index].loading = Math.floor((loaded / total) * 100);
            }
            return newFiles;
          });
        },
      });
    });

    try {
      await Promise.all(uploadPromises);

      const uploadedFilesData = Array.from(files).map((file) => ({
        //@ts-ignore
        name: file.name,
        //@ts-ignore
        size: file.size < 1024 ? `${file.size} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
//@ts-ignore
      setUploadedFiles([...uploadedFiles, ...uploadedFilesData]);
      setFiles([]);
      setShowProgress(false);
    } catch (error) {
      console.error('Upload error:', error);
      setShowProgress(false);
    }
  };
  return (
      <div className="upload-box">
        <p>Upload your file</p>
       <form>
        <input className='file-input' type="file" name='file' hidden ref={fileInputRef} multiple onChange={uploadFile}/>
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
