document.getElementById('qr-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const text = document.getElementById('qr-text').value;
    const mosaicLevel = parseInt(document.getElementById('mosaic-level').value, 10);

    // QRコード生成
    const qrCanvas = document.getElementById('qr-canvas');
    const ctx = qrCanvas.getContext('2d');

    // 既存のQRコードを消去
    ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

    const qrCode = new QRCode(qrCanvas, {
        text: text,
        width: 256,
        height: 256,
    });

    // モザイク処理
    qrCanvas.toBlob((blob) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height); // 既存の画像を消去
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
            const pixels = imageData.data;

            // モザイクアルゴリズム
            const blockSize = mosaicLevel; // モザイクの強度に応じてブロックサイズを変更
            for (let y = 0; y < qrCanvas.height; y += blockSize) {
                for (let x = 0; x < qrCanvas.width; x += blockSize) {
                    const i = (y * qrCanvas.width + x) * 4;

                    // 平均色を計算
                    const avgR = pixels[i];
                    const avgG = pixels[i + 1];
                    const avgB = pixels[i + 2];

                    // ブロックに平均色を適用
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const j = ((y + dy) * qrCanvas.width + (x + dx)) * 4;
                            if (j < pixels.length) {
                                pixels[j] = avgR;
                                pixels[j + 1] = avgG;
                                pixels[j + 2] = avgB;
                            }
                        }
                    }
                }
            }

            // 更新
            ctx.putImageData(imageData, 0, 0);
        };
    });
});
