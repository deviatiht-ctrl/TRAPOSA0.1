// TRAPOSA Donation Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initCauseSelection();
  initAmountSelection();
  initCurrencySelector();
  initPaymentMethods();
  initDonationForm();
  loadRecentDonations();
  loadCauses();
});

// Load causes from Supabase
async function loadCauses() {
  try {
    const { data: causes, error } = await supabase
      ?.from('traposa_causes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    if (causes && causes.length > 0) {
      renderCauses(causes);
    }
  } catch (error) {
    console.error('Error loading causes:', error);
  }
}

// Render cause cards
function renderCauses(causes) {
  const container = document.querySelector('.causes-grid');
  if (!container) return;

  container.innerHTML = causes.map(cause => `
    <div class="cause-card" data-cause-id="${cause.id}" data-cause-name="${cause.name}">
      <div class="cause-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getCauseIcon(cause.icon)}
        </svg>
      </div>
      <div class="cause-info">
        <h4>${cause.name}</h4>
        <p>${cause.description || ''}</p>
      </div>
      ${cause.goal_amount ? `
        <div class="cause-progress">
          <div class="cause-progress-bar">
            <div class="progress-fill" style="width: ${Math.min((cause.raised_amount || 0) / cause.goal_amount * 100, 100)}%"></div>
          </div>
          <div class="cause-progress-text">${formatCurrency(cause.raised_amount || 0)} / ${formatCurrency(cause.goal_amount)}</div>
        </div>
      ` : ''}
    </div>
  `).join('');

  // Re-initialize selection on new elements
  initCauseSelection();
}

// Get cause icon SVG paths
function getCauseIcon(iconName) {
  const icons = {
    'AlertTriangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
    'BookOpen': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'Sprout': '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7"/><path d="M14.1 6a7 7 0 0 0-5.2 2.4"/>',
    'Heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'default': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/>'
  };
  return icons[iconName] || icons.default;
}

// Format currency
function formatCurrency(amount, currency = 'G') {
  return `${currency}${(amount || 0).toLocaleString()}`;
}

// Cause selection
function initCauseSelection() {
  const causeCards = document.querySelectorAll('.cause-card');
  
  causeCards.forEach(card => {
    card.addEventListener('click', () => {
      causeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateSummary();
    });
  });
}

// Amount selection
function initAmountSelection() {
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customInput = document.querySelector('.amount-custom input');

  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      if (customInput) {
        customInput.value = btn.dataset.amount;
      }
      
      updateSummary();
    });
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      amountButtons.forEach(b => b.classList.remove('selected'));
      updateSummary();
    });
  }
}

// Currency selector
function initCurrencySelector() {
  const currencyButtons = document.querySelectorAll('.currency-btn');
  
  currencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      updateSummary();
    });
  });
}

// Payment method selection
function initPaymentMethods() {
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      
      const radio = method.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
}

// Update donation summary
function updateSummary() {
  const selectedCause = document.querySelector('.cause-card.selected');
  const amount = getSelectedAmount();
  const currency = document.querySelector('.currency-btn.selected')?.dataset.currency || 'HTG';
  
  const summaryCause = document.querySelector('.summary-cause');
  const summaryAmount = document.querySelector('.summary-amount');
  const summaryTotal = document.querySelector('.summary-total .summary-value');
  
  if (summaryCause) {
    summaryCause.textContent = selectedCause?.querySelector('h4')?.textContent || 'Jeneral TRAPOSA';
  }
  
  if (summaryAmount) {
    summaryAmount.textContent = formatAmount(amount, currency);
  }
  
  if (summaryTotal) {
    summaryTotal.textContent = formatAmount(amount, currency);
  }
}

// Get selected amount
function getSelectedAmount() {
  const selectedBtn = document.querySelector('.amount-btn.selected');
  const customInput = document.querySelector('.amount-custom input');
  
  if (selectedBtn) {
    return parseFloat(selectedBtn.dataset.amount) || 0;
  }
  
  if (customInput && customInput.value) {
    return parseFloat(customInput.value) || 0;
  }
  
  return 0;
}

// Format amount with currency
function formatAmount(amount, currency) {
  const symbols = { HTG: 'G', USD: '$', EUR: '€' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString()}`;
}

// Donation form submission
function initDonationForm() {
  const form = document.querySelector('.donation-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    const selectedCause = document.querySelector('.cause-card.selected');
    const selectedPayment = document.querySelector('.payment-method.selected input');
    const amount = getSelectedAmount();
    const currency = document.querySelector('.currency-btn.selected')?.dataset.currency || 'HTG';

    if (!amount || amount <= 0) {
      showError('Tanpri chwazi yon montan / Please select an amount');
      return;
    }

    if (!selectedPayment) {
      showError('Tanpri chwazi yon metòd pèman / Please select a payment method');
      return;
    }

    const donationData = {
      donor_name: formData.get('donor_name') || null,
      donor_email: formData.get('donor_email') || null,
      donor_phone: formData.get('donor_phone') || null,
      amount: amount,
      currency: currency,
      payment_method: selectedPayment.value,
      cause_id: selectedCause?.dataset.causeId || null,
      cause_name: selectedCause?.dataset.causeName || 'Jeneral TRAPOSA',
      message: formData.get('message') || null,
      is_anonymous: formData.get('is_anonymous') === 'on',
      status: 'pending'
    };

    try {
      // Save to Supabase
      const { data, error } = await supabase
        ?.from('traposa_donations')
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;

      // Show success modal
      showSuccessModal(donationData, data?.id);

      // Generate receipt if not anonymous
      if (!donationData.is_anonymous && donationData.donor_email) {
        generateReceipt(donationData, data?.id);
      }

    } catch (error) {
      console.error('Error saving donation:', error);
      showError('Gen yon erè. Tanpri eseye ankò. / There was an error. Please try again.');
    }
  });
}

// Show success modal
function showSuccessModal(donation, donationId) {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.add('active');
  }

  // Could update modal content with donation details
  console.log('Donation saved:', donationId);
}

// Generate PDF receipt (placeholder)
function generateReceipt(donation, donationId) {
  // This would integrate with jsPDF or similar library
  console.log('Generating receipt for donation:', donationId);
  
  // Receipt data structure:
  const receiptData = {
    organization: 'TRAPOSA',
    donationId: donationId,
    date: new Date().toISOString(),
    donor: donation.donor_name || 'Anonymous',
    amount: donation.amount,
    currency: donation.currency,
    cause: donation.cause_name
  };

  // In a real implementation, use jsPDF to generate PDF
  // const { jsPDF } = window.jspdf;
  // const doc = new jsPDF();
  // ... generate receipt
}

// Load recent donations ticker
async function loadRecentDonations() {
  const ticker = document.querySelector('.donation-ticker');
  if (!ticker) return;

  try {
    const { data: donations, error } = await supabase
      ?.from('traposa_donations')
      .select('*')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    const tickerList = ticker.querySelector('.ticker-list') || ticker;
    
    if (donations && donations.length > 0) {
      tickerList.innerHTML = donations.map(d => `
        <div class="ticker-item">
          <span class="ticker-donor">${d.is_anonymous ? 'Yon zanmi' : (d.donor_name || 'Yon zanmi')}</span>
          <span class="ticker-amount">${formatAmount(d.amount, d.currency)}</span>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading donations:', error);
  }
}

// Show error message
function showError(message) {
  const errorEl = document.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 5000);
  }
}
