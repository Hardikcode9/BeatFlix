const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const mediaDir = '../scratch_docx/word/media';

async function findDucat() {
    const files = fs.readdirSync(mediaDir);
    const imageFiles = files.filter(f => f.endsWith('.jpeg') || f.endsWith('.png'));

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fullPath = path.join(mediaDir, file);
        console.log(`Analyzing ${file}...`);
        
        try {
            const { data: { text } } = await Tesseract.recognize(fullPath, 'eng');
            
            if (text.toUpperCase().includes('DUCAT')) {
                console.log(`\n*** FOUND DUCAT IN ${file} ***\n`);
                console.log('Text context:', text.substring(Math.max(0, text.toUpperCase().indexOf('DUCAT') - 50), text.toUpperCase().indexOf('DUCAT') + 50));
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    }
    console.log('Finished analyzing all images.');
}

findDucat();
