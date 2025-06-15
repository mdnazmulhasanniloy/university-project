import { ConfigProvider, Upload } from "antd";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

const FileUpload = ({
  setSelectedFile,
  disabled,
  listType = "picture-card",
  imageUrl,
  theme,
}) => {
  const customRequest = ({ file }) => {
    setSelectedFile(file);
  };
  const props = {
    name: "file",
    disabled: disabled,
    listType: listType,
    imageUrl: imageUrl,
    multiple: false,
    showUploadList: false,
    customRequest: customRequest,
  };
  const handleButton = (e) => {
    e.preventDefault();
  };
  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      onClick={(e) => handleButton(e)}
    >
      <CloudUpload className="text-primary" />
      <div style={{ marginTop: 8 }} className="text-primary">
        Upload
      </div>
    </button>
  );

  return (
    <Controller>
      <Upload {...props}>
        {imageUrl ? (
          <div className="border] group relative overflow-hidden">
            <Image
              height={1200}
              width={1200}
              className="rounded-md"
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                // objectFit: "cover",
                border: "none",
                display: "block",
              }}
            />
            <div
              className="absolute bottom-0 right-0 flex h-0 w-0 items-center justify-center rounded-tl-full bg-[#000] text-white transition-all duration-500 ease-in-out group-hover:h-10 group-hover:w-10"
              style={{ borderRadius: "50px 0 8px 0" }}
            >
              <CloudUpload className="mt-2 text-white" size={18} />
            </div>
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
    </Controller>
  );
};

export default FileUpload;
