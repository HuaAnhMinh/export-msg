async function loadPhotosResource() {
  for (const i in photosResource) {
    const aTags = document.getElementsByClassName(`ZA-a-${i}`);
    for (const aTag of aTags) {
      aTag.href = photosResource[i].urlLocal;
    }

    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      if (photosResource[i].status === downloadedStatus.succeed) {
        imgTag.src = photosResource[i].urlLocal;
      }
      else {
        imgTag.src = './resources/error-placeholder.png';
        imgTag.classList.add('error-placeholder');
      }
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
      if (filesResource[i].status === downloadedStatus.succeed) {
        imgTag.src = `${filesResource[i].dir}/${filesResource[i].fileNameImg}`;
      }
      else {
        imgTag.src = './resources/error-placeholder.png';
        imgTag.classList.add('error-placeholder');
      }
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
      if (gifsResource[i].status === downloadedStatus.succeed) {
        imgTag.src = `${gifsResource[i].dir}/${gifsResource[i].fileName}`;
      }
      else {
        imgTag.src = './resources/error-placeholder.png';
        imgTag.classList.add('error-placeholder');
      }
    }
  }
}

async function loadLinksResource() {
  for (const i in linksResource) {
    const imgTags = document.getElementsByClassName(`ZA-img-${i}`);
    for (const imgTag of imgTags) {
      if (linksResource[i].status === downloadedStatus.succeed) {
        imgTag.src = `${linksResource[i].dir}/${linksResource[i].fileName}`;
      }
      else {
        imgTag.src = './resources/error-placeholder.png';
        imgTag.classList.add('error-placeholder');
      }
    }
  }
}

async function loadMP3sResource() {
  // for (const i in mp3sResource) {
  //   const aTags = document.getElementsByClassName(`ZA-a-${i}`);
  //   for (const aTag of aTags) {
  //     aTag.href = mp3sResource[i].urlLocal;
  //   }

  //   const sourceTags = document.getElementsByClassName(`ZA-source-${i}`);
  //   for (const sourceTag of sourceTags) {
  //     sourceTag.src = `${mp3sResource[i].dir}/${mp3sResource[i].fileName}`;
  //   }
  // }
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
  loadResources,
  loadPhotosResource,
  loadFilesResource,
  loadStickersResource,
  loadGifsResource,
  loadLinksResource,
  loadMP3sResource
};
