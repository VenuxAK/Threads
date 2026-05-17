import DOMPurify from "dompurify";

export const useSanitize = () => {
  const sanitize = (dirty: string): string => {
    if (!import.meta.client) return dirty;
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ["br", "span"],
      ALLOWED_ATTR: ["style", "class"],
      ALLOW_DATA_ATTR: false,
    });
  };

  const sanitizeWithHashtags = (text: string): string => {
    if (!text) return '';
    if (!import.meta.client) return text;

    const escapedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    const hashtags = extractHashtags(escapedText);
    let formattedText = escapedText.replace(/\n/g, "<br>");

    hashtags.forEach((tag) => {
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tagRegex = new RegExp(`#${escapedTag}(?![\\w#])`, "g");
      formattedText = formattedText.replace(
        tagRegex,
        `<span style="color: #1da1f2;">#${tag}</span>`,
      );
    });

    return sanitize(formattedText);
  };

  const extractHashtags = (caption: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const tags: string[] = [];
    let match;
    while ((match = hashtagRegex.exec(caption)) !== null) {
      if (match[1]) {
        tags.push(match[1]);
      }
    }
    return tags;
  };

  return { sanitize, sanitizeWithHashtags, extractHashtags };
};
