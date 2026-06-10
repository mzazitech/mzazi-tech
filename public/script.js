/* ============================================================
   MZAZI TECH ENTERPRISE — Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   THEME MANAGEMENT
   ============================================================ */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('mzazi_theme') || 'light';
    this.apply(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mzazi_theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
    Notifications.show('Theme switched!', 'info');
  }
};

/* ============================================================
   NAVBAR
   ============================================================ */
const Navbar = {
  init() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });
    }
    // Active link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }
};

/* ============================================================
   LOADING SCREEN
   ============================================================ */
const Loading = {
  init() {
    const overlay = document.querySelector('.loading-overlay');
    if (!overlay) return;
    setTimeout(() => overlay.classList.add('hidden'), 1600);
    setTimeout(() => overlay.remove(), 2100);
  }
};

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
const Notifications = {
  container: null,
  init() {
    this.container = document.querySelector('.notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 4000) {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const n = document.createElement('div');
    n.className = `notification notif-${type}`;
    n.innerHTML = `
      <i class="fas ${icons[type] || icons.info} notif-icon"></i>
      <span class="notif-text">${message}</span>
      <i class="fas fa-times notif-close" onclick="this.parentElement.classList.add('out'); setTimeout(()=>this.parentElement.remove(),300)"></i>
    `;
    if (!this.container) this.init();
    this.container.appendChild(n);
    setTimeout(() => {
      n.classList.add('out');
      setTimeout(() => n.remove(), 300);
    }, duration);
  }
};

/* ============================================================
   HERO LOAN CALCULATOR
   ============================================================ */
const HeroCalc = {
  init() {
    const amountSlider = document.getElementById('heroAmount');
    const durationSlider = document.getElementById('heroDuration');
    if (!amountSlider) return;
    amountSlider.addEventListener('input', () => this.calculate());
    durationSlider.addEventListener('input', () => this.calculate());
    this.calculate();
  },
  calculate() {
    const amount = parseFloat(document.getElementById('heroAmount').value) || 0;
    const duration = parseFloat(document.getElementById('heroDuration').value) || 1;
    const currency = document.getElementById('heroCurrency') ? document.getElementById('heroCurrency').value : 'KES';
    const monthlyRate = 15 / 100;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    const totalRepayment = monthlyPayment * duration;
    const totalInterest = totalRepayment - amount;
    const sym = currency === 'KES' ? 'KES' : 'USD';
    const fmt = (n) => sym + ' ' + Math.round(n).toLocaleString();
    const el = (id) => document.getElementById(id);
    if (el('heroAmountValue')) el('heroAmountValue').textContent = fmt(amount);
    if (el('heroDurationValue')) el('heroDurationValue').textContent = duration + ' months';
    if (el('heroMonthly')) el('heroMonthly').textContent = fmt(monthlyPayment);
    if (el('heroInterest')) el('heroInterest').textContent = fmt(totalInterest);
    if (el('heroTotal')) el('heroTotal').textContent = fmt(totalRepayment);
  }
};

/* ============================================================
   EMI CALCULATOR
   ============================================================ */
const EMICalc = {
  init() {
    const form = document.getElementById('emiForm');
    if (!form) return;
    form.addEventListener('submit', (e) => { e.preventDefault(); this.calculate(); });
    ['emiAmount','emiRate','emiDuration','emiCurrency'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.calculate());
    });
    this.calculate();
  },
  calculate() {
    const amount = parseFloat(document.getElementById('emiAmount')?.value) || 50000;
    const annualRate = parseFloat(document.getElementById('emiRate')?.value) || 15;
    const duration = parseInt(document.getElementById('emiDuration')?.value) || 12;
    const currency = document.getElementById('emiCurrency')?.value || 'KES';
    const monthlyRate = annualRate / 100 / 12;
    let emi;
    if (monthlyRate === 0) {
      emi = amount / duration;
    } else {
      emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    }
    const totalAmount = emi * duration;
    const totalInterest = totalAmount - amount;
    const sym = currency === 'KES' ? 'KES' : 'USD';
    const fmt = (n) => sym + ' ' + Math.round(n).toLocaleString();
    const el = (id) => document.getElementById(id);
    if (el('emiResult')) el('emiResult').textContent = fmt(emi);
    if (el('emiTotalInterest')) el('emiTotalInterest').textContent = fmt(totalInterest);
    if (el('emiTotalAmount')) el('emiTotalAmount').textContent = fmt(totalAmount);
  }
};

