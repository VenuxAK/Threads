import DOMPurify from "dompurify";
export const useSanitize = () => {
  const sanitize = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ["br", "span"],
      ALLOWED_ATTR: ["style", "class"],
      ALLOW_DATA_ATTR: false,
    });
  };
  const sanitizeWithHashtags = (text: string): string => {
    if (!text) return '';
    
    // First escape HTML entities to prevent XSS
    const escapedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    
    // Extract hashtags from the original text (before escaping)
    const hashtags = extractHashtags(text);
    let formattedText = escapedText.replace(/\n/g, "<br>");

    // Wrap hashtags in styled spans
    // Use a more robust replacement to avoid issues with overlapping tags
    hashtags.forEach((tag) => {
      // Escape the tag for regex
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
      tags.push(match[1]);
    }
    return tags;
  };
  return {
    sanitize,
    sanitizeWithHashtags,
    extractHashtags,
  };
};
