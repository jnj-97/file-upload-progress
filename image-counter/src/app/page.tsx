'use client'
import { useState } from "react";
import axios from 'axios';

export default function Home() {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  
  const handleFileUpload = async (event:any) => {
    const files = Array.from(event.target.files);
    
    const newUploads = files.map((file) => ({
     //@ts-ignore
      name: file.name,
      loading: 0,
    }));
    //@ts-ignore
    setUploadQueue((prevQueue) => [...prevQueue, ...newUploads]);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        //@ts-ignore
        formData.append('file', file);

        await axios.post('http://localhost:5000/', formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadQueue((prevQueue) => {
              const newQueue = [...prevQueue];
              //@ts-ignore
              const index = newQueue.findIndex((item) => item.name === file.name);
              if (index !== -1) {
                //@ts-ignore
                newQueue[index].loading = Math.floor((loaded / total) * 100);
              }
              return newQueue;
            });
          },
        });

        setUploadedFilesCount((prevCount) => prevCount + 1);
        //@ts-ignore
        setUploadQueue((prevQueue) => prevQueue.filter((item) => item.name !== file.name));
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="upload-box">
      <p>Upload your files</p>
      <input className="file-input" type="file" name="file" multiple onChange={handleFileUpload} />
      <div>
        <p>Uploaded {uploadedFilesCount}/{uploadedFilesCount + uploadQueue.length} files</p>
      </div>
      <section className="loading-area">
        {uploadQueue.map((file, index) => (
          <li className="row" key={index}>
            <i className="fas fa-file-alt"></i>
            <div className="content">
              <div className="details">
                {/* @ts-ignore */}
                <div className="name">{file.name} - uploading</div>
                {/* @ts-ignore */}
                <div className="percent">{file.loading}%</div>
                <div className="loading-bar">
                  {/* @ts-ignore */}
                  <div className="loading" style={{ width: `${file.loading}%` }}></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </section>
    </div>
  );
}