/* ============================================================
   LOAN ELIGIBILITY CHECKER
   ============================================================ */
const EligibilityChecker = {
  init() {
    const form = document.getElementById('eligibilityForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.check();
    });
  },
  check() {
    const income = parseFloat(document.getElementById('eligIncome')?.value) || 0;
    const employment = document.getElementById('eligEmployment')?.value || '';
    const loanAmount = parseFloat(document.getElementById('eligLoanAmount')?.value) || 0;
    const age = parseInt(document.getElementById('eligAge')?.value) || 0;
    const result = document.getElementById('eligResult');
    if (!result) return;
    const maxLoan = income * 4;
    const eligible = income >= 10000 && age >= 18 && age <= 70 && employment !== '' && loanAmount <= maxLoan && loanAmount > 0;
    result.style.display = 'block';
    if (eligible) {
      result.className = 'eligibility-result eligible';
      result.innerHTML = `<i class="fas fa-check-circle"></i> Congratulations! You are eligible for a loan up to <strong>KES ${Math.round(maxLoan).toLocaleString()}</strong>. <a href="loan.html" class="btn btn-primary btn-sm" style="margin-left:12px">Apply Now</a>`;
    } else {
      result.className = 'eligibility-result not-eligible';
      result.innerHTML = `<i class="fas fa-times-circle"></i> Unfortunately, you do not meet the current eligibility criteria. <a href="contact.html" style="color:inherit;text-decoration:underline">Contact us</a> for assistance.`;
    }
    Notifications.show(eligible ? 'Eligibility check complete — you qualify!' : 'Eligibility check complete.', eligible ? 'success' : 'warning');
  }
};

/* ============================================================
   STATISTICS COUNTER
   ============================================================ */
const StatsCounter = {
  init() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    nums.forEach(n => observer.observe(n));
  },
  animate(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

/* ============================================================
   FAQ
   ============================================================ */
const FAQ = {
  init() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
          if (!isOpen) item.classList.add('open');
        });
      }
    });
    const search = document.getElementById('faqSearch');
    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }
  }
};

/* ============================================================
   LOGIN FORM
   ============================================================ */
