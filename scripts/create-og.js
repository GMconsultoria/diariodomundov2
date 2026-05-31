const Jimp = require('jimp');

(async function() {
  try {
    const image = new Jimp(1200, 630, '#1a1a18');
    const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    const fontSub = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    
    // Centered title
    image.print(fontTitle, 0, 250, { 
      text: 'Diário do Mundo', 
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, 
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE 
    }, 1200, 630);
    
    // Centered subtitle
    image.print(fontSub, 0, 320, { 
      text: 'Notícias Independentes', 
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, 
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE 
    }, 1200, 630);
    
    await image.writeAsync('client/public/og-image.png');
    console.log('Created client/public/og-image.png');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
