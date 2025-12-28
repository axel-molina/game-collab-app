import { useState } from "react";

interface ProjectImagesProps {
  images: Array<{ id: string; image_url: string }>;
  projectName: string;
}

export function ProjectImages({ images, projectName }: ProjectImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
        <img
          src={images[selectedImage]?.image_url}
          alt={projectName}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
