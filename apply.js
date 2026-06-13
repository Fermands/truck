'use strict';

/* ════════════════════════════════════════════
   STATE
════════════════════════════════════════════ */
let currentStep = 1;
const TOTAL_STEPS = 3;

/* ════════════════════════════════════════════
   LOADER EXIT
════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('apLoader');
  gsap.to(loader, {
    yPercent: -100,
    duration: 1.0,
    ease: 'power4.inOut',
    delay: 0.9,
    onComplete: () => {
      loader.style.display = 'none';
      // Animate first step in
      animateStepIn(document.querySelector('.ap-step.is-active'));
    }
  });
}

/* ════════════════════════════════════════════
   STEP ANIMATIONS
════════════════════════════════════════════ */
function animateStepIn(stepEl) {
  if (!stepEl) return;
  const children = stepEl.querySelectorAll('.ap-step__head, .ap-form > *, .ap-field-group');
  gsap.fromTo(children,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.08, duration: 0.75, ease: 'power3.out' }
  );
  gsap.fromTo(stepEl,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' }
  );
}

function transitionStep(fromStep, toStep, direction) {
  const fromEl = document.querySelector(`[data-step="${fromStep}"]`);
  const toEl   = document.querySelector(`[data-step="${toStep}"]`);
  if (!fromEl || !toEl) return;

  const xOut = direction === 'forward' ? -60 : 60;
  const xIn  = direction === 'forward' ?  60 : -60;

  // Exit
  gsap.to(fromEl, {
    x: xOut, opacity: 0,
    duration: 0.45, ease: 'power3.in',
    onComplete() {
      fromEl.classList.remove('is-active');
      fromEl.style.display = 'none';
      gsap.set(fromEl, { x: 0, opacity: 0 });

      // Enter
      toEl.classList.add('is-active');
      toEl.style.display = 'block';
      gsap.fromTo(toEl,
        { x: xIn, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.55, ease: 'power3.out',
          onComplete: () => animateStepIn(toEl)
        }
      );
    }
  });
}

/* ════════════════════════════════════════════
   PROGRESS UI
════════════════════════════════════════════ */
function updateProgress(step) {
  // Fill bar
  const fill = document.getElementById('progressFill');
  const pct  = (step / TOTAL_STEPS) * 100;
  gsap.to(fill, { width: pct + '%', duration: 0.7, ease: 'power3.out' });

  // Step dots
  document.querySelectorAll('[data-step-dot]').forEach(dot => {
    const n = parseInt(dot.dataset.stepDot);
    dot.classList.remove('is-active', 'is-done');
    if (n === step)  dot.classList.add('is-active');
    if (n < step)    dot.classList.add('is-done');
  });

  // Buttons
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  btnBack.style.display = step > 1 ? 'inline-flex' : 'none';
  btnNext.textContent   = step === TOTAL_STEPS ? 'Submit Application' : 'Continue';
  if (step === TOTAL_STEPS) {
    btnNext.innerHTML = 'Submit Application <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7,3 13,9 7,15"/></svg>';
  } else {
    btnNext.innerHTML = 'Continue <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7,3 13,9 7,15"/></svg>';
  }
}

/* ════════════════════════════════════════════
   VALIDATION
════════════════════════════════════════════ */
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    const fields = [
      { id: 'firstName', check: v => v.trim().length > 0 },
      { id: 'lastName',  check: v => v.trim().length > 0 },
      { id: 'email',     check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'phone',     check: v => v.trim().length > 6 },
      { id: 'state',     check: v => v !== '' }
    ];
    fields.forEach(({ id, check }) => {
      const el      = document.getElementById(id);
      const wrapper = el.closest('.ap-field');
      const ok      = check(el.value);
      wrapper.classList.toggle('has-error', !ok);
      if (!ok) { valid = false; shakeField(wrapper); }
    });
  }

  if (step === 2) {
    // CDL radio required
    const cdl = document.querySelector('input[name="cdl"]:checked');
    const cdlGroup = document.querySelector('.ap-radio-group');
    if (!cdl) {
      valid = false;
      shakeEl(cdlGroup);
    }
    // Experience select
    const exp = document.getElementById('experience');
    const expField = exp.closest('.ap-field');
    if (!exp.value) {
      expField.classList.add('has-error');
      valid = false;
      shakeField(expField);
    } else {
      expField.classList.remove('has-error');
    }
    // Violations radio required
    const vio = document.querySelector('input[name="violations"]:checked');
    if (!vio) {
      valid = false;
    }
  }

  if (step === 3) {
    const pos = document.querySelector('input[name="position"]:checked');
    if (!pos) {
      valid = false;
      shakeEl(document.querySelector('.ap-card-radio-group'));
    }
  }

  return valid;
}

function shakeField(el) {
  gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
}
function shakeEl(el) {
  if (!el) return;
  gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
}

/* ════════════════════════════════════════════
   SHOW SUCCESS
════════════════════════════════════════════ */
function showSuccess() {
  // Hide nav + progress
  document.getElementById('apNav').style.display = 'none';
  document.getElementById('apProgress').style.opacity = '0';

  const activeStep = document.querySelector('.ap-step.is-active');
  if (activeStep) {
    gsap.to(activeStep, {
      opacity: 0, y: -30, duration: 0.4, ease: 'power3.in',
      onComplete() {
        activeStep.classList.remove('is-active');
        activeStep.style.display = 'none';

        const success = document.getElementById('apSuccess');
        success.classList.add('is-active');
        gsap.fromTo(success,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
        );
      }
    });
  }
}

/* ════════════════════════════════════════════
   CLEAR ERRORS on input
════════════════════════════════════════════ */
function initLiveValidation() {
  document.querySelectorAll('.ap-input').forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.ap-field');
      if (field) field.classList.remove('has-error');
    });
  });
}

/* ════════════════════════════════════════════
   BOOT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Initial state — hide all inactive steps
  document.querySelectorAll('.ap-step').forEach(step => {
    if (!step.classList.contains('is-active')) {
      step.style.display = 'none';
    }
  });

  initLoader();
  initLiveValidation();
  updateProgress(1);

  // NEXT button
  document.getElementById('btnNext').addEventListener('click', () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < TOTAL_STEPS) {
      const prev = currentStep;
      currentStep++;
      updateProgress(currentStep);
      transitionStep(prev, currentStep, 'forward');
    } else {
      // Submit
      showSuccess();
    }
  });

  // BACK button
  document.getElementById('btnBack').addEventListener('click', () => {
    if (currentStep > 1) {
      const prev = currentStep;
      currentStep--;
      updateProgress(currentStep);
      transitionStep(prev, currentStep, 'backward');
      // Clear errors on step we're going back to
      document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    }
  });
});
