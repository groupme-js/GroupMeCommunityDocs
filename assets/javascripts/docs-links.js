// allows for linking to the official documentation using a comment beneath any header in the format:
// <!-- official-doc: https://example.com/path/to/documentation -->

function getMaterialLinkIcon() {
  const existingTwemoji = document.querySelector('.twemoji svg');
  if (existingTwemoji) {
    const iconClone = existingTwemoji.cloneNode(true);
    const path = iconClone.querySelector('path');
    if (path) {
      path.setAttribute('d', 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5');
      path.setAttribute('fill', 'currentColor');
    }
    return iconClone.outerHTML;
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="twemoji" style="width: 1.125em; height: 1.125em; vertical-align: baseline; margin-left: 0.25em; transform: translateY(0.1em);"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>`;
}

const materialLinkIcon = getMaterialLinkIcon();

function addPermanentLinks() {
  console.log("Adding permanent links to headers...");
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    null,
    false
  );
  
  let comment;
  const processedComments = new Set();
  
  while (comment = walker.nextNode()) {
    if (comment.nodeValue.trim().startsWith("official-doc:") && !processedComments.has(comment)) {
      processedComments.add(comment);
      
      const url = comment.nodeValue.trim().replace("official-doc:", "").trim();
      
      let currentNode = comment.previousSibling;
      let foundHeader = null;
      
      // Search for header in previous siblings
      while (currentNode && !foundHeader) {
        if (currentNode.nodeType === Node.ELEMENT_NODE && 
            /^H[1-6]$/.test(currentNode.tagName)) {
          foundHeader = currentNode;
          break;
        }
        currentNode = currentNode.previousSibling;
      }
      
      // If no header found, search in parent's previous siblings
      if (!foundHeader) {
        let parentNode = comment.parentNode;
        while (parentNode && parentNode !== document.body) {
          currentNode = parentNode.previousSibling;
          while (currentNode && !foundHeader) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
              if (/^H[1-6]$/.test(currentNode.tagName)) {
                foundHeader = currentNode;
                break;
              }
              const headerInNode = currentNode.querySelector('h1, h2, h3, h4, h5, h6');
              if (headerInNode) {
                const headers = currentNode.querySelectorAll('h1, h2, h3, h4, h5, h6');
                foundHeader = headers[headers.length - 1];
                break;
              }
            }
            currentNode = currentNode.previousSibling;
          }
          if (foundHeader) break;
          parentNode = parentNode.parentNode;
        }
      }
      
      if (foundHeader) {
        // Check if link already exists
        const existingLinks = Array.from(foundHeader.querySelectorAll('a.headerlink'));
        if (existingLinks.some(link => link.href === url)) continue;
        
        // Create and configure the link
        const link = document.createElement("a");
        link.href = url;
        link.title = "Permanent link";
        link.className = "headerlink";
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = materialLinkIcon; // Add the icon as content
        
        // Actually append the link to the header
        foundHeader.appendChild(link);
        
        console.log(`Added link to header: ${foundHeader.textContent} -> ${url}`);
      } else {
        console.warn(`No header found for comment: ${comment.nodeValue}`);
      }
    }
  }
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", addPermanentLinks);

// Monitor for dynamic content changes
const observer = new MutationObserver(function(mutations) {
  let shouldProcess = false;
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node.tagName && /^H[1-6]$/.test(node.tagName) || 
             node.querySelector && node.querySelector('h1, h2, h3, h4, h5, h6'))) {
          shouldProcess = true;
          break;
        }
      }
    }
  });
  
  if (shouldProcess) {
    console.log("DOM mutation detected, processing links...");
    clearTimeout(window.linkProcessingTimeout);
    window.linkProcessingTimeout = setTimeout(addPermanentLinks, 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});