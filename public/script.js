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

async function loadPhotosResource() {
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
      sizeDivTag.textContent = photosResource[i].size;
    }
  }
}

async function loadFilesResource() {
  for (const i in filesResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = filesResource[i].urlLocal
    }

    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      imgTag.src = `${filesResource[i].dir}/${filesResource[i].fileNameImg}`;
    }

    const sizeDivTags = document.getElementsByClassName(`ZA-div-size-${i}`);
    for (const sizeDivTag of sizeDivTags) {
      sizeDivTag.textContent = filesResource[i].size;
    }
  }
}

async function loadStickersResource() {
  for (const i in stickersResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = stickersResource[i].urlLocal;
    }

    const divTags = document.getElementsByClassName(`ZA-div-style-${i}`);
    for (const divTag of divTags) {
      // divTag.style = `
      //   width: 130px;
      //   height: 130px;
      //   background-image: url('./${stickersResource[i].dirValue}/${stickersResource[i].fileName}');
      //   background-position: 0px 0px;
      //   background-repeat: repeat-x;
      //   background-size: ${stickersResource[i].width} ${stickersResource[i].height}`;
      divTag.src = `./${stickersResource[i].dirValue}/${stickersResource[i].fileName}`;
    }
  }
}

async function loadGifsResource() {
  for (const i in gifsResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = gifsResource[i].urlLocal;
    }

    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      imgTag.src = `${gifsResource[i].dir}/${gifsResource[i].fileName}`;
    }
  }
}

async function loadLinksResource() {
  for (const i in linksResource) {
    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      imgTag.src = `${linksResource[i].dir}/${linksResource[i].fileName}`;
    }
  }
}

async function loadMP3sResource() {
  for (const i in mp3sResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = mp3sResource[i].urlLocal;
    }

    const sourceTags = document.getElementsByClassName(`ZA-source-${i}`);
    for (const sourceTag of sourceTags) {
      sourceTag.src = `${mp3sResource[i].dir}/${mp3sResource[i].fileName}`;
    }
  }
}

function loadResources() {
  loadPhotosResource();
  loadFilesResource();
  loadStickersResource();
  loadGifsResource();
  loadLinksResource();
  loadMP3sResource();
}

module.exports = {
  onMouseOver,
  loadResources,
  loadPhotosResource,
  loadFilesResource,
  loadStickersResource,
  loadGifsResource,
  loadLinksResource,
  loadMP3sResource
};
