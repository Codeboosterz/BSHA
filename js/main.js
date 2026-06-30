/* ============================================
   HEAVENLY ANGELS BSO — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  const topbar = document.querySelector('.topbar');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (header) {
    if (topbar) topbar.style.transition = 'transform 0.25s ease';
    let ticking = false;
    const updateHeader = () => {
      const scrolled = window.scrollY > 10;
      header.classList.toggle('scrolled', scrolled);
      if (topbar) topbar.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
      if (mobileMenu) mobileMenu.style.top = scrolled
        ? 'var(--header-height)'
        : 'calc(var(--header-height) + var(--topbar-height))';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenuEl = mobileMenu || document.querySelector('.mobile-menu');
  if (hamburger && mobileMenuEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenuEl.classList.toggle('open');
      document.body.style.overflow = mobileMenuEl.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenuEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenuEl.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .mobile-menu a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll Animations ---
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeElements.forEach(el => observer.observe(el));
  }

  // --- Welkom Image Slideshow ---
  const welkomSlideshow = document.querySelector('[data-welkom-slideshow]');
  if (welkomSlideshow) {
    const slides = Array.from(welkomSlideshow.querySelectorAll('.welkom-slide'));
    const dots = Array.from(welkomSlideshow.querySelectorAll('.welkom-slideshow-dots button'));
    let activeSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    let slideTimer = null;
    const slideInterval = Number(welkomSlideshow.dataset.interval) || 10000;

    const showSlide = (index) => {
      if (!slides.length) return;
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === activeSlide);
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const startSlides = () => {
      if (prefersReducedMotion || slides.length <= 1) return;
      stopSlides();
      slideTimer = window.setInterval(() => showSlide(activeSlide + 1), slideInterval);
    };

    const stopSlides = () => {
      if (!slideTimer) return;
      window.clearInterval(slideTimer);
      slideTimer = null;
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopSlides();
        startSlides();
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSlides();
      } else {
        startSlides();
      }
    });

    showSlide(activeSlide);
    startSlides();
  }

  // --- Hero Typewriter Text ---
  const heroTitle = document.querySelector('#hero .hero-content h1');
  const heroSubtitle = document.querySelector('#hero .hero-subtitle');
  const quoteText = document.querySelector('.oo-quote-text');
  const quoteRef = document.querySelector('.oo-quote-ref');

  function prepareTypewriter(target, options) {
    if (!target || target.dataset.typewriterReady === 'true') return;

    const settings = Object.assign({
      delay: 250,
      step: 24,
      duration: 360
    }, options || {});

    const originalText = target.textContent.trim().replace(/\s+/g, ' ');
    let charIndex = 0;

    function wrapTextNode(textNode) {
      const parts = textNode.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      parts.forEach(part => {
        if (!part) return;

        if (/^\s+$/.test(part)) {
          const space = document.createElement('span');
          space.className = 'typewriter-space';
          space.setAttribute('aria-hidden', 'true');
          space.textContent = part;
          fragment.appendChild(space);
          return;
        }

        const word = document.createElement('span');
        word.className = 'typewriter-word';
        word.setAttribute('aria-hidden', 'true');

        Array.from(part).forEach(char => {
          const span = document.createElement('span');
          span.className = 'typewriter-char';
          span.textContent = char;
          span.style.animationDelay = (settings.delay + charIndex * settings.step) + 'ms';
          span.style.animationDuration = settings.duration + 'ms';
          word.appendChild(span);
          charIndex += 1;
        });

        fragment.appendChild(word);
      });

      textNode.replaceWith(fragment);
    }

    function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          wrapTextNode(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    }

    target.classList.add('typewriter-text');
    target.dataset.typewriterReady = 'true';
    target.setAttribute('aria-label', originalText);
    target.style.setProperty('--typewriter-total', (settings.delay + charIndex * settings.step + settings.duration) + 'ms');
    walk(target);
    target.style.setProperty('--typewriter-total', (settings.delay + charIndex * settings.step + settings.duration) + 'ms');
  }

  prepareTypewriter(heroTitle, { delay: 360, step: 26, duration: 420 });
  prepareTypewriter(heroSubtitle, { delay: 1500, step: 16, duration: 320 });

  if (quoteText) {
    const startQuoteTypewriter = () => {
      prepareTypewriter(quoteText, { delay: 180, step: 23, duration: 360 });

      if (quoteRef) {
        const refDelay = 620 + quoteText.textContent.trim().length * 23;
        prepareTypewriter(quoteRef, { delay: refDelay, step: 22, duration: 320 });
      }
    };

    if ('IntersectionObserver' in window) {
      const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startQuoteTypewriter();
            quoteObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' });

      quoteObserver.observe(quoteText);
    } else {
      startQuoteTypewriter();
    }
  }

  // --- Over ons text reveals ---
  const welkomCopy = document.querySelector('#overOns .welkom-copy-type');
  const welkomSignature = document.querySelector('#overOns .welkom-signature-type');

  function startWelkomTypewriter() {
    prepareTypewriter(welkomCopy, { delay: 120, step: 12, duration: 280 });
    prepareTypewriter(welkomSignature, { delay: 520, step: 24, duration: 320 });
  }

  if (welkomCopy) {
    if ('IntersectionObserver' in window) {
      const welkomTextObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startWelkomTypewriter();
            welkomTextObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45, rootMargin: '0px 0px -90px 0px' });

      welkomTextObserver.observe(welkomCopy);
    } else {
      startWelkomTypewriter();
    }
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-primary');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Verzonden!';
      btn.style.background = '#6B9A7B';
      btn.style.borderColor = '#6B9A7B';
      setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; btn.style.borderColor = ''; }, 3000);
    });
  }

  // --- Registration Form Handling ---
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    const totalSteps = 4;
    let currentStep = 1;
    const bsnInput = regForm.querySelector('#regBsn');
    const stepSections = Array.from(regForm.querySelectorAll('[data-form-step]'));
    const prevBtn = regForm.querySelector('[data-form-prev]');
    const nextBtn = regForm.querySelector('[data-form-next]');
    const submitBtn = regForm.querySelector('[data-form-submit]');
    const stepTip = regForm.querySelector('[data-step-tip]');
    const currentStepText = regForm.querySelector('[data-current-step]');
    const progressPercent = regForm.querySelector('[data-progress-percent]');
    const progressFill = regForm.querySelector('[data-progress-fill]');
    const progressWalker = regForm.querySelector('[data-progress-walker]');
    const stepIndicators = Array.from(regForm.querySelectorAll('[data-step-indicator]'));
    const formStatus = regForm.querySelector('[data-form-status]');
    const stepTips = {
      1: 'Begin met de basisgegevens van uw kind. U kunt straks rustig naar de volgende stap.',
      2: 'Vul nu de contactgegevens en opvangwensen in. Dit helpt ons snel passend contact op te nemen.',
      3: 'Medische informatie en noodcontacten zorgen ervoor dat wij veilig en zorgvuldig kunnen handelen.',
      4: 'Rond af met toestemmingen en extra informatie. Daarna kunt u de aanmelding versturen.'
    };
    const validBsn = (value) => {
      const digits = value.replace(/\D/g, '');
      if (!/^\d{8,9}$/.test(digits)) return false;
      const padded = digits.padStart(9, '0');
      const sum = padded.split('').reduce((total, digit, index) => {
        const weight = index === 8 ? -1 : 9 - index;
        return total + Number(digit) * weight;
      }, 0);
      return sum % 11 === 0;
    };
    const validEmailList = (value) => value
      .split(/[,\n;]/)
      .map(item => item.trim())
      .filter(Boolean)
      .every(item => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));

    const controls = Array.from(regForm.querySelectorAll('input, textarea, select'))
      .filter(control => !['hidden', 'submit', 'button'].includes(control.type) && control.name !== 'bot-field');

    controls.forEach(control => {
      const group = control.closest('.form-group') || control.closest('.checkbox-field');
      if (group && !group.querySelector('.field-tip')) {
        const tip = document.createElement('p');
        tip.className = 'field-tip';
        tip.id = control.id ? `${control.id}Tip` : '';
        tip.textContent = control.dataset.tip || 'Controleer dit veld voordat u verdergaat.';
        group.appendChild(tip);
        if (tip.id) control.setAttribute('aria-describedby', tip.id);
      }
    });

    const setFieldError = (control, message) => {
      const group = control.closest('.form-group') || control.closest('.checkbox-field');
      const tip = group ? group.querySelector('.field-tip') : null;
      if (group) group.classList.toggle('has-error', Boolean(message));
      if (tip && message) tip.textContent = message;
      control.setAttribute('aria-invalid', message ? 'true' : 'false');
    };

    const validateControl = (control, showError) => {
      let message = '';
      const value = control.value ? control.value.trim() : '';
      control.setCustomValidity('');

      if (control.required && !value) {
        message = control.dataset.tip || 'Dit veld is nodig om verder te gaan.';
      } else if (control === bsnInput && value && !validBsn(value)) {
        message = 'Vul een geldig BSN in. Een BSN bestaat uit 8 of 9 cijfers en moet kloppen met de controle.';
      } else if (control.id === 'regParentEmails' && value && !validEmailList(value)) {
        message = 'Vul een geldig e-mailadres in. Gebruik komma, puntkomma of een nieuwe regel voor meerdere adressen.';
      } else if (control.id === 'regParentPhones' && value.replace(/\D/g, '').length < 10) {
        message = 'Vul minimaal een volledig telefoonnummer in.';
      } else if (!control.checkValidity()) {
        message = control.dataset.tip || 'Controleer dit veld voordat u verdergaat.';
      }

      control.setCustomValidity(message);
      if (showError || !message) setFieldError(control, message);
      return !message;
    };

    const getStepControls = (step) => stepSections
      .filter(section => Number(section.dataset.formStep) === step)
      .flatMap(section => controls.filter(control => section.contains(control)));

    const updateProgress = () => {
      const progressControls = controls.filter(control => control.offsetParent !== null || control.closest('[data-form-step]'));
      const completed = progressControls.filter(control => {
        if (control.type === 'checkbox') return control.checked;
        return Boolean(control.value && control.value.trim());
      }).length;
      const percent = progressControls.length ? Math.round((completed / progressControls.length) * 100) : 0;
      if (progressPercent) progressPercent.textContent = `${percent}%`;
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressWalker) progressWalker.style.left = `${percent}%`;
    };

    const showStep = (step) => {
      currentStep = Math.max(1, Math.min(totalSteps, step));
      stepSections.forEach(section => {
        section.hidden = Number(section.dataset.formStep) !== currentStep;
      });
      if (currentStepText) currentStepText.textContent = String(currentStep);
      if (stepTip) stepTip.textContent = stepTips[currentStep];
      if (prevBtn) prevBtn.hidden = currentStep === 1;
      if (nextBtn) nextBtn.hidden = currentStep === totalSteps;
      if (submitBtn) submitBtn.hidden = currentStep !== totalSteps;
      stepIndicators.forEach(item => {
        const itemStep = Number(item.dataset.stepIndicator);
        item.classList.toggle('active', itemStep === currentStep);
        item.classList.toggle('complete', itemStep < currentStep);
      });
      updateProgress();
    };

    const validateStep = (step) => {
      const stepControls = getStepControls(step);
      const firstInvalid = stepControls.find(control => !validateControl(control, true));
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.reportValidity();
        updateProgress();
        return false;
      }
      return true;
    };

    if (bsnInput) {
      bsnInput.addEventListener('input', () => {
        bsnInput.value = bsnInput.value.replace(/\D/g, '').slice(0, 9);
        validateControl(bsnInput, Boolean(bsnInput.value));
      });
    }

    controls.forEach(control => {
      control.addEventListener('input', () => {
        validateControl(control, false);
        updateProgress();
      });
      control.addEventListener('blur', () => validateControl(control, Boolean(control.value)));
      control.addEventListener('change', updateProgress);
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showStep(currentStep - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) showStep(currentStep + 1);
      });
    }

    const setSubmitStatus = (message, isError) => {
      if (!formStatus) return;
      formStatus.textContent = message || '';
      formStatus.classList.toggle('is-error', Boolean(isError));
    };

    const setSubmitButton = (state, originalText) => {
      const btn = submitBtn || regForm.querySelector('.btn-primary');
      if (!btn) return;
      if (state === 'loading') {
        btn.disabled = true;
        btn.innerHTML = 'Aanmelding versturen...';
      } else if (state === 'success') {
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Inschrijving verzonden!';
        btn.style.background = '#6B9A7B';
        btn.style.borderColor = '#6B9A7B';
      } else {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
      }
    };

    const collectFormData = () => {
      const data = Object.fromEntries(new FormData(regForm).entries());
      ['photoVideoConsent', 'tripConsent', 'pickupConsent'].forEach(name => {
        data[name] = regForm.querySelector(`[name="${name}"]`)?.checked ? 'ja' : '';
      });
      return data;
    };

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setSubmitStatus('', false);

      const allValid = Array.from({ length: totalSteps }, (_, index) => index + 1)
        .every(step => {
          const stepValid = getStepControls(step).every(control => validateControl(control, true));
          if (!stepValid && currentStep !== step) showStep(step);
          return stepValid;
        });

      if (!allValid) {
        const firstInvalid = controls.find(control => !control.checkValidity());
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.reportValidity();
        }
        return;
      }

      const isLocalPreview = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      const btn = submitBtn || regForm.querySelector('.btn-primary');
      const originalText = btn.innerHTML;

      if (isLocalPreview) {
        setSubmitButton('success', originalText);
        setSubmitStatus('Lokale preview: op de live website wordt deze aanmelding via Resend verstuurd.', false);
        setTimeout(() => setSubmitButton('reset', originalText), 3000);
        return;
      }

      try {
        setSubmitButton('loading', originalText);
        const response = await fetch('/api/send-registration-email.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collectFormData())
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'De aanmelding kon niet worden verstuurd.');
        }
        setSubmitButton('success', originalText);
        setSubmitStatus('Bedankt, de aanmelding is verstuurd naar Heavenly Angels BSO.', false);
      } catch (error) {
        setSubmitButton('reset', originalText);
        setSubmitStatus(error.message || 'De aanmelding kon niet worden verstuurd. Probeer het later opnieuw.', true);
      }
    });

    showStep(1);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
});
