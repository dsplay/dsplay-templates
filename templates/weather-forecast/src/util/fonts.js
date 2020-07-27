/* eslint-disable import/prefer-default-export */

export const waitForFonts = async () => {
  if ('fonts' in document) {
    const { fonts } = document;
    console.log(fonts);
    await fonts.ready;
    console.log('fonts loaded', fonts);
  }
};
