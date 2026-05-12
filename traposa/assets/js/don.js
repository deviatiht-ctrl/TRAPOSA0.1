// TRAPOSA Donation Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initCauseSelection();
  initAmountSelection();
  initCurrencySelector();
  initDonationForm();
  loadRecentDonations();
  loadCauses();
  loadPaymentMethods();
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

// Load payment methods from Supabase
async function loadPaymentMethods() {
  try {
    const { data, error } = await supabase
      ?.from('traposa_payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      renderPaymentMethods(data);
    } else {
      renderDefaultPaymentMethods();
    }
  } catch (err) {
    console.warn('Payment methods table not found, using defaults:', err.message);
    renderDefaultPaymentMethods();
  }
}

// Fallback static methods if table doesn't exist yet
function renderDefaultPaymentMethods() {
  renderPaymentMethods([
    { id: 'moncash', type: 'moncash', name: 'MonCash',   icon_name: 'smartphone',  is_active: true },
    { id: 'natcash', type: 'natcash', name: 'NatCash',   icon_name: 'wallet',      is_active: true },
    { id: 'stripe',  type: 'stripe',  name: 'Kat Kredi', icon_name: 'credit-card', is_active: true },
  ]);
}

// Render payment method cards dynamically
function renderPaymentMethods(methods) {
  const container = document.querySelector('.payment-methods');
  if (!container) return;

  window._paymentMethods = methods;

  container.innerHTML = methods.map((m, idx) => `
    <label class="payment-method ${idx === 0 ? 'selected' : ''}" data-method-id="${m.id}">
      <input type="radio" name="payment" value="${m.type}" ${idx === 0 ? 'checked' : ''}>
      <div class="payment-icon">
        ${m.logo_url
          ? `<img src="${m.logo_url}" alt="${m.name}" style="width:26px;height:26px;object-fit:contain;" onerror="this.style.display='none'">`
          : `<i data-lucide="${m.icon_name || 'credit-card'}"></i>`
        }
      </div>
      <span class="payment-label">${m.name}</span>
    </label>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Show info for first method right away
  if (methods.length > 0) showPaymentInfo(methods[0]);

  initPaymentMethods();
}

// Re-attach click events after dynamic render
function initPaymentMethods() {
  const paymentMethods = document.querySelectorAll('.payment-method');

  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');

      const radio = method.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const methodId = method.dataset.methodId;
      const methodData = window._paymentMethods?.find(m => m.id === methodId);
      if (methodData) {
        showPaymentInfo(methodData);
      } else if (radio?.value === 'stripe') {
        const cardSection = document.getElementById('stripe-card-section');
        if (cardSection) cardSection.style.display = 'block';
        const infoBox = document.getElementById('payment-info-box');
        if (infoBox) infoBox.style.display = 'none';
      }
    });
  });
}

// Show account details or Stripe card based on selected method
function showPaymentInfo(method) {
  const infoBox  = document.getElementById('payment-info-box');
  const cardSection = document.getElementById('stripe-card-section');

  if (method.type === 'stripe') {
    if (infoBox) infoBox.style.display = 'none';
    if (cardSection) cardSection.style.display = 'block';
    return;
  }

  if (cardSection) cardSection.style.display = 'none';
  if (!infoBox) return;

  const hasDetails = method.account_name || method.account_number || method.instructions;
  if (!hasDetails) {
    infoBox.style.display = 'none';
    return;
  }

  infoBox.style.display = 'flex';
  infoBox.innerHTML = `
    <div class="payment-info-icon">
      ${method.logo_url
        ? `<img src="${method.logo_url}" alt="${method.name}" class="payment-info-logo" onerror="this.style.display='none'">`
        : `<i data-lucide="${method.icon_name || 'credit-card'}"></i>`
      }
    </div>
    <div class="payment-info-details">
      <h4>${method.name}</h4>
      ${method.account_name ? `
        <div class="payment-info-account-row">
          <span class="payment-info-label">Non Kont:</span>
          <span class="payment-info-value">${method.account_name}</span>
        </div>` : ''}
      ${method.account_number ? `
        <div class="payment-info-account-row">
          <span class="payment-info-label">Nimewo:</span>
          <span class="payment-info-value">${method.account_number}</span>
          <button class="payment-copy-btn" onclick="copyToClipboard('${method.account_number}')" title="Kopye">
            <i data-lucide="copy"></i>
          </button>
        </div>` : ''}
      ${method.instructions ? `<p class="payment-info-instructions">${method.instructions}</p>` : ''}
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Copy number to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.payment-copy-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="check"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="copy"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 2000);
    }
  }).catch(() => {});
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
  const submitBtn = document.querySelector('.submit-donation-btn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const selectedCause = document.querySelector('.cause-card.selected');
    const selectedPayment = document.querySelector('.payment-method.selected input');
    const amount = getSelectedAmount();
    const currency = document.querySelector('.currency-btn.selected')?.dataset.currency || 'HTG';
    const donorName = document.querySelector('input[name="donor_name"]')?.value || null;
    const donorEmail = document.querySelector('input[name="donor_email"]')?.value || null;
    const donorPhone = document.querySelector('input[name="donor_phone"]')?.value || null;
    const isAnonymous = document.querySelector('input[name="is_anonymous"]')?.checked || false;

    if (!amount || amount <= 0) {
      showError('Tanpri chwazi yon montan / Please select an amount');
      return;
    }

    if (!selectedPayment) {
      showError('Tanpri chwazi yon metòd pèman / Please select a payment method');
      return;
    }

    const isStripe = window.stripeUtils?.isStripeSelected();
    if (isStripe && !window.stripeUtils?.isReady()) {
      showError('Stripe pa disponib. Tanpri kontakte nou. / Stripe is not available.');
      return;
    }

    const donationData = {
      donor_name: donorName,
      donor_email: donorEmail,
      donor_phone: donorPhone,
      amount: amount,
      currency: currency,
      payment_method: selectedPayment.value,
      cause_id: selectedCause?.dataset.causeId || null,
      cause_name: selectedCause?.dataset.causeName || 'Jeneral TRAPOSA',
      is_anonymous: isAnonymous,
      status: 'pending'
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="opacity:0.7;">Trete pèman...</span>';

    try {
      if (isStripe) {
        // Charge the card via Edge Function + confirmCardPayment
        const paymentIntent = await window.stripeUtils.confirmPayment({
          amount,
          currency,
          donorEmail,
          donorName,
          causeName: donationData.cause_name,
        });
        donationData.stripe_payment_intent_id = paymentIntent.id;
        donationData.status = 'confirmed';
      }

      // Save to Supabase
      const { data, error } = await supabase
        ?.from('traposa_donations')
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;

      showSuccessModal(donationData, data?.id);

      if (!donationData.is_anonymous && donationData.donor_email) {
        generateReceipt(donationData, data?.id);
      }

    } catch (err) {
      console.error('Error processing donation:', err);
      showError(err.message || 'Gen yon erè. Tanpri eseye ankò. / There was an error. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="lock" style="width: 18px; height: 18px;"></i><span data-i18n="don_submit">Kontribye Kounye a</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
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
