import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Check, X } from "lucide-react";

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid CORS issues
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, "image/webp", 0.9);
  });
}

type ImageCropperProps = {
  imageUrl: string;
  onComplete: (blob: Blob | null) => void;
  onCancel: () => void;
};

export default function ImageCropper({ imageUrl, onComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const onCropComplete = useCallback((_croppedArea: { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
        onComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
      onComplete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col">
      <div className="p-4 flex items-center justify-between bg-black shrink-0 border-b border-white/10">
         <h3 className="text-white font-outfit uppercase tracking-widest pl-4">Crop Image</h3>
         <button onClick={onCancel} className="p-2 bg-white/10 text-white rounded-full">
            <X className="w-5 h-5" />
         </button>
      </div>

      <div className="flex-1 relative w-full h-full">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="p-6 bg-black shrink-0 border-t border-white/10 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
         <div className="flex items-center space-x-3 text-white w-full max-w-sm">
            <span className="text-sm font-semibold uppercase tracking-wider text-white/50">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
         </div>

         <div className="flex space-x-4">
           <button onClick={onCancel} className="px-6 py-2 border border-white/20 text-white/80 rounded tracking-widest uppercase font-semibold hover:bg-white/10">
             Cancel
           </button>
           <button onClick={handleSave} className="flex items-center px-6 py-2 bg-[var(--primary)] text-white rounded tracking-widest uppercase font-semibold hover:bg-[var(--primary)]/90 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]">
             <Check className="w-4 h-4 mr-2" />
             Apply Crop
           </button>
         </div>
      </div>
    </div>
  );
}
