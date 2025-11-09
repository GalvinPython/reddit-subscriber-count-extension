import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const distFolder = path.join(process.cwd(), 'dist');
const manifestFile = path.join(process.cwd(), 'src/manifest.json');
const destManifestFile = path.join(distFolder, 'manifest.json');
const iconFile = path.join(process.cwd(), 'src/icon.png');
const imgsFolder = path.join(distFolder, 'imgs');

// Create dist folder if it doesn't exist
if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
}

// Create imgs folder if it doesn't exist
if (!fs.existsSync(imgsFolder)) {
    fs.mkdirSync(imgsFolder);
}

// Copy manifest.json to dist folder
fs.copyFileSync(manifestFile, destManifestFile);
console.log('Copied manifest.json to dist folder');

// Resize icons using sharp
async function resizeIcon() {
    try {
        const sizes = [16, 32, 48, 128];

        for (const size of sizes) {
            const outputFile = path.join(imgsFolder, `icon-${size}.png`);
            await sharp(iconFile)
                .resize(size, size)
                .toFile(outputFile);

            console.log(`Created icon-${size}.png`);
        }
    } catch (error) {
        console.error('Error resizing icons:', error);
    }
}

resizeIcon().catch(console.error);
