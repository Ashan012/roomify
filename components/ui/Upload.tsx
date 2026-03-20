import { CheckCircle, ImageIcon, UploadIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  PROGRESS_STEP,
  PROGRESS_INTERVAL_MS,
  REDIRECT_DELAY_MS,
} from "../../lib/constants";

interface UploadProps {
  onComplete?: (base64: string) => void;
}

function Upload({ onComplete }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;

    setFile(selectedFile);
    setProgress(0);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      let currentProgress = 0;

      const intervalId = setInterval(() => {
        currentProgress += PROGRESS_STEP;

        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          clearInterval(intervalId);

          setTimeout(() => {
            if (onComplete) {
              onComplete(base64String);
            }
          }, REDIRECT_DELAY_MS);
        } else {
          setProgress(currentProgress);
        }
      }, PROGRESS_INTERVAL_MS);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isSignedIn) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSignedIn) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSignedIn) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSignedIn) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  return (
    <div>
      <div className="upload">
        {!file ? (
          <div
            className={`dropzone ${isDragging ? `is-dragging` : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="drop-input"
              accept=".jpg, .jpeg ,.png"
              disabled={!isSignedIn}
              onChange={handleChange}
            />

            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={20} />
              </div>

              <p>
                {isSignedIn
                  ? "Click to upload or just drag and drop"
                  : "Sign in or sign up with puter to upload"}
              </p>
              <p className="help">Maximum file size 50 MB</p>
            </div>
          </div>
        ) : (
          <div className="upload-status">
            <div className="status-content">
              <div className="status-icon">
                {progress == 100 ? (
                  <CheckCircle className="check" />
                ) : (
                  <ImageIcon className="image" />
                )}
              </div>

              <h3>{file.name}</h3>

              <div className="progress">
                <div className="bar" style={{ width: `${progress}%` }} />

                <p className="status-text">
                  {progress < 100
                    ? "Analayzing Floor Plan..."
                    : "Redirecting..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
