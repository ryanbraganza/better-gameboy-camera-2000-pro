import EscPosEncoder from 'esc-pos-encoder';

const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const button = document.querySelector('#start');
const print = document.querySelector('#print');
let ctx;
let device;
let myInterface = 0x00;

button.onclick = () => {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
  .then(stream => {
    video.srcObject = stream;
    video.play(); 
  })
}
video.onclick = () => {
  ctx = canvas.getContext('2d');
  const m = Math.min(video.videoWidth, video.videoHeight);
  const dw = (video.videoWidth - m) / 2;
  const dh = (video.videoHeight - m) / 2;
  ctx.drawImage(video, dw, dh, m, m, 0, 0, 320, 320);
  video.remove();
};

// const img https://static-cdn.jtvnw.net/emoticons/v1/805666/2.0
const noopkaCoffee = 'data:image/png;base64,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';

const emojis = "🤯,😇,💅,🤖,🦄,🙈,☕️,😭".split(",");

canvas.onclick = (e) => {
  const [x, y] = [e.offsetX - 16, e.offsetY - 16];
  if(e.shiftKey) {
    const img = new Image();
    img.src = noopkaCoffee;
    img.onload = () => {
      ctx.drawImage(img, x, y);
    };
    return;
  }
  ctx.font = '32px Arial';
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  ctx.fillText(emoji,x,y);
};

print.onclick = () => {
  navigator.usb.requestDevice({ filters: [{ productId: 0x20497 }] })
    .then(device2 => {
      device = device2;
      return device.open();
    })
    .then(() => device.open())
    .then(() => device.selectConfiguration(1))
    .then(() => device.claimInterface(myInterface))
    .then(() => device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: myInterface
    }))
    .then(() => {
      // const encoder = new TextEncoder();
      // const uint8array = encoder.encode("\x1b@hello world\x0a\x0a\x0a");
      // device.transferOut(1, uint8array);
      const posEncoder = new EscPosEncoder();

      canvas.toBlob(blob => {
        const blobURL = URL.createObjectURL(blob);
        const cat = new Image();
        cat.onload = () => {
          const result = posEncoder
          .initialize()
          .image(cat, 320, 320, 'bayer')
          .encode();

          device.transferOut(1, result);
        }

        cat.src = blobURL;

        
        //asdklsdjfksdlf
      });
    });
}