const LoginForm = {
  init() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    const toggle = document.getElementById('togglePassword');
    const pwd = document.getElementById('loginPassword');
    if (toggle && pwd) {
      toggle.addEventListener('click', () => {
        const isText = pwd.type === 'text';
        pwd.type = isText ? 'password' : 'text';
        toggle.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
      });
    }
  },
  handleLogin() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    let valid = true;
    if (!email || !this.isValidEmail(email)) {
      this.showError('emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      this.clearError('emailError');
    }
    if (!password || password.length < 6) {
      this.showError('passwordError', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      this.clearError('passwordError');
    }
    if (!valid) return;
    const btn = document.getElementById('loginBtn');
    if (btn) { btn.classList.add('btn-loading'); btn.textContent = 'Signing in...'; }
    // Simulate login
    setTimeout(() => {
      const userData = { email, name: email.split('@')[0], loginTime: new Date().toISOString() };
      sessionStorage.setItem('mzazi_user', JSON.stringify(userData));
      Notifications.show('Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    }, 1800);
  },
  isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
  showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  },
  clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }
};

/* ============================================================
   LOAN APPLICATION FORM
   ============================================================ */
const LoanForm = {
  init() {
    const form = document.getElementById('loanForm');
    if (!form) return;
    // Live summary update
    ['loanAmount','loanCurrency','loanDuration','loanPurpose','loanFullName'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.updateSummary());
    });
    this.updateSummary();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    // File upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('idUpload');
    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', () => fileInput.click());
      uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
      uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
      uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        if (e.dataTransfer.files[0]) {
          fileInput.files = e.dataTransfer.files;
          document.getElementById('uploadText').textContent = '✓ ' + e.dataTransfer.files[0].name;
        }
      });
      fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) {
          document.getElementById('uploadText').textContent = '✓ ' + fileInput.files[0].name;
        }
      });
    }
  },
  updateSummary() {
    const amount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
    const currency = document.getElementById('loanCurrency')?.value || 'KES';
    const duration = parseInt(document.getElementById('loanDuration')?.value) || 0;
    const purpose = document.getElementById('loanPurpose')?.value || '-';
    const name = document.getElementById('loanFullName')?.value || '-';
    const monthlyRate = 15 / 100;
    const emi = duration > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1)
      : 0;
    const total = emi * duration;
    const sym = currency === 'KES' ? 'KES' : 'USD';
    const fmt = (n) => sym + ' ' + Math.round(n).toLocaleString();
    const el = id => document.getElementById(id);
    if (el('sumName')) el('sumName').textContent = name;
    if (el('sumAmount')) el('sumAmount').textContent = fmt(amount);
    if (el('sumDuration')) el('sumDuration').textContent = duration + ' months';
    if (el('sumPurpose')) el('sumPurpose').textContent = purpose;
    if (el('sumMonthly')) el('sumMonthly').textContent = fmt(emi);
    if (el('sumTotal')) el('sumTotal').textContent = fmt(total);
  },
  validate() {
    const required = ['loanFullName','loanEmail','loanPhone','loanCountry','loanNationalId','loanEmployment','loanIncome','loanAmount','loanCurrency','loanDuration','loanPurpose'];
    let valid = true;
    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        if (el) el.classList.add('error');
        valid = false;
      } else {
        if (el) el.classList.remove('error');
      }
    });
    const terms = document.getElementById('termsCheck');
    if (!terms || !terms.checked) {
      Notifications.show('Please accept the Terms and Conditions.', 'error');
      valid = false;
    }
    return valid;
  },
  handleSubmit() {
    if (!this.validate()) {
      Notifications.show('Please fill all required fields.', 'error');
      return;
    }
    const data = {
      fullName: document.getElementById('loanFullName')?.value,
      email: document.getElementById('loanEmail')?.value,
      phone: document.getElementById('loanPhone')?.value,
      country: document.getElementById('loanCountry')?.value,
      nationalId: document.getElementById('loanNationalId')?.value,
      employment: document.getElementById('loanEmployment')?.value,
      income: document.getElementById('loanIncome')?.value,
      amount: document.getElementById('loanAmount')?.value,
      currency: document.getElementById('loanCurrency')?.value,
      duration: document.getElementById('loanDuration')?.value,
      purpose: document.getElementById('loanPurpose')?.value,
    };
    const message = `*MZAZI TECH ENTERPRISE - Loan Application*\n\n` +
      `*Full Name:* ${data.fullName}\n` +
      `*Email:* ${data.email}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Country:* ${data.country}\n` +
      `*National ID/Passport:* ${data.nationalId}\n` +
      `*Employment Status:* ${data.employment}\n` +
      `*Monthly Income:* ${data.income}\n` +
      `*Loan Amount:* ${data.amount} ${data.currency}\n` +
      `*Loan Duration:* ${data.duration} months\n` +
      `*Loan Purpose:* ${data.purpose}\n\n` +
      `_Submitted via MZAZI TECH ENTERPRISE Online Portal_`;
    const btn = document.getElementById('submitLoanBtn');
    if (btn) { btn.classList.add('btn-loading'); btn.textContent = 'Submitting...'; }
    setTimeout(() => {
      Notifications.show('Application submitted! Redirecting to WhatsApp...', 'success');
      const waUrl = `https://wa.me/254741388986?text=${encodeURIComponent(message)}`;
      setTimeout(() => { window.location.href = waUrl; }, 1000);
    }, 1500);
  }
};

