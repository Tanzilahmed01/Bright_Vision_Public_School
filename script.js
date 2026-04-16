/* ===================================
   Bright Vision Public School
   script.js  —  Fixed & Complete
=================================== */

var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-YdsLoC-iC7cF7pYI6elsZqQDkWx1OOzDhWgWwlmf3t-cgWhvjRYfbS9AcefTQg/exec";

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  var target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo(0, 0);
}

/* ============================================================
   HOME HERO SLIDESHOW
   ============================================================ */
var slideIndex = 0;

function goSlide(n) {
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero .dot');
  if (!slides.length) return;
  slides.forEach(function(s) { s.classList.remove('active'); });
  dots.forEach(function(d) { d.classList.remove('active'); });
  slideIndex = (n + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
  if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

setInterval(function () {
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length) goSlide(slideIndex + 1);
}, 4000);

/* ============================================================
   PAGE SECTION SLIDESHOWS  (about / adm / contact)
   ============================================================ */
var pageSlideIndexes = { about: 0, adm: 0, contact: 0 };
var pageSlideTimers  = {};

function goPageSlide(section, n) {
  var hero = document.getElementById(section + '-hero');
  if (!hero) return;

  var slides = hero.querySelectorAll('.page-slide');
  var dots   = hero.querySelectorAll('.dot');
  if (!slides.length) return;

  /* Remove active from all slides & dots */
  slides.forEach(function(s) { s.classList.remove('active'); });
  dots.forEach(function(d)   { d.classList.remove('active'); });

  /* Clamp index */
  pageSlideIndexes[section] = (n + slides.length) % slides.length;

  slides[pageSlideIndexes[section]].classList.add('active');
  if (dots[pageSlideIndexes[section]]) dots[pageSlideIndexes[section]].classList.add('active');
}

/* Auto-advance each section independently */
function startPageSlideshow(section) {
  if (pageSlideTimers[section]) clearInterval(pageSlideTimers[section]);
  pageSlideTimers[section] = setInterval(function () {
    var hero = document.getElementById(section + '-hero');
    if (!hero) return;
    var slides = hero.querySelectorAll('.page-slide');
    if (!slides.length) return;
    goPageSlide(section, pageSlideIndexes[section] + 1);
  }, 4500);
}

/* Initialise on DOM ready */
document.addEventListener('DOMContentLoaded', function () {
  /* Make sure first slide of each hero is active */
  ['about', 'adm', 'contact'].forEach(function (section) {
    goPageSlide(section, 0);
    startPageSlideshow(section);
  });

  /* Also initialise home hero */
  goSlide(0);
});

/* ============================================================
   ADMISSION FORM SUBMIT
   ============================================================ */
function submitAdmission(btn) {
  var form   = btn.closest('.apply-form');
  var inputs = form.querySelectorAll('input, select');

  var studentName = inputs[0].value.trim();
  var dob         = inputs[1].value.trim();
  var grade       = inputs[2].value;
  var parentName  = inputs[3].value.trim();
  var mobile      = inputs[4].value.trim();
  var email       = inputs[5].value.trim();

  if (!studentName || !dob || !grade || !parentName || !mobile) {
    alert('Please fill all required fields before submitting.');
    return;
  }

  btn.textContent = 'Submitting…';
  btn.disabled    = true;

  fetch(SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      formType:    'admission',
      studentName: studentName,
      dob:         dob,
      grade:       grade,
      parentName:  parentName,
      mobile:      mobile,
      email:       email
    })
  })
  .then(function () {
    btn.textContent       = 'Application Submitted! ✓';
    btn.style.background  = '#0F6E56';
    inputs.forEach(function (inp) { inp.value = ''; });
  })
  .catch(function () {
    btn.textContent = 'Submit Application';
    btn.disabled    = false;
    alert('Something went wrong. Please try again.');
  });
}

/* ============================================================
   CONTACT FORM SUBMIT
   ============================================================ */
function submitContact(btn) {
  var form     = btn.closest('.contact-form');
  var inputs   = form.querySelectorAll('input');
  var textarea = form.querySelector('textarea');

  var name    = inputs[0].value.trim();
  var email   = inputs[1].value.trim();
  var phone   = inputs[2].value.trim();
  var subject = inputs[3].value.trim();
  var message = textarea ? textarea.value.trim() : '';

  if (!name || !email || !message) {
    alert('Please fill Name, Email and Message before submitting.');
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  fetch(SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      formType: 'contact',
      name:     name,
      email:    email,
      phone:    phone,
      subject:  subject,
      message:  message
    })
  })
  .then(function () {
    btn.textContent      = 'Message Sent! ✓';
    btn.style.background = '#0F6E56';
    inputs.forEach(function (inp) { inp.value = ''; });
    if (textarea) textarea.value = '';
  })
  .catch(function () {
    btn.textContent = 'Send Message';
    btn.disabled    = false;
    alert('Something went wrong. Please try again.');
  });
}