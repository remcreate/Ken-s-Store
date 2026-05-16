"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] =
  useState("physical");

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  const [previewFiles, setPreviewFiles] =
    useState<File[]>([]);

  const [digitalFile, setDigitalFile] =
    useState<File | null>(null);

  const [downloadLimit, setDownloadLimit] =
    useState(1);

  const [
    downloadExpiryHours,
    setDownloadExpiryHours,
  ] = useState(24);
  const [variations, setVariations] = useState([
    { name: "", price: "" },
  ]);

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // store REAL files for Supabase upload
    setFiles((prev) => [...prev, ...selectedFiles]);

    // create preview URLs for UI
    const imageUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...imageUrls]);

    if (!mainImage && imageUrls[0]) {
      setMainImage(imageUrls[0]);
    }
  };

  const handlePreviewUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setPreviewFiles((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    const imageUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages((prev) => [
      ...prev,
      ...imageUrls,
    ]);
  };

  //HANDLE DIGITAL FILE UPLOAD
  const handleDigitalFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    setDigitalFile(e.target.files[0]);
  };
  // -------------------------
  // UPLOAD IMAGES TO SUPABASE
  // -------------------------
  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("products")
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl.publicUrl);
    }

    return uploadedUrls;
  };
  //UPLOAD DIGITAL FILE
  const uploadDigitalFile = async (
    file: File
  ) => {

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("digital-products")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return null;
    }

    return data.path;
  };
  // -------------------------
  // VARIATIONS HANDLING
  // -------------------------
  const addVariationField = () => {
    setVariations([...variations, { name: "", price: "" }]);
  };

  const updateVariation = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...variations];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVariations(updated);
  };

  // -------------------------
  // SUBMIT PRODUCT
  // -------------------------
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Upload images
      const imageUrls =
        files.length > 0
          ? await uploadImages(files)
          : [];

      const previewImageUrls =
        previewFiles.length > 0
          ? await uploadImages(previewFiles)
          : [];

      let digitalFileUrl = null;

      if (
        productType === "digital" &&
        digitalFile
      ) {
        digitalFileUrl =
          await uploadDigitalFile(digitalFile);
      }

      if (!imageUrls.length) {
        alert("Please upload images first.");
        setLoading(false);
        return;
      }

      // 2. Save product to Supabase
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name,
            price: Number(price),
            category,
            description,

            variations: variations.map((v) => ({
              name: v.name,
              price: Number(v.price),
            })),

            product_type: productType,

            images: imageUrls,

            preview_images: previewImageUrls,

            main_image:
              imageUrls[0] ||
              previewImageUrls[0] ||
              "",

            digital_file_url: digitalFileUrl,

            is_downloadable:
              productType === "digital",

            download_limit: downloadLimit,

            download_expiry_hours:
              downloadExpiryHours,
          },
        ])
        .select();

      if (error) {
        console.error("Insert error:", error);
        alert("Failed to save product");
        setLoading(false);
        return;
      }

      console.log("Saved:", data);

      alert("Product saved!");

      // 3. Reset form
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setVariations([{ name: "", price: "" }]);
      setImages([]);
      setFiles([]);
      setMainImage("");

    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <main className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-[#5f2c17] mb-6">
          Add Product
        </h1>

        <div className="bg-white p-8 rounded-3xl max-w-4xl space-y-6">

          {/* NAME */}
          <label className="text-black font-medium bold">Product Name:</label>
          <input
            className="w-full border rounded-xl p-4"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* PRODUCT TYPE */}
          <div>
            <label className="block mb-2 font-medium text-black">
              Product Type:
            </label>

            <select
              value={productType}
              onChange={(e) =>
                setProductType(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            >
              <option value="physical">
                Physical Product
              </option>

              <option value="digital">
                Digital Product
              </option>
            </select>
          </div>
          {/* PRICE */}
          <label className="text-black font-medium bold">Base Price:</label>
          <input
            className="w-full border rounded-xl p-4"
            type="number"
            placeholder="Base Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* CATEGORY */}
          <label className="text-black font-medium bold">Category:</label>
          <input
            className="w-full border rounded-xl p-4"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* DESCRIPTION */}
          <label className="text-black font-medium bold">Description:</label>
          <textarea
            className="w-full border rounded-xl p-4 h-32"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* VARIATIONS */}
          
          <div>
            <p className="text-black font-semibold mb-2">Variations:</p>

            {variations.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 mb-3">
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Name"
                  value={v.name}
                  onChange={(e) =>
                    updateVariation(i, "name", e.target.value)
                  }
                />
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Price"
                  type="number"
                  value={v.price}
                  onChange={(e) =>
                    updateVariation(i, "price", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addVariationField}
              className="text-[#5f2c17] text-sm"
            >
              + Add Variation
            </button>
          </div>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div>
            <label className="block mb-4 font-medium text-black">
              Product Images
            </label>

            {/* UPLOAD BUTTON */}
            <label
              htmlFor="imageUpload"
              className="w-full border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#5f2c17] hover:bg-[#faf7f5] transition"
            >
              <div className="text-5xl">📷</div>

              <p className="mt-4 font-medium text-[#5f2c17]">
                Click to upload images
              </p>

              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, WEBP
              </p>
            </label>

            {/* MAIN IMAGE */}
            {mainImage && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">
                  Main Product Image
                </p>

                <img
                  src={mainImage}
                  alt="Main"
                  className="w-full h-[320px] object-cover rounded-3xl bg-[#eef5ef]"
                />
              </div>
            )}

            {/* THUMBNAILS */}
            {images.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    
                    {/* SELECT MAIN */}
                    <button
                      type="button"
                      onClick={() => setMainImage(image)}
                      className={`min-w-[90px] h-[90px] rounded-2xl overflow-hidden border-2 transition
                        ${
                          mainImage === image
                            ? "border-[#5f2c17]"
                            : "border-transparent"
                        }
                      `}
                    >
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* DELETE IMAGE */}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = images.filter(
                          (_, i) => i !== index
                        );

                        setImages(updatedImages);

                        // remove matching file too
                        setFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );

                        if (mainImage === image) {
                          setMainImage(updatedImages[0] || "");
                        }
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* SAVE BUTTON */}
            </div>
            {productType === "digital" && (
              <div className="space-y-6 border-t pt-6">

                <h2 className="text-2xl font-bold text-black">
                  Digital Product Settings
                </h2>

                {/* PREVIEW IMAGES */}
                <div>

                  <label className="block mb-2 font-medium text-black">
                    Watermarked Preview Images
                  </label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePreviewUpload}
                  />

                  <div className="flex gap-3 mt-4 flex-wrap">

                    {previewImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ))}

                  </div>

                </div>

                {/* DIGITAL FILE */}
                <div>

                  <label className="block mb-2 font-medium text-black">
                    Digital File
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.zip"
                    onChange={handleDigitalFileUpload}
                  />

                  {digitalFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      {digitalFile.name}
                    </p>
                  )}

                </div>

                {/* DOWNLOAD LIMIT */}
                <input
                  className="w-full border rounded-xl p-4"
                  type="number"
                  placeholder="Download Limit"
                  value={downloadLimit}
                  onChange={(e) =>
                    setDownloadLimit(Number(e.target.value))
                  }
                />

                {/* EXPIRY */}
                <input
                  className="w-full border rounded-xl p-4"
                  type="number"
                  placeholder="Expiry Hours"
                  value={downloadExpiryHours}
                  onChange={(e) =>
                    setDownloadExpiryHours(
                      Number(e.target.value)
                    )
                  }
                />

              </div>
            )}
          {/* SAVE BUTTON */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#5f2c17] text-white py-4 rounded-2xl hover:bg-[#3f1d10] transition disabled:opacity-50"
            >
              {loading ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
      
    </main>
  );
}