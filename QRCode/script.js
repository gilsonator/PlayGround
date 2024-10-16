window.onload = function() {
    const logo = document.getElementById('logo-upload');
    const canvas = document.getElementById('qr-canvas');
    let iconFile;
    
    document.getElementById('URL').addEventListener('input', function(event) {
        logo.disabled = !isValidURL(event.target.value);
        drawQR();
    });
    
    logo.addEventListener('change', function(event) {
        iconFile = event.target.files[0];
        drawQR();
    });

    document.getElementById('download-btn').addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'QRCode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    document.getElementById('icon-padding').addEventListener('change', function() {
        drawQR();
    });

    function isValidURL(string) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(string);
    };

    function drawQR () {
        if (iconFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const logo = new Image();
                logo.onload = function() {
                    const URL = document.getElementById("URL").value;
                    const qr = new QRious({
                        element: document.getElementById('qr-canvas'),
                        value: URL,
                        size: 800,
                        padding: 30,
                    });

                    const ctx = canvas.getContext('2d');

                    const logoSize = canvas.width / 5;
                    const logoX = (canvas.width - logoSize) / 2;
                    const logoY = (canvas.height - logoSize) / 2;
                    const padding = document.getElementById("icon-padding").value;
                    
                    // Draw white rectangle with padding behind the logo
                    ctx.fillStyle = 'white';
                    ctx.fillRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2);
                    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    
                    document.getElementById('download-btn').disabled = false;
                    
                };
                logo.src = e.target.result;

            };
            reader.readAsDataURL(iconFile);
        }
    }
};
