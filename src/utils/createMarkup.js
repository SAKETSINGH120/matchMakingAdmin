import DOMPurify from "dompurify";

function createMarkup(html) {
  return {
    __html: DOMPurify.sanitize(html),
  };
}

export default createMarkup;
