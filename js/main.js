// ============================================
// MODULE LOADER (nav + footer)
// ============================================
// Used on: all pages (targets #nav-placeholder, #footer-placeholder).
// What it does: fetches site-modules.html, injects nav and footer via lodash templates; on non–case-study pages sets active nav from pathname + hash and binds responsive nav toggle; on case-study pages injects simplified “Back” nav.
// Inputs: none (reads window.location). Outputs: populated nav/footer DOM; hashchange listener for active nav.
(function () {
  var $nav = $('#nav-placeholder');
  var $footer = $('#footer-placeholder');
  if (!$nav.length && !$footer.length) return;
  if (typeof _.template !== 'function') return;

  // getActiveNavFromUrl — Used by nav template and setActiveNavFromUrl. Input: none (uses location). Output: 'home' | 'work' | 'about' | 'resume'.
  function getActiveNavFromUrl() {
    var path = window.location.pathname;
    var hash = window.location.hash;
    if (/index\.html$|\/$|^$/.test(path)) return hash === '#selected-work' ? 'work' : 'home';
    if (/about\.html/.test(path)) return 'about';
    if (/resume\.html/.test(path)) return 'resume';
    if (/case-studies\/(dus360|homepath|forecasting)|dus360|homepath|forecasting/.test(path)) return 'work';
    return 'home';
  }

  // setActiveNavFromUrl — Used after nav inject. Toggles .active on .nav-link[data-nav] to match current URL.
  function setActiveNavFromUrl() {
    var active = getActiveNavFromUrl();
    $nav.find('.nav-link[data-nav]').each(function () {
      $(this).toggleClass('active', $(this).attr('data-nav') === active);
    });
  }

  // bindHashChange — Used on non–case-study pages. Listens for hashchange and re-runs setActiveNavFromUrl so “Work” stays active when navigating to #selected-work.
  function bindHashChange() {
    if (!isCaseStudyPage()) $(window).on('hashchange', setActiveNavFromUrl);
  }

  // isCaseStudyPage — Used to choose full nav vs “Back” nav template. Input: none. Output: boolean.
  function isCaseStudyPage() {
    return /case-studies\/(dus360|homepath|forecasting)|dus360|homepath|forecasting/.test(window.location.pathname);
  }

  var modulesUrl = /\/case-studies\//.test(window.location.pathname) ? '../site-modules.html' : 'site-modules.html';
  $.get(modulesUrl)
    .done(function (html) {
      var $doc = $('<div>').html(html);

      if ($nav.length) {
        if (isCaseStudyPage()) {
          var $caseStudyScript = $doc.find('#nav-case-study-template');
          if ($caseStudyScript.length) {
            var caseStudyTemplate = _.template($caseStudyScript.text());
            $nav.html(caseStudyTemplate({ basePath: '../' }));
          } else {
            $nav.html('<p style="color:red;">Nav case study template not found.</p>');
          }
        } else {
          var $navScript = $doc.find('#nav-template');
          if ($navScript.length) {
            var navTemplate = _.template($navScript.text());
            $nav.html(navTemplate({ activeNav: getActiveNavFromUrl() }));
            setActiveNavFromUrl();
            bindResponsiveNav();
          } else {
            $nav.html('<p style="color:red;">Nav template not found in site-modules.html</p>');
          }
        }
      }

      if ($footer.length) {
        var $footerScript = $doc.find('#footer-template');
        if ($footerScript.length) {
          var footerTemplate = _.template($footerScript.text());
          var footerData = { basePath: /\/case-studies\//.test(window.location.pathname) ? '../' : '' };
          $footer.html(footerTemplate(footerData));
        } else {
          $footer.html('<p style="color:red;">Footer template not found in site-modules.html</p>');
        }
      }

      bindHashChange();
    })
    .fail(function (jqXHR) {
      if ($nav.length) {
        $nav.html('<p style="color:red;">Failed to load templates: ' + (jqXHR.statusText || jqXHR.responseText || 'Unknown error') + '</p>');
      }
    });

  // bindResponsiveNav — Used on non–case-study pages after nav inject. Binds .nav-toggle click to toggle .is-open on .nav-left-responsive and .inner (mobile dropdown). Inputs: none. Outputs: click handler on toggle.
  function bindResponsiveNav() {
    var $responsiveLeft = $nav.find('.nav-left-responsive');
    if (!$responsiveLeft.length) return;

    var $toggle = $responsiveLeft.find('.nav-toggle');
    var $menu = $responsiveLeft.find('.inner');
    if (!$toggle.length || !$menu.length) return;

    $toggle.on('click', function () {
      var isOpen = $responsiveLeft.hasClass('is-open');
      $responsiveLeft.toggleClass('is-open', !isOpen);
      $menu.toggleClass('open', !isOpen);
      $toggle.attr('aria-expanded', String(!isOpen));
    });
  }
})();

// ============================================
// TESTIMONIAL CAROUSEL
// ============================================
// Used on: about.html only (#carouselTrack, #dot-0..3, carousel controls with onclick="moveCarousel(±1)", onclick="goToSlide(i)").
// What it does: keeps current slide index, moves track via translateX, updates dot active state; exposes moveCarousel(dir) and goToSlide(index) on window for inline handlers.
// Inputs: moveCarousel(1 | -1), goToSlide(0..3). Outputs: DOM updates (#carouselTrack transform, .carousel-dot.active).
(function () {
  var currentSlide = 0;
  var totalSlides = 4;

  function moveCarousel(dir) {
    currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function updateCarousel() {
    $('#carouselTrack').css('transform', 'translateX(-' + currentSlide * 25 + '%)');
    for (var i = 0; i < totalSlides; i++) {
      $('#dot-' + i).toggleClass('active', i === currentSlide);
    }
  }

  window.moveCarousel = moveCarousel;
  window.goToSlide = goToSlide;
})();
