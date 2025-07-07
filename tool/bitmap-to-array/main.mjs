const image = document.querySelector("#image");
const imageInput = document.querySelector("#imageInput");
const outputText = document.querySelector("#outputText");

const canvas = document.createElement("canvas");

function getResult(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    
    const result = [];
    for (let i = 0; i < data.data.length; i += 128) {
        console.log(i);
        let element = 0;
        for (let j = 0; j !== 32; ++j) {
            const index = i + 4 * j + 3;

            let bit;
            if (index < data.data.length) {
                bit = data.data[index] > 0 ? 1 : 0;
            } else {
                bit = 0;
            }
            element = element | (bit << j);
        }
        result.push(element);
    }

    return JSON.stringify(result);
}

imageInput.onchange = e => {
    const files = imageInput.files;
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            image.src = reader.result;
            image.onload = e => {
                outputText.value = getResult(image);
            };
        };
    }
};