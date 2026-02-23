// status-service.js
const express = require('express');
const { execSync } = require('child_process');
const app = express();
const PORT = 4000;

function checkNms() {
  try {
    const output = execSync('systemctl is-active nms.service').toString().trim();
    return output === "active" ? "online" : "offline";
  } catch {
    return "offline";
  }
}

function checkBlob() {
  try {
    const output = execSync('df -h | grep blobfuse2').toString().trim();
    return output ? "online" : "offline";
  } catch {
    return "offline";
  }
}

app.get('/status', (req, res) => {
  res.json({
    nms: checkNms(),
    blobdrive: checkBlob()
  });
});

app.listen(PORT, () => {
  console.log(`Status service running at http://0.0.0.0:${PORT}/status`);
});

