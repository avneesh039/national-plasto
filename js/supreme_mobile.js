/**
 * Supreme 1:1 Mobile Responsiveness Controller
 * Handles mobile navbar, off-canvas slide drawer, accordion dropdowns, and search bar.
 */
(function () {
    'use strict';

    function initMobileController() {
        var navIcon = document.getElementById('nav-icon3');
        var sidebar = document.querySelector('.sidebar_wrap');

        // 1. Mobile Hamburger Toggle
        if (navIcon && sidebar) {
            navIcon.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                navIcon.classList.toggle('open');
                sidebar.classList.toggle('open');
                document.body.classList.toggle('overflow-hidden');
            });
        }

        // 2. Mobile Accordion Dropdowns inside Sidebar
        var dropdownToggles = document.querySelectorAll('.sidebar_wrap .dropdown-toggle');
        dropdownToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var dropdown = toggle.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                }
            });
        });

        // 3. Close Drawer on Navigating
        var navLinks = document.querySelectorAll('.sidebar_wrap .links a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navIcon) navIcon.classList.remove('open');
                if (sidebar) sidebar.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
            });
        });

        // 4. Outside Tap Closes Drawer & Search
        document.addEventListener('click', function (e) {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && (!navIcon || !navIcon.contains(e.target))) {
                    navIcon.classList.remove('open');
                    sidebar.classList.remove('open');
                    document.body.classList.remove('overflow-hidden');
                }
            }

            var searchBox = document.querySelector('.mobile_navbar .search_main_box');
            if (searchBox && searchBox.classList.contains('active')) {
                if (!searchBox.contains(e.target)) {
                    searchBox.classList.remove('active'); var mb = searchBox.closest('.mobile_navbar'); if(mb) mb.classList.remove('search_open');
                }
            }
        });

        // 5. Escape Key Closes Everything
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (navIcon) navIcon.classList.remove('open');
                if (sidebar) sidebar.classList.remove('open');
                document.body.classList.remove('overflow-hidden');
                var searchBox = document.querySelector('.mobile_navbar .search_main_box');
                if (searchBox) searchBox.classList.remove('active'); var mb = searchBox.closest('.mobile_navbar'); if(mb) mb.classList.remove('search_open');
            }
        });

        // 6. Scroll-To-Top Button
        var scrollBtn = document.getElementById('scroll_btn');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Global Search Toggle Function (used by onclick)
    window.searchToggle = function (btn, event) {
        if (event) event.preventDefault();
        var searchContainer = btn.closest('.search_main_box');
        if (!searchContainer) return;

        var mobNav = searchContainer.closest('.mobile_navbar');
        if (searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
            if (mobNav) mobNav.classList.remove('search_open');
            var input = searchContainer.querySelector('.header_search_input');
            if (input) input.value = '';
        } else {
            searchContainer.classList.add('active');
            if (mobNav) mobNav.classList.add('search_open');
            var input = searchContainer.querySelector('.header_search_input');
            if (input) {
                setTimeout(function () {
                    input.focus();
                }, 100);
            }
        }
    };

    
    // 7. Ensure All Content Below Hero is Always Fully Visible (No Blank Out)
    function forceContentVisibility() {
        var scrollEls = document.querySelectorAll('[data-scroll], .toTop, .toBottom, .toLeft, .toRight');
        scrollEls.forEach(function(el) {
            el.setAttribute('data-scroll', 'in');
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    }
    forceContentVisibility();
    window.addEventListener('scroll', forceContentVisibility, { passive: true });
    window.addEventListener('resize', forceContentVisibility, { passive: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileController);
    } else {
        initMobileController();
    }
})();
