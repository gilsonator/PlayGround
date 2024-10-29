window.onload = function () {
  const logo = document.getElementById('logo-upload');
  const canvas = document.getElementById('qr-canvas');
  const btnDownload = document.getElementById('download-btn');
  const faviconImage = document.getElementById('favicon');
  const paddingInput = document.getElementById('icon-padding');
  const dropArea = document.getElementById('drop-area');
  // 1px x 1px transparent PNG image
  // const favIconDefault = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"';
  const favIconDefault = 'icons/page.svg';
  let iconFile;
  let url;

  faviconImage.addEventListener('error', function () {
    faviconImage.src = favIconDefault; // Fallback icon
  });

  faviconImage.addEventListener('load', function (event) {
    drawIcon();
  });

  document.getElementById('URL').addEventListener('change', function URLOnChange (event) {
    url = event.target.value;
    // Checks if the URL has a specified protocol. If not, prepends "https://"
    if (!/^(https?:\/\/)/i.test(url)) {
      url = 'https://' + url;
    }

    console.log('URL:', url);

    if (isValidURL(url)) {
      try {
        const faviconUrl = getFaviconURL(url); // No async/await needed here
        faviconImage.src = faviconUrl;
        logo.disabled = false;

        drawQR();
      } catch (error) {
        console.error('Error setting favicon:', error);
        faviconImage.src = favIconDefault; // Use default icon if an error occurs
      }
    } else {
      logo.disabled = true;
      faviconImage.src = favIconDefault;
    }
  });

  logo.addEventListener('change', function (event) {
    iconFile = event.target.files[0];
    drawIcon();
  });

  dropArea.addEventListener('dragover', function (event) {
      event.preventDefault();
      dropArea.classList.add('dragover');
  });

  dropArea.addEventListener('dragleave', function () {
      dropArea.classList.remove('dragover');
  });

  dropArea.addEventListener('drop', function (event) {
      event.preventDefault();
      dropArea.classList.remove('dragover');
      if (event.dataTransfer.files.length > 0) {
          iconFile = event.dataTransfer.files[0];
          drawIcon();
      }
  });

  btnDownload.addEventListener('click', function btnDownloadClick () {
    const link = document.createElement('a');
    link.download = 'QRCode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  paddingInput.addEventListener('change', function () {
    drawIcon();
  });

  function isValidURL(string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(string);
  }

  function getFaviconURL(url) {
    const link = document.createElement('a');
    link.href = url;
    return `https://icons.duckduckgo.com/ip3/${link.hostname}.ico`;
  }

  function drawQR() {
    const qr = new QRious({
      element: canvas,
      value: url,
      size: 800,
      padding: 30,
    });

    drawIcon();
    btnDownload.disabled = false;
  }

  async function drawIcon() {
    if (iconFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        drawImage(e.target.result);
      };
      reader.readAsDataURL(iconFile);
    } else if (faviconImage.src) {
        const imgSrc = faviconImage.src;
        drawImage(imgSrc);
    }
  }

  function drawImage(src) {
    const logo = new Image();
    logo.crossOrigin = "Anonymous";
    logo.onload = function () {
      const ctx = canvas.getContext('2d');
      const logoSize = canvas.width / 5;
      const logoX = (canvas.width - logoSize) / 2;
      const logoY = (canvas.height - logoSize) / 2;
      const padding = parseInt(paddingInput.value) || 4; // Ensure padding is a number

      // Draw white rectangle with padding behind the logo
      ctx.fillStyle = 'white';
      ctx.fillRect(
        logoX - padding,
        logoY - padding,
        logoSize + padding * 2,
        logoSize + padding * 2
      );
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      canvas.title = `QR Code, scan to open: ${url}`;
    };
    logo.src = src;
  }
};
