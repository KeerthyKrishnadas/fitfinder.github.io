// --- Photo Color Analysis ---
let uploadedImage = null;
document.getElementById('photoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImage = new Image();
    uploadedImage.onload = function() {
      const canvas = document.getElementById('photoCanvas');
      const ctx = canvas.getContext('2d');
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
      ctx.drawImage(uploadedImage, 0, 0);
    };
    uploadedImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('analyzePhoto').addEventListener('click', () => {
  if (!uploadedImage) {
    alert("Please upload a photo first.");
    return;
  }
  const canvas = document.getElementById('photoCanvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
    count++;
  }
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  let suggestedColors = [];
  if (r > 200 && g > 180) {
    suggestedColors = ['#87ceeb', '#f4a460', '#ffffff', '#4682b4'];
  } else if (r > 100 && r < 200) {
    suggestedColors = ['#8b4513', '#ffdead', '#556b2f', '#d2691e'];
  } else {
    suggestedColors = ['#daa520', '#8b0000', '#2f4f4f', '#ff4500'];
  }

  const paletteDiv = document.getElementById('bestColors');
  paletteDiv.innerHTML = '';
  suggestedColors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.style.backgroundColor = color;
    paletteDiv.appendChild(swatch);
  });

  document.getElementById("resultBox").innerHTML = `
    Average Color: rgb(${r}, ${g}, ${b})<br>
    Suggested Colors Displayed Above.
  `;
});

// --- Size Prediction ---
document.getElementById("sizeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const gender = document.querySelector('input[name="gender"]:checked').value;
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const chest = parseInt(document.getElementById("chest").value);
  const waist = parseInt(document.getElementById("waist").value);
  const fit = document.querySelector('input[name="fit"]:checked').value;
  const inseam = document.getElementById("inseam").value;

  let size = "M";

  // Size logic - example ranges for Men and Women
  if (gender === "Men") {
    if (chest < 85 || waist < 70) size = "XS";
    else if (chest < 90) size = "S";
    else if (chest <= 100) size = "M";
    else if (chest <= 110) size = "L";
    else if (chest <= 120) size = "XL";
    else if (chest <= 130) size = "XXL";
    else size = "XXXL";
  } else {
    if (chest < 80 || waist < 65) size = "XS";
    else if (chest < 85) size = "S";
    else if (chest <= 95) size = "M";
    else if (chest <= 105) size = "L";
    else if (chest <= 115) size = "XL";
    else if (chest <= 125) size = "XXL";
    else size = "XXXL";
  }

  document.getElementById("resultBox").innerHTML = `
    Gender: <b>${gender}</b><br>
    Suggested Size: <b>${size}</b><br>
    Fit: <b>${fit}</b><br>
    Inseam: <b>${inseam}</b><br>
    (Height: ${height} cm, Weight: ${weight} kg)
  `;
});