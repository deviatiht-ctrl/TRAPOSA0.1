// TRAPOSA Admin — Jere Metòd Pèman (Payment Methods)

let allMethods = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadMethods();
  initModal();
  initLogoPreview();
});

async function loadMethods() {
  const tbody = document.getElementById('methodsTable');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#9ca3af;">Chajman...</td></tr>`;

  try {
    const { data, error } = await window.supabaseClient
      .from('traposa_payment_methods')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    allMethods = data || [];
    renderTable(allMethods);
  } catch (err) {
    console.error('Error loading payment methods:', err);
    showToast('Erè chajman: ' + err.message, 'error');
  }
}

function renderTable(methods) {
  const tbody = document.getElementById('methodsTable');
  if (!tbody) return;

  if (methods.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#9ca3af;">Okenn metòd pèman. Klike "Ajoute" pou kreye premye a.</td></tr>`;
    return;
  }

  tbody.innerHTML = methods.map(m => `
    <tr data-id="${m.id}">
      <td>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div class="method-icon-preview">
            ${m.logo_url
              ? `<img src="${m.logo_url}" alt="${m.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'"><span style="display:none"><i data-lucide="${m.icon_name || 'credit-card'}"></i></span>`
              : `<i data-lucide="${m.icon_name || 'credit-card'}"></i>`
            }
          </div>
          <div>
            <strong>${m.name}</strong>
            <div style="font-size:0.75rem;color:#9ca3af;">${m.type}</div>
          </div>
        </div>
      </td>
      <td>${m.account_name || '<span style="color:#9ca3af;">—</span>'}</td>
      <td>
        ${m.account_number
          ? `<code class="account-number-cell">${m.account_number}</code>`
          : '<span style="color:#9ca3af;">—</span>'
        }
      </td>
      <td style="max-width:200px;font-size:0.8rem;color:#6b7280;">
        ${m.instructions ? m.instructions.slice(0, 60) + (m.instructions.length > 60 ? '…' : '') : '<span style="color:#9ca3af;">—</span>'}
      </td>
      <td>
        <label class="toggle-input" title="${m.is_active ? 'Aktif' : 'Inaktif'}">
          <input type="checkbox" ${m.is_active ? 'checked' : ''} onchange="toggleActive('${m.id}', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td class="table-actions">
        <button class="table-btn" onclick="openEditModal('${m.id}')" title="Modifye">
          <i data-lucide="edit"></i>
        </button>
        <button class="table-btn delete" onclick="deleteMethod('${m.id}')" title="Efase">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initModal() {
  const modal = document.getElementById('paymentModal');
  const closeBtn = modal?.querySelector('.modal-close');
  const form = document.getElementById('paymentForm');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveMethod();
    });
  }
}

function initLogoPreview() {
  const logoInput = document.getElementById('pmLogoUrl');
  const preview = document.getElementById('logoPreview');
  if (!logoInput || !preview) return;

  logoInput.addEventListener('input', () => {
    const url = logoInput.value.trim();
    if (url) {
      preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span style=color:#ef4444;font-size:0.8rem;>URL invalid</span>'">`;
    } else {
      preview.innerHTML = '';
    }
  });
}

function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Ajoute Metòd Pèman';
  document.getElementById('paymentForm').reset();
  document.getElementById('logoPreview').innerHTML = '';
  document.getElementById('paymentModal').style.display = 'flex';
}

function openEditModal(id) {
  const m = allMethods.find(x => x.id === id);
  if (!m) return;

  editingId = id;
  document.getElementById('modalTitle').textContent = 'Modifye Metòd Pèman';

  document.getElementById('pmName').value          = m.name          || '';
  document.getElementById('pmType').value          = m.type          || 'other';
  document.getElementById('pmAccountName').value   = m.account_name  || '';
  document.getElementById('pmAccountNumber').value = m.account_number || '';
  document.getElementById('pmInstructions').value  = m.instructions  || '';
  document.getElementById('pmLogoUrl').value       = m.logo_url      || '';
  document.getElementById('pmIconName').value      = m.icon_name     || 'credit-card';
  document.getElementById('pmDisplayOrder').value  = m.display_order ?? 0;
  document.getElementById('pmIsActive').checked    = m.is_active !== false;

  const preview = document.getElementById('logoPreview');
  if (m.logo_url) {
    preview.innerHTML = `<img src="${m.logo_url}" alt="Preview">`;
  } else {
    preview.innerHTML = '';
  }

  document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('paymentModal').style.display = 'none';
  editingId = null;
}

async function saveMethod() {
  const saveBtn = document.querySelector('#paymentForm .btn-primary');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Sove...'; }

  const payload = {
    name:           document.getElementById('pmName').value.trim(),
    type:           document.getElementById('pmType').value,
    account_name:   document.getElementById('pmAccountName').value.trim() || null,
    account_number: document.getElementById('pmAccountNumber').value.trim() || null,
    instructions:   document.getElementById('pmInstructions').value.trim() || null,
    logo_url:       document.getElementById('pmLogoUrl').value.trim() || null,
    icon_name:      document.getElementById('pmIconName').value.trim() || 'credit-card',
    display_order:  parseInt(document.getElementById('pmDisplayOrder').value) || 0,
    is_active:      document.getElementById('pmIsActive').checked,
    updated_at:     new Date().toISOString(),
  };

  try {
    let error;
    if (editingId) {
      ({ error } = await window.supabaseClient
        .from('traposa_payment_methods')
        .update(payload)
        .eq('id', editingId));
    } else {
      ({ error } = await window.supabaseClient
        .from('traposa_payment_methods')
        .insert([payload]));
    }

    if (error) throw error;

    closeModal();
    await loadMethods();
    showToast(editingId ? 'Metòd pèman modifye!' : 'Metòd pèman ajoute!', 'success');
  } catch (err) {
    console.error('Error saving method:', err);
    showToast('Erè: ' + err.message, 'error');
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Sove'; }
  }
}

async function toggleActive(id, isActive) {
  try {
    const { error } = await window.supabaseClient
      .from('traposa_payment_methods')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    const m = allMethods.find(x => x.id === id);
    if (m) m.is_active = isActive;
    showToast(isActive ? 'Metòd aktive' : 'Metòd dezaktive', 'success');
  } catch (err) {
    showToast('Erè: ' + err.message, 'error');
  }
}

async function deleteMethod(id) {
  const m = allMethods.find(x => x.id === id);
  if (!confirm(`Efase "${m?.name || 'metòd sa a'}"? Aksyon sa a pa ka defèt.`)) return;

  try {
    const { error } = await window.supabaseClient
      .from('traposa_payment_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadMethods();
    showToast('Metòd pèman efase!', 'success');
  } catch (err) {
    showToast('Erè: ' + err.message, 'error');
  }
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1.2rem;line-height:1;">×</button>`;

  Object.assign(toast.style, {
    position: 'fixed', bottom: '100px', right: '20px',
    padding: '12px 24px', borderRadius: '8px',
    color: type === 'error' ? '#DC2626' : '#16A34A',
    background: type === 'error' ? '#FEE2E2' : '#F0FDF4',
    border: `1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'}`,
    zIndex: '9999', display: 'flex', alignItems: 'center',
    gap: '12px', fontSize: '14px', fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  });

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
