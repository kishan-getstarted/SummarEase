export function extractPageContent(): string {
    const unwantedSelectors = [
      'script', 'style', 'noscript', 'iframe', 'nav', 'footer',
      'header', 'aside', '[role="complementary"]', '[role="banner"]'
    ];
  
    // Clone the body to avoid modifying the DOM
    const clonedBody = document.body.cloneNode(true) as HTMLElement;
  
    // Remove unwanted elements from the cloned body
    const elements = clonedBody.querySelectorAll(unwantedSelectors.join(','));
    elements.forEach(el => el.remove());
  
    // Get clean text content
    const mainContent = clonedBody.innerText;
    return mainContent.trim();
  }
  