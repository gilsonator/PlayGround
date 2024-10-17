window.onload = function () {
  const logo = document.getElementById('logo-upload');
  const canvas = document.getElementById('qr-canvas');
  const btnDownload = document.getElementById('download-btn');
  const faviconImage = document.getElementById('favicon');
  const paddingInput = document.getElementById('icon-padding');
  const favIconDefault = 'icons/website-icon.ico';
  let iconFile;
  let url;

  faviconImage.addEventListener('error', function () {
    faviconImage.src = favIconDefault; // Fallback icon
  });

  document.getElementById('URL').addEventListener('change', function (event) {
    url = event.target.value;
    // Regex to check if the URL starts with "http://" or "https://". If not, it prepends "https://"
    if (!/^(https?:\/\/)/i.test(url)) {
      url = 'https://' + url;
    }

    console.log('URL:', url);
    event.target.title = url;

    if (isValidURL(url)) {
      const faviconUrl = getFavicon(url);
      faviconImage.src = faviconUrl;
      logo.disabled = false;
      drawQR();
    } else {
      logo.disabled = true;
      faviconImage.src = favIconDefault;
    }
  });

  logo.addEventListener('change', function (event) {
    iconFile = event.target.files[0];
    drawQR();
  });

  btnDownload.addEventListener('click', function () {
    const link = document.createElement('a');
    link.download = 'QRCode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  paddingInput.addEventListener('change', function () {
    drawQR();
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

  function getFavicon(url) {
    const link = document.createElement('a');
    link.href = url;
    return `https://icons.duckduckgo.com/ip3/${link.hostname}.ico`;
  }

  function drawQR() {
    if (iconFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const logo = new Image();
        logo.onload = function () {
          const qr = new QRious({
            element: canvas,
            value: url,
            size: 800,
            padding: 30,
          });
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

          btnDownload.disabled = false;
        };
        logo.src = e.target.result;
      };
      reader.readAsDataURL(iconFile);
    }
  }
};
