function onMouseOver(node) {
  if (typeof displayList[node.id] !== 'undefined') {
    if (displayList[node.id]) return;
  }

  let i = 0;
  let frameNumber = 0;
  const img = new Image();
  const cssText = node.style.cssText;
  const startIndex = cssText.indexOf('(') + 2;
  const endIndex = cssText.indexOf(')') - 1;

  img.onload = ({ path }) => {
    const [img] = path;
    frameNumber = (img.width) / 130;
    displayList[node.id] = true;

    const id = setInterval(() => {
      node.style.backgroundPosition = `${(i = i - 130)}px 0px`;
    }, 150);
    setTimeout(() => {
      node.style.backgroundPosition = "0px 0px";
      displayList[node.id] = false;
      clearInterval(id);
    }, frameNumber * 150);
  }
  img.src = cssText.substring(startIndex, endIndex);
}

function loadPhotoResource() {
  for (const i in photosResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = photosResource[i].urlLocal;
    }

    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      imgTag.src = photosResource[i].urlLocal;
    }

    const titleDivTags = document.getElementsByClassName(`ZA-div-title-${i}`);
    for (const titleDivTag of titleDivTags) {
      titleDivTag.textContent = photosResource[i].fileName;
    }

    const sizeDivTags = document.getElementsByClassName(`ZA-div-size-${i}`);
    for (const sizeDivTag of sizeDivTags) {
      sizeDivTag.textContent = photosResource[i].size
    }
  }
}

function loadResources() {
  loadPhotoResource();
}

module.exports = {
  onMouseOver,
  loadResources,
  loadPhotoResource
};
