export const fontFamilyOptions = [
  "Inter",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Nunito",
  "Playfair Display",
  "Raleway",
  "DM Sans",
  "Plus Jakarta Sans",
  "Outfit"
];

export const defaultFontFamily = "Inter";

export const defaultDisplaySettings = {
  showClientInformation: true
};

export const fontFamilyStack = (fontFamily) => {
  const selectedFont = fontFamilyOptions.includes(fontFamily) ? fontFamily : defaultFontFamily;

  return `"${selectedFont}", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
};
