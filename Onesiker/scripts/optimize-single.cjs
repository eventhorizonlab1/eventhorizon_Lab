const sharp = require('sharp');
const fs = require('fs');

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
    console.error("Usage: node optimize-single.cjs <input> <output>");
    process.exit(1);
}

sharp(input)
    .webp({ quality: 80, effort: 4 })
    .toFile(output)
    .then(() => {
        console.log("SUCCESS");
        process.exit(0);
    })
    .catch(err => {
        console.error("ERROR:", err);
        process.exit(1);
    });
