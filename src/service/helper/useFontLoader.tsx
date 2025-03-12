// useFontLoader.ts
import { useEffect, useState } from 'react';

const useFontLoader = (fontUrl: string, fontFamily: string) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace(fontFamily, `url(http://localhost:5173/${fontUrl})`);
    font.load()
      .then(() => document.fonts.add(font))
      .then(() => setFontLoaded(true))
      .catch((error) => console.error('Font loading failed:', error));
  }, [fontUrl, fontFamily]);

  return fontLoaded;
};

export default useFontLoader;