/* ============================================================
   PAYSTACK INTEGRATION
   ============================================================ */
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';

const PaystackIntegration = {
  init() {
    const form = document.getElementById('paymentForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.initializePayment();
    });
    // Update amount display live
    const amountEl = document.getElementById('payAmount');
    if (amountEl) amountEl.addEventListener('input', () => this.updatePaymentSummary());
    this.updatePaymentSummary();
  },
  updatePaymentSummary() {
    const amount = parseFloat(document.getElementById('payAmount')?.value) || 0;
    const currency = document.getElementById('payCurrency')?.value || 'KES';
    const loanId = document.getElementById('payLoanId')?.value || '-';
    const sym = currency === 'KES' ? 'KES' : 'USD';
    const fmt = (n) => sym + ' ' + Math.round(n).toLocaleString();
    const fee = amount * 0.015;
    const total = amount + fee;
    const el = id => document.getElementById(id);
    if (el('sumPayAmount')) el('sumPayAmount').textContent = fmt(amount);
    if (el('sumPayFee')) el('sumPayFee').textContent = fmt(fee);
    if (el('sumPayTotal')) el('sumPayTotal').textContent = fmt(total);
    if (el('sumPayLoanId')) el('sumPayLoanId').textContent = loanId;
  },
  initializePayment() {
    const email = document.getElementById('payEmail')?.value.trim();
    const amount = parseFloat(document.getElementById('payAmount')?.value) || 0;
    const currency = document.getElementById('payCurrency')?.value || 'KES';
    const loanId = document.getElementById('payLoanId')?.value || '';
    if (!email || !amount || !loanId) {
      Notifications.show('Please fill all payment fields.', 'error');
      return;
    }
    if (amount <= 0) { Notifications.show('Please enter a valid amount.', 'error'); return; }
    const btn = document.getElementById('payBtn');
    if (btn) { btn.classList.add('btn-loading'); btn.textContent = 'Initializing...'; }
    // Check if Paystack is loaded
    if (typeof PaystackPop === 'undefined') {
      Notifications.show('Paystack is loading. Ensure your public key is set.', 'warning');
      if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Pay Now'; }
      // Simulate for demo
      setTimeout(() => this.simulatePayment(email, amount, currency, loanId), 1000);
      return;
    }
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: currency === 'KES' ? amount * 100 : amount * 100,
      currency,
      ref: 'MTE-' + loanId + '-' + Date.now(),
      metadata: { loan_id: loanId, custom_fields: [{ display_name: 'Loan ID', variable_name: 'loan_id', value: loanId }] },
      callback: (response) => this.paymentCallback(response),
      onClose: () => {
        Notifications.show('Payment window closed.', 'info');
        if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Pay Now'; }
      }
    });
    handler.openIframe();
  },
  paymentCallback(response) {
    this.verifyPayment(response.reference);
  },
  verifyPayment(reference) {
    Notifications.show('Verifying payment...', 'info');
    // In production: call your backend to verify with Paystack API
    // Simulating verification:
    setTimeout(() => {
      if (reference) {
        this.onPaymentSuccess(reference);
      } else {
        this.onPaymentFailed();
      }
    }, 1500);
  },
  simulatePayment(email, amount, currency, loanId) {
    const btn = document.getElementById('payBtn');
    if (btn) { btn.textContent = 'Processing...'; }
    setTimeout(() => {
      if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Pay Now'; }
      // 90% success for demo
      if (Math.random() > 0.1) {
        this.onPaymentSuccess('MTE-' + loanId + '-' + Date.now());
      } else {
        this.onPaymentFailed();
      }
    }, 2500);
  },
  onPaymentSuccess(reference) {
    const modal = document.getElementById('successModal');
    if (modal) {
      document.getElementById('successRef').textContent = reference;
      modal.classList.add('open');
    }
    this.addToHistory(reference, 'Success');
    Notifications.show('Payment successful!', 'success');
    const btn = document.getElementById('payBtn');
    if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Pay Now'; }
  },
  onPaymentFailed() {
    const modal = document.getElementById('failedModal');
    if (modal) modal.classList.add('open');
    Notifications.show('Payment failed. Please try again.', 'error');
    const btn = document.getElementById('payBtn');
    if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Pay Now'; }
  },
  addToHistory(ref, status) {
    const tbody = document.getElementById('paymentHistoryBody');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ref}</td>
      <td>${document.getElementById('payLoanId')?.value || '-'}</td>
      <td>${document.getElementById('payAmount')?.value || '-'} ${document.getElementById('payCurrency')?.value || 'KES'}</td>
      <td>${new Date().toLocaleDateString()}</td>
      <td><span class="status-badge status-active">${status}</span></td>
    `;
    tbody.prepend(row);
  }
};

/* ============================================================
   CONTACT FORM
   ============================================================ */
const ContactForm = {
  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },
  handleSubmit() {
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();
    if (!name || !email || !message) {
      Notifications.show('Please fill all required fields.', 'error');
      return;
    }
    const btn = document.getElementById('contactBtn');
    if (btn) { btn.classList.add('btn-loading'); btn.textContent = 'Sending...'; }
    setTimeout(() => {
      if (btn) { btn.classList.remove('btn-loading'); btn.textContent = 'Send Message'; }
      Notifications.show('Message sent successfully! We\'ll respond within 24 hours.', 'success');
      document.getElementById('contactForm').reset();
    }, 2000);
  }
};

/* ============================================================
   LIVE CHAT WIDGET
   ============================================================ */
const LiveChat = {
  init() {
    const btn = document.querySelector('.chat-bubble-btn');
    const panel = document.querySelector('.chat-panel');
    const closeBtn = document.querySelector('.chat-close');
    const sendBtn = document.querySelector('.chat-send-btn');
    const input = document.querySelector('.chat-input-row input');
    if (!btn) return;
    btn.addEventListener('click', () => panel?.classList.toggle('open'));
    closeBtn?.addEventListener('click', () => panel?.classList.remove('open'));
    const sendMessage = () => {
      const msg = input?.value.trim();
      if (!msg) return;
      const messages = document.querySelector('.chat-messages');
      if (messages) {
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = msg;
        messages.appendChild(userMsg);
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
        // Simulated agent reply
        setTimeout(() => {
          const agentMsg = document.createElement('div');
          agentMsg.className = 'chat-msg agent';
          agentMsg.textContent = LiveChat.getAutoReply(msg);
          messages.appendChild(agentMsg);
          messages.scrollTop = messages.scrollHeight;
        }, 1200);
      }
    };
    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
  },
  getAutoReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('loan') || m.includes('apply')) return 'You can apply for a loan on our Loan Application page. Our team reviews all applications within 24 hours.';
    if (m.includes('rate') || m.includes('interest')) return 'Our rates are: 15% monthly, 35% quarterly, and 75% annually. These are competitive rates for fast approval.';
    if (m.includes('repay') || m.includes('payment')) return 'You can make repayments via our Payment page. We accept M-Pesa, cards, and bank transfers via Paystack.';
    if (m.includes('contact') || m.includes('call') || m.includes('phone')) return 'You can reach us via WhatsApp: +254 741 388 986 or email: support@mzazitech.com';
    return 'Thank you for reaching out to MZAZI TECH ENTERPRISE! An agent will be with you shortly. For urgent matters, please WhatsApp us at +254 741 388 986.';
  }
};

/* ============================================================
   MODALS — TERMS & PRIVACY
   ============================================================ */
const Modals = {
  init() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay')?.classList.remove('open');
      });
    });
  }
};

/* ============================================================
   CURRENCY SWITCHER
   ============================================================ */
const CurrencySwitcher = {
  current: 'KES',
  init() {
    document.querySelectorAll('.currency-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        this.current = btn.dataset.currency;
        document.querySelectorAll('.currency-switch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateDisplays();
        Notifications.show(`Currency switched to ${this.current}`, 'info');
      });
    });
  },
  updateDisplays() {
    document.querySelectorAll('[data-currency-display]').forEach(el => {
      el.textContent = this.current;
    });
  }
};

/* ============================================================
   DOWNLOAD STATEMENT
   ============================================================ */
const StatementDownload = {
  init() {
    document.querySelectorAll('.statement-btn').forEach(btn => {
      btn.addEventListener('click', () => this.download());
    });
  },
  download() {
    Notifications.show('Generating your loan statement...', 'info');
    const user = JSON.parse(sessionStorage.getItem('mzazi_user') || '{}');
    const content = `MZAZI TECH ENTERPRISE - LOAN STATEMENT\n${'='.repeat(50)}\n\nGenerated: ${new Date().toLocaleString()}\nAccount: ${user.email || 'N/A'}\n\n${'─'.repeat(50)}\nLOAN SUMMARY\n${'─'.repeat(50)}\n\nLoan ID: MTE-2024-001\nStatus: Active\nOriginal Amount: KES 150,000\nInterest Rate: 15% per month\nOutstanding Balance: KES 85,000\nNext Payment Due: 2024-02-01\n\n${'─'.repeat(50)}\nTRANSACTION HISTORY\n${'─'.repeat(50)}\n\n2024-01-01  Loan Disbursed      +KES 150,000\n2024-01-31  EMI Payment         -KES 32,500\n2024-02-28  EMI Payment         -KES 32,500\n\n${'─'.repeat(50)}\nThis is an automatically generated statement.\nFor queries: support@mzazitech.com\nWhatsApp: +254 741 388 986`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'MZAZI-Loan-Statement.txt';
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => Notifications.show('Statement downloaded!', 'success'), 500);
  }
};

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
const ScrollAnimations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .testimonial-card, .why-feature, .faq-item, .kpi-card').forEach(el => {
      observer.observe(el);
    });
  }
};

/* ============================================================
   SESSION MANAGEMENT
   ============================================================ */
const Session = {
  init() {
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      const user = sessionStorage.getItem('mzazi_user');
      if (!user) {
        Notifications.show('Please login to continue.', 'warning');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
      }
      const userData = JSON.parse(user);
      document.querySelectorAll('.user-name').forEach(el => el.textContent = userData.name || userData.email);
      document.querySelectorAll('.user-email').forEach(el => el.textContent = userData.email || '');
      document.querySelectorAll('.user-avatar').forEach(el => {
        el.textContent = (userData.name || userData.email || 'U')[0].toUpperCase();
      });
    }
    // Logout
    document.querySelectorAll('#logoutBtn, .logout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sessionStorage.removeItem('mzazi_user');
        Notifications.show('Logged out successfully!', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
      });
    });
  }
};

/* ============================================================
   SECURITY — XSS PROTECTION
   ============================================================ */
const Security = {
  sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  sanitizeInput(input) {
    if (!input) return input;
    input.addEventListener('input', () => {
      const cleaned = input.value.replace(/<[^>]*>/g, '').replace(/[<>'"]/g, '');
      if (input.value !== cleaned) input.value = cleaned;
    });
  },
  init() {
    document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
      this.sanitizeInput(input);
    });
  }
};

/* ============================================================
   INIT ALL ON DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Loading.init();
  ThemeManager.init();
  Navbar.init();
  Notifications.init();
  HeroCalc.init();
  EMICalc.init();
  EligibilityChecker.init();
  StatsCounter.init();
  FAQ.init();
  LoginForm.init();
  LoanForm.init();
  PaystackIntegration.init();
  ContactForm.init();
  LiveChat.init();
  Modals.init();
  CurrencySwitcher.init();
  StatementDownload.init();
  ScrollAnimations.init();
  Session.init();
  Security.init();
});
