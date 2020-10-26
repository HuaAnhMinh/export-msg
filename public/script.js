document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      try {
        const prevButton = document.getElementById('prev');
        document.location.href = prevButton.href;
      }
      catch (error) {
        console.log(error);
      }
      break;
    case 'ArrowRight':
      try {
        const nextButton = document.getElementById('next');
        document.location.href = nextButton.href;
      }
      catch (error) {
        console.log(error);
      }
      break;
    default:
  }
});