  const textEncoder = new TextEncoderStream();
  const textDecoder = new TextDecoderStream();
  const reader = textDecoder.readable.getReader();
  const writer = textEncoder.writable.getWriter();
  const command = document.getElementById('command');
  const result = document.getElementById('result');

  document.getElementById('send').addEventListener('click', async () => {
    await writer.write('#'+command.value+'!');
  });
  
  document.getElementById('connect').addEventListener('click', async () => {


/*
     const filters = [
      { usbVendorId: 0x2341, usbProductId: 0x0043 },
      { usbVendorId: 0x2341, usbProductId: 0x0001 }
    ];
    
    const port = await navigator.serial.requestPort({ filters });
*/
    const port = await navigator.serial.requestPort();      
    const { productId, vendorId } = port.getInfo();
    console.log(productId, vendorId);

    // Wait for the serial port to open.
    await port.open({ baudRate: 115200 });

    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // 나중에 시리얼 포트가 닫힐 수 있도록 해준다.
        reader.releaseLock();
        break;
      }

      if (value) {
        result.innerHTML = value;
        console.log(value);
      }
    }
  });

  if ("serial" in navigator) result.innerHTML = "Your browser supports Web Serial API!";
  else result.innerHTML = "Your browser does not support Web Serial API, the latest version of Google Chrome is recommended!";
