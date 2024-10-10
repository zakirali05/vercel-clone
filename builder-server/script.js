import { exec } from "child_process";
import path from "path";
import fs from "fs";
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

// ALSO SETUP KAFKA OR REDIS PUB SUB FOR LOGS

const init = async () => {
  try {
    console.log("Executing script.js...");
    const outputDirectory = path.join(__dirname, "output");

    const p = exec(`cd ${outputDirectory} && npm install && npm run build`);

    p.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    p.stdout.on("error", (data) => {
      console.log(`Error : ${data.toString()}`);
    });

    p.on("close", async () => {
      console.log("Build Complete");

      const distFolderPath = path.join(__dirname, "output", "dist");

      const distFolderContents = fs.readdirSync(distFolderPath, {
        recursive: true,
      });

      // UPLOAD THE FILES TO MULTER 9001
      console.log(distFolderContents);

      for (const file of distFolderContents) {
        const filePath = path.join(distFolderPath, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        console.log("uploading...", filePath);

        const RANDOM_FOLDER_NAME = uniqueNamesGenerator({
          dictionaries: [adjectives, animals, colors],
          length: 4,
        });

        // const command = new PutObjectCommand({
        //   Bucket: "vercel-clone-outputs",
        //   Key: `__outputs/${PROJECT_ID}/${file}`,
        //   Body: fs.createReadStream(filePath),
        //   ContentType: mime.lookup(filePath),
        // });

        // await s3Client.send(command);
        // publishLog(`uploaded ${file}`);
        // console.log("uploaded", filePath);

        const result = await fetch("http://localhost:9001/upload", {
          folderName: RANDOM_FOLDER_NAME,
          fileData: file,
        });
        const response = await result?.json();

        if (response?.status === 200) {
          console.log(`Done uploading ${filePath}`);
        } else {
          console.log(`Error : ${response?.message}`);
        }
      }
    });
  } catch (err) {
    console.log(`Error : ${err}`);
  }
};

init();
