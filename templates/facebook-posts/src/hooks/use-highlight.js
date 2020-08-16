import useStyle from './use-style';

export default function useHighlight(originalText = '') {
  const {
    hashtagColor,
    linkColor,
    mentionColor,
    phoneColor,
  } = useStyle();

  const hashtagRegex = /(#[^\s]+)/g;
  let text = originalText;
  text = text.replace(hashtagRegex, (url) => `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, (url) => `<a href="${url}" style="color: ${linkColor};">${url}</a>`);

  const mentionRegex = /(@[^\s]+)/g;
  text = text.replace(mentionRegex, (url) => `<span class="mention" style="color: ${mentionColor}">${url}</span>`);

  const phoneRegex = /((\+\d{1,3})?\s?(\(\d{2}\))?\s?(\d\s?-?\.?){8,14}(\s|\b))/g;
  text = text.replace(phoneRegex, (url) => `<span class="mention" style="color: ${phoneColor}">${url}</span>`);

  text = text.replace(/\n/gm, () => '<br/>');

  return text;
}
