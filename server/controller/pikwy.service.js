const axios = require("axios");
const path = require("path");
const { cloudinary } = require("../utils/cloudinary");
const fs = require("fs");

const pikwyService = async (req, res) => {
  const { url } = req.body;
  console.log(process.env.PIKWY_TOKEN, url);
  const sendUrl = `https://api.pikwy.com?token=${process.env.PIKWY_TOKEN}&url=${url}&width=1280&height=1024&response_type=image`;
  try {
    const response = await axios({
      url: sendUrl,
      method: "GET",
      responseType: "stream",
    });

    // Create a writable stream to save the image
    const imagePath = path.join(__dirname, "images", "downloaded_image.jpg");
    const writer = fs.createWriteStream(imagePath);

    // Pipe the response stream to the writable stream
    response.data.pipe(writer);

    writer.on("finish", async () => {
      // Uploading to Cloudinary
      try {
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
          resource_type: "image",
        });
        console.log(uploadResult);
        res.status(200).json({
          message: "Image uploaded successfully.",
          // data: uploadResult,
          url: uploadResult.url,
          time: uploadResult.created_at,
          size: uploadResult.bytes,
        });
      } catch (uploadError) {
        console.error("pikwy api is on cooldown", uploadError);
        res.status(500).json({ error: "pikwy api is on cooldown" });
      }
    });

    writer.on("error", (error) => {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal server error." });
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = pikwyService;
