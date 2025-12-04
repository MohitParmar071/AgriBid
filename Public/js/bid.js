document.addEventListener("DOMContentLoaded", () => {
  const timers = document.querySelectorAll(".countdown-timer");

  function updateTimers() {
    const now = Date.now();

    timers.forEach(timer => {
      const end = timer.getAttribute("data-end");
      const cropId = timer.getAttribute("data-crop");
      if (!end) return;

      const endTime = new Date(end).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        timer.innerText = "Auction Ended";
        finalizeCrop(cropId);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let out = "";
      if (days > 0) out += days + "d ";
      out += hours + "h " + minutes + "m " + seconds + "s";
      timer.innerText = out;
    });
  }

  setInterval(updateTimers, 1000);
  updateTimers();

  async function finalizeCrop(cropId) {
  const msgBox = document.getElementById("final-" + cropId);
  if (msgBox) msgBox.innerHTML = "⏳ Finalizing auction…";

  try {
    const res = await fetch(`/finalize?cropId=${cropId}`);
    const data = await res.json();

    if (msgBox) {
      const found = data.details.find(d => d.cropId === cropId);
      if (found && found.winner) {
        msgBox.innerHTML = `✅ Sold to <strong>${found.winner}</strong> for ₹${found.amount}`;
      } else {
        msgBox.innerHTML = "❌ No valid bids. Crop removed.";
      }
    }

    // Disable bidding form
    const card = document.getElementById("card-" + cropId);
    if (card) {
      const form = card.querySelector(".bid-form");
      if (form) form.remove();
    }
  } catch (err) {
    if (msgBox) msgBox.innerHTML = "⚠ Error finalizing auction.";
    console.error("Finalize error", err);
  }
}
});