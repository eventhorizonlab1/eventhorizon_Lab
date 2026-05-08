const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../public/Atelier');

async function processDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await processDirectory(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(fullPath)) {
            const parsed = path.parse(fullPath);
            const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

            // Skip if already exists
            if (fs.existsSync(webpPath)) continue;

            console.log(`Optimizing: ${file} -> .webp`);
            try {
                await sharp(fullPath)
                    .webp({ quality: 80, effort: 4 })
                    .toFile(webpPath);

                // Supprimer l'original pour gagner de la place (puisque c'est une copie)
                fs.unlinkSync(fullPath);
            } catch (err) {
                console.error(`Error optimizing ${file}:`, err);
            }
        }
    }
}

console.log("Starting WebP image optimization...");
processDirectory(dir)
    .then(() => console.log("Optimization complete!"))
    .catch(err => console.error(err));
