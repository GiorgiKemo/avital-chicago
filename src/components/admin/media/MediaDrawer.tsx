import { useState, useRef } from "react";
import { X, Upload, Trash2, Check, Crop } from "lucide-react";
import type { UploadedFile } from "./Types";
import ImageCropper from "./ImageCropper";

type MediaDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  files: UploadedFile[];
  onSelectImage: (bucketPath: string, publicUrl: string) => void;
  bucketName: string;
};

export default function MediaDrawer({
  isOpen,
  onClose,
  files,
  onSelectImage,
  bucketName,
}: MediaDrawerProps) {
  const [isCropping, setIsCropping] = useState(false);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setSelectedFileObj(file);
        setSelectedFileUrl(url);
        setIsCropping(true);
      } else {
        alert("Please select an image file.");
      }
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob | null) => {
    setIsCropping(false);
    if (!croppedBlob || !selectedFileObj) return;

    // We have the cropped blob. We upload it to the server!
    const formData = new FormData();
    // Reconstruct a File object for the upload
    const fileToUpload = new File([croppedBlob], selectedFileObj.name, { type: 'image/webp' });
    formData.append("file", fileToUpload);
    formData.append("name", selectedFileObj.name.replace(/\.[^/.]+$/, "") + "_cropped.webp");
    // Since we don't have a specific return target that we want to instantly redirect to,
    // we use fetch to upload the file to our API and then reload the drawer files.
    // Wait, the API defaults to a redirect 303. That's tricky with fetch.
    // Let's just submit the form as a normal POST to the endpoint!
    
    // Oh wait, if we submit an invisible form with the File, we would redirect the whole page.
    // Let's create an invisible form and submit it.
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/admin/media/upload';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'file';
    // Use DataTransfer to append the file to a detached input
    const dt = new DataTransfer();
    dt.items.add(fileToUpload);
    fileInput.files = dt.files;
    
    const nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = 'name';
    nameInput.value = selectedFileObj.name.replace(/\.[^/.]+$/, "") + "_cropped.webp";
    
    form.appendChild(fileInput);
    form.appendChild(nameInput);
    document.body.appendChild(form);
    form.submit();
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${fileName}"? This might break pages if it's in use.`)) {
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/admin/media/delete';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'path';
    input.value = fileName;
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed right-0 top-0 h-full w-[450px] max-w-full bg-[#0a0a0a] border-l border-[#ffffff10] shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#ffffff10] flex justify-between items-center bg-[#111111] shrink-0">
          <div>
            <h2 className="text-xl font-outfit text-white tracking-widest font-light">
              Media Library
            </h2>
            <p className="text-xs text-white/50 mt-1 font-inter">
              Select or upload new assets
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#ffffff10] shrink-0 bg-[#0d0d0d]">
           <input
             type="file"
             accept="image/*"
             className="hidden"
             ref={fileInputRef}
             onChange={handleFileChange}
           />
           <button
             onClick={() => fileInputRef.current?.click()}
             className="w-full py-4 border-2 border-dashed border-white/20 hover:border-white/50 hover:bg-white/5 rounded-xl text-white/70 flex flex-col items-center justify-center transition-all group"
           >
             <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
             <span className="text-sm font-medium tracking-widest uppercase">Upload & Crop</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="group relative aspect-square bg-[#111111] border border-[#ffffff10] rounded-xl overflow-hidden hover:border-[#ffffff30] transition-colors"
              >
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  className="w-full h-full object-contain p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                  <span className="text-[10px] text-white/60 text-center truncate w-full mb-3 px-2">
                    {file.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectImage(file.name, file.publicUrl)}
                      className="p-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-colors scale-90 hover:scale-100"
                      title="Select Image"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-full transition-colors scale-90 hover:scale-100"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {files.length === 0 && (
               <div className="col-span-2 py-10 text-center text-white/40 text-sm italic font-light">
                 Library is empty.
               </div>
            )}
          </div>
        </div>
      </div>

      {isCropping && selectedFileUrl && (
        <ImageCropper
          imageUrl={selectedFileUrl}
          onComplete={handleCropComplete}
          onCancel={() => {
            setIsCropping(false);
            setSelectedFileUrl(null);
            setSelectedFileObj(null);
          }}
        />
      )}
    </>
  );
}
