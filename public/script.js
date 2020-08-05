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

module.exports = {
  onMouseOver,
};
