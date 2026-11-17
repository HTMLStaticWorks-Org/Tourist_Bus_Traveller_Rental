// Customer Portal Dashboard Logic for Horizon Coach - Tourist Bus & Traveller Rental

let overviewChart;
let fullProgressChart;

document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme and RTL direction
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const isRtl = localStorage.getItem('rtl') === 'true';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

  // Init charts
  initOverviewChart();
  initProgressChart();

  // Saved / Fleet Directory filtering
  const seatFilter = document.getElementById('routeWallFilter');
  const acFilter = document.getElementById('routeGradeFilter');
  if (seatFilter && acFilter) {
    [seatFilter, acFilter].forEach(el => {
      el.addEventListener('change', filterVehicles);
    });
  }

  // Booking History Search & Status Filtering
  const logSearch = document.getElementById('logSearch');
  const logStatusFilter = document.getElementById('logGradeFilter');
  if (logSearch && logStatusFilter) {
    logSearch.addEventListener('input', filterBookings);
    logStatusFilter.addEventListener('change', filterBookings);
  }

  // Load saved profile data from localStorage (Demo)
  loadDemoProfile();
});

// Panel Switcher
function showSection(sectionId) {
  document.querySelectorAll('.dashboard-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetPanel = document.getElementById('panel-' + sectionId);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }

  const targetBtn = document.getElementById('nav-' + sectionId);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  const targetMobileBtn = document.getElementById('mobile-nav-' + sectionId);
  if (targetMobileBtn) {
    targetMobileBtn.classList.add('active');
  }
}

// Chart.js Inits
function initOverviewChart() {
  const ctx = document.getElementById('overviewChart');
  if (!ctx) return;

  overviewChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      datasets: [{
        label: 'Distance Travelled (km)',
        data: [420, 680, 510, 940, 1120, 860],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.2)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#94A3B8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94A3B8' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function initProgressChart() {
  const ctx = document.getElementById('fullProgressChart');
  if (!ctx) return;

  fullProgressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      datasets: [{
        label: 'Completed Group Trips',
        data: [1, 2, 1, 3, 2, 3],
        backgroundColor: '#D4AF37',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 5,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#94A3B8', stepSize: 1 }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94A3B8' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Quick Booking Modal Handlers
let bookingModal;
function openLogModal() {
  const modalEl = document.getElementById('logClimbModal');
  if (!modalEl) return;
  if (!bookingModal) {
    bookingModal = new bootstrap.Modal(modalEl);
  }
  bookingModal.show();
}

function triggerQuickLog() {
  openLogModal();
}

function submitBookingRequest(event) {
  event.preventDefault();

  const vehicleSelect = document.getElementById('logRouteName');
  const tripTypeSelect = document.getElementById('logRouteGrade');
  const passengersInput = document.getElementById('logRouteAttempts');
  const pickupInput = document.getElementById('bookingPickup');
  const destInput = document.getElementById('bookingDestination');
  const travelDateInput = document.getElementById('bookingTravelDate');
  const returnDateInput = document.getElementById('bookingReturnDate');

  if (!vehicleSelect || !vehicleSelect.value) return;

  const bookingId = 'HC-' + Math.floor(1000 + Math.random() * 9000);
  const travelDate = travelDateInput && travelDateInput.value ? travelDateInput.value : new Date().toISOString().split('T')[0];
  const returnDate = returnDateInput && returnDateInput.value ? returnDateInput.value : travelDate;
  const pickup = pickupInput && pickupInput.value ? pickupInput.value : 'City Central Terminal';
  const destination = destInput && destInput.value ? destInput.value : 'Outstation Tour';

  const tbody = document.querySelector('#climbLogTable tbody');
  if (tbody) {
    const rowHtml = `
      <tr>
        <td class="py-3 px-4 font-mono text-xs text-[#D4AF37]">${bookingId}</td>
        <td class="py-3 px-4 font-medium">${vehicleSelect.value}</td>
        <td class="py-3 px-4 text-xs text-gray-400">${pickup} → ${destination}</td>
        <td class="py-3 px-4 text-xs text-gray-400">${travelDate} to ${returnDate}</td>
        <td class="py-3 px-4"><span class="px-2 py-0.5 rounded bg-[#0D9488]/20 text-[#2DD4BF] text-xs">Requested (Demo)</span></td>
        <td class="py-3 px-4 text-right font-semibold text-[#D4AF37]">Quote Pending</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('afterbegin', rowHtml);
  }

  if (bookingModal) bookingModal.hide();

  const feedback = document.getElementById('bookingRequestFeedback');
  if (feedback) {
    feedback.textContent = `Demo booking request ${bookingId} submitted for ${vehicleSelect.value} (${passengersInput ? passengersInput.value : '12'} passengers). Our dispatch team will confirm your custom quote.`;
    feedback.classList.remove('hidden');
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Keep alias for any legacy handler
function submitClimbLog(event) {
  submitBookingRequest(event);
}

// Filter Saved Vehicles
function filterVehicles() {
  const seatCat = document.getElementById('routeWallFilter').value;
  const acType = document.getElementById('routeGradeFilter').value;
  const cards = document.querySelectorAll('#routesGrid > div');

  cards.forEach(card => {
    const cardSeat = card.getAttribute('data-wall');
    const cardAc = card.getAttribute('data-grade');

    const seatMatch = (seatCat === 'all' || cardSeat === seatCat);
    const acMatch = (acType === 'all' || cardAc === acType);

    if (seatMatch && acMatch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Search and Filter Booking History
function filterBookings() {
  const query = document.getElementById('logSearch').value.toLowerCase();
  const statusFilter = document.getElementById('logGradeFilter').value;
  const rows = document.querySelectorAll('#climbLogTable tbody tr');

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    const statusText = row.children[4] ? row.children[4].innerText.trim() : '';

    const searchMatch = rowText.includes(query);
    const statusMatch = (statusFilter === 'all' || statusText.includes(statusFilter));

    if (searchMatch && statusMatch) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Demo Profile Persistence
function loadDemoProfile() {
  const saved = localStorage.getItem('horizonCoachDemoProfile');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    const nameEl = document.getElementById('profileFullName');
    const emailEl = document.getElementById('profileEmail');
    const phoneEl = document.getElementById('profilePhone');
    const addressEl = document.getElementById('profileAddress');
    if (nameEl && data.name) nameEl.value = data.name;
    if (emailEl && data.email) emailEl.value = data.email;
    if (phoneEl && data.phone) phoneEl.value = data.phone;
    if (addressEl && data.address) addressEl.value = data.address;
  } catch (e) {
    // ignore invalid localStorage data
  }
}

function saveDemoProfile(event) {
  event.preventDefault();
  const data = {
    name: document.getElementById('profileFullName')?.value || '',
    email: document.getElementById('profileEmail')?.value || '',
    phone: document.getElementById('profilePhone')?.value || '',
    address: document.getElementById('profileAddress')?.value || ''
  };
  localStorage.setItem('horizonCoachDemoProfile', JSON.stringify(data));
  const msg = document.getElementById('profileSaveMsg');
  if (msg) {
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3500);
  }
}

function downloadDemoInvoice(txId) {
  alert(`Demo Invoice Preview (${txId}):\nThis is a frontend demo invoice for Horizon Coach Tourist Bus & Traveller Rental. No real payment was processed.`);
}
