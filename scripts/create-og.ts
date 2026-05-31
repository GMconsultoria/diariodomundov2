import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function() {
  try {
    // Create new image 1200x630 with color #1a1a18
    // Note: Jimp's constructor is Jimp.read or new Jimp() depending on version, but 0.22.x supports new Jimp
    // Jimp expects a color hex value or string
    const image = new Jimp(1200, 630, '#1a1a18');
    const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    const fontSub = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    
    // Centered title
    image.print(fontTitle, 0, 250, { 
      text: 'Diario do Mundo', 
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, 
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE 
    }, 1200, 630);
    
    // Centered subtitle
    image.print(fontSub, 0, 340, { 
      text: 'Noticias Independentes', 
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, 
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE 
    }, 1200, 630);
    
    const outputPath = path.resolve(__dirname, '../client/public/og-image.png');
    await image.writeAsync(outputPath);
    console.log('Created client/public/og-image.png');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
