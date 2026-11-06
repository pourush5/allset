const { execSync } = require('child_process');
const qrcode = require('qrcode-terminal');

function getHostIPs() {
  try {
    const raw = execSync('ipconfig.exe', { encoding: 'utf8' });
    const lines = raw.split(/\r?\n/);
    const ips = [];
    let currentAdapter = '';

    for (const line of lines) {
      if (line && !line.startsWith(' ') && line.includes('adapter')) {
        currentAdapter = line.trim().replace(':', '');
      }
      const match = line.match(/IPv4 Address[.\s]+:\s+([0-9.]+)/i);
      if (match && match[1]) {
        const ip = match[1].trim();
        // Skip WSL vEthernet and loopback
        if (!currentAdapter.toLowerCase().includes('wsl') && !ip.startsWith('127.') && !ip.startsWith('169.254')) {
          ips.push({ adapter: currentAdapter, ip });
        }
      }
    }
    return ips;
  } catch {
    return [];
  }
}

const list = getHostIPs();

console.log('\n======================================================');
console.log('📱 ALLSET — MOBILE ACCESS URL');
console.log('======================================================\n');

if (list.length === 0) {
  console.log('⚠️  Could not automatically detect host Wi-Fi IP.');
  console.log('👉 Run "ipconfig" in Windows PowerShell to find your IPv4 Address.');
  console.log('👉 Then open: http://<YOUR_IP>:5173\n');
} else {
  // Prefer Wi-Fi or Ethernet
  const primary = list.find(item => item.adapter.toLowerCase().includes('wi-fi')) || list[0];
  const url = `http://${primary.ip}:5173`;

  console.log(`📡 Detected Network: ${primary.adapter}`);
  console.log(`🔗 Mobile URL: ${url}\n`);
  console.log('📷 Scan this QR code with your phone camera to open:\n');

  qrcode.generate(url, { small: true });

  if (list.length > 1) {
    console.log('\nOther available network adapters on your PC:');
    list.filter(item => item !== primary).forEach(({ adapter, ip }) => {
      console.log(` - ${adapter}: http://${ip}:5173`);
    });
  }
}

console.log('\n💡 Tip: In Safari (iOS) or Chrome (Android), tap "Add to Home Screen" to install it as an app!');
console.log('======================================================\n');
