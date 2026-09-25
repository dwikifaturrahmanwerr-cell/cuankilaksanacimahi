/**
 * CUANKI LAKSANA CIMAHI - INTERACTIVE LANDING PAGE SCRIPT
 * Handles real-time order calculation, shipping estimate, dynamic WA links,
 * mobile drawer navigation, cooking timer, FAQ accordion, and smooth micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const PRICE_PER_PACK = 18500;
  const WA_ADMIN_NUMBER = '6289639659518';
  const WA_PARTNER_NUMBER = '6285860696880';

  // Mobile Drawer Navigation
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-order-btn');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Elements - Order Calculator
  const qtyInput = document.getElementById('calcQty');
  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');
  const quickQtyBtns = document.querySelectorAll('.quick-btn');
  const shippingSelect = document.getElementById('shippingDest');
  const noteInput = document.getElementById('orderNote');

  const subtotalDisplay = document.getElementById('calcSubtotal');
  const shippingDisplay = document.getElementById('calcShipping');
  const totalDisplay = document.getElementById('calcTotal');
  const btnOrderWA = document.getElementById('btnOrderWA');

  // Format IDR Currency
  function formatIDR(amount) {
    return 'Rp' + amount.toLocaleString('id-ID');
  }

  // Calculate & Update Order Totals
  function updateOrderCalculation() {
    let qty = parseInt(qtyInput ? qtyInput.value : 1, 10);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
      if (qtyInput) qtyInput.value = 1;
    }

    const subtotal = qty * PRICE_PER_PACK;
    const selectedOption = shippingSelect ? shippingSelect.options[shippingSelect.selectedIndex] : null;
    const shippingRate = selectedOption ? (parseInt(selectedOption.getAttribute('data-rate'), 10) || 0) : 0;
    const isCustomShipping = selectedOption ? (selectedOption.getAttribute('data-custom') === 'true') : false;

    // Update displays
    if (subtotalDisplay) subtotalDisplay.textContent = formatIDR(subtotal);

    let shippingText = '';
    let total = subtotal;

    if (isCustomShipping) {
      shippingText = 'Dihitung Khusus oleh Admin';
      if (shippingDisplay) shippingDisplay.textContent = shippingText;
      if (totalDisplay) totalDisplay.textContent = `${formatIDR(subtotal)} + Ongkir`;
    } else if (shippingRate === 0) {
      shippingText = 'Pilih Wilayah';
      if (shippingDisplay) shippingDisplay.textContent = shippingText;
      if (totalDisplay) totalDisplay.textContent = formatIDR(subtotal);
    } else {
      shippingText = formatIDR(shippingRate);
      total = subtotal + shippingRate;
      if (shippingDisplay) shippingDisplay.textContent = shippingText;
      if (totalDisplay) totalDisplay.textContent = formatIDR(total);
    }

    // Build WhatsApp Order Link
    const destName = selectedOption ? selectedOption.text.trim() : 'Pulau Jawa';
    const userNote = noteInput && noteInput.value.trim() ? noteInput.value.trim() : '-';

    const waMessage = 
`Halo Admin Cuanki Laksana Cimahi, saya ingin memesan:
🍲 *Produk:* Cuanki Instan Premium Laksana (Rp18.500/bks)
📦 *Jumlah:* ${qty} bungkus
💰 *Subtotal:* ${formatIDR(subtotal)}
🚚 *Tujuan Pengiriman:* ${destName}
📍 *Estimasi Ongkir:* ${shippingText}
💳 *Estimasi Total:* ${isCustomShipping ? formatIDR(subtotal) + ' (+ Ongkir Khusus)' : formatIDR(total)}
📝 *Alamat/Catatan:* ${userNote}

Mohon konfirmasi total belanjaan beserta ongkir dan rekening pembayarannya ya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${WA_ADMIN_NUMBER}?text=${encodedMessage}`;

    if (btnOrderWA) {
      btnOrderWA.href = waUrl;
    }
  }

  // Quantity Stepper Events
  if (btnQtyMinus && btnQtyPlus && qtyInput) {
    btnQtyMinus.addEventListener('click', () => {
      let current = parseInt(qtyInput.value, 10) || 1;
      if (current > 1) {
        qtyInput.value = current - 1;
        highlightActiveQuickQty(current - 1);
        updateOrderCalculation();
      }
    });

    btnQtyPlus.addEventListener('click', () => {
      let current = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = current + 1;
      highlightActiveQuickQty(current + 1);
      updateOrderCalculation();
    });

    qtyInput.addEventListener('input', () => {
      let val = parseInt(qtyInput.value, 10);
      highlightActiveQuickQty(val);
      updateOrderCalculation();
    });
  }

  // Quick Qty Selector Buttons
  function highlightActiveQuickQty(val) {
    quickQtyBtns.forEach(btn => {
      const q = parseInt(btn.getAttribute('data-qty'), 10);
      if (q === val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  quickQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const qty = parseInt(btn.getAttribute('data-qty'), 10);
      if (qtyInput) qtyInput.value = qty;
      highlightActiveQuickQty(qty);
      updateOrderCalculation();
    });
  });

  // Shipping dropdown & Note input
  if (shippingSelect) {
    shippingSelect.addEventListener('change', updateOrderCalculation);
  }
  if (noteInput) {
    noteInput.addEventListener('input', updateOrderCalculation);
  }

  // Initial Calculation Run
  updateOrderCalculation();

  // Partnership Button WA Links
  const partnerButtons = document.querySelectorAll('.btn-partner-wa');
  partnerButtons.forEach(btn => {
    const partnerMessage = encodeURIComponent(
      `Halo Admin Kemitraan Cuanki Laksana Cimahi! Saya tertarik untuk bermitra sebagai Agen / Reseller / Dropshipper resmi. Mohon informasi syarat, modal awal, dan margin keuntungannya. Terima kasih!`
    );
    btn.href = `https://wa.me/${WA_PARTNER_NUMBER}?text=${partnerMessage}`;
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Interactive Cooking Timer Simulator (15 mins = 900s)
  const timerDisplay = document.getElementById('timerDisplay');
  const timerBtnStart = document.getElementById('timerBtnStart');
  const timerBtnReset = document.getElementById('timerBtnReset');
  let timerInterval = null;
  let remainingSeconds = 15 * 60; // 15 mins default
  let isRunning = false;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (timerDisplay && timerBtnStart && timerBtnReset) {
    timerBtnStart.addEventListener('click', () => {
      if (isRunning) {
        // Pause
        clearInterval(timerInterval);
        isRunning = false;
        timerBtnStart.textContent = 'Mulai Timer';
      } else {
        // Start
        isRunning = true;
        timerBtnStart.textContent = 'Jeda Timer';
        timerInterval = setInterval(() => {
          if (remainingSeconds > 0) {
            remainingSeconds--;
            timerDisplay.textContent = formatTime(remainingSeconds);
          } else {
            clearInterval(timerInterval);
            isRunning = false;
            timerBtnStart.textContent = 'Selesai!';
            alert('🍲 Cuanki Laksana Anda siap disantap! Kuah kaldu telah meresap sempurna.');
          }
        }, 1000);
      }
    });

    timerBtnReset.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      remainingSeconds = 15 * 60;
      timerDisplay.textContent = '15:00';
      timerBtnStart.textContent = 'Mulai Timer';
    });
  }

  // Real Photo Thumbnail Toggle
  const mainProductImg = document.getElementById('mainProductImg');
  const photoThumbBtns = document.querySelectorAll('.photo-thumb-btn');

  photoThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      photoThumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const src = btn.getAttribute('data-img-src');
      const fallback = btn.getAttribute('data-img-fallback');
      if (mainProductImg) {
        mainProductImg.src = src;
        mainProductImg.onerror = () => {
          mainProductImg.onerror = null;
          mainProductImg.src = fallback;
        };
      }
    });
  });
});

