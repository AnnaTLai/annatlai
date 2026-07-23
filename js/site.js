/*
 * Shared site chrome for Anna's website.
 *
 * Every page shares the same header/nav, footer and script includes. Instead of
 * copy-pasting that markup into each HTML file, pages declare a small skeleton
 * (a <main> with their unique content) and this utility injects the common
 * pieces at load time.
 *
 * Per-page configuration is read from <body> data attributes:
 *   data-page="home|reads|hobby"  -> highlights the active nav link
 *   data-site-header="false"      -> skip injecting the shared header
 *   data-site-footer="false"      -> skip injecting the shared footer
 *   data-back-home="true"         -> show a floating "Back to Home" button
 */
(function () {
  "use strict";

  var HOME_URL = "index.html";

  var NAV_LINKS = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "Reads", href: "reads.html", page: "reads" },
    { label: "Hobby", href: "hobby.html", page: "hobby" },
  ];

  function currentPage() {
    return document.body.dataset.page || "home";
  }

  function buildHeader() {
    var page = currentPage();
    var header = document.createElement("header");
    header.className = "site-header sticky-top py-1";

    var items = NAV_LINKS.map(function (link) {
      var linkClass = link.page === page ? "link-secondary" : "link-dark";
      return (
        '<li><a href="' +
        link.href +
        '" class="nav-link px-2 ' +
        linkClass +
        '">' +
        link.label +
        "</a></li>"
      );
    }).join("");

    header.innerHTML =
      '<div class="container px-4 d-flex flex-wrap justify-content-between align-items-center">' +
      '<a class="navbar-brand d-block mx-auto text-center" href="' +
      HOME_URL +
      '"><img src="img/logo.png" alt="Anna Lai logo" loading="lazy" style="width: 20%;" /></a>' +
      '<ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 float-right-custom">' +
      items +
      "</ul></div>";

    return header;
  }

  function buildFooter() {
    var footer = document.createElement("footer");
    footer.className = "text-muted py-3 border-top";
    footer.innerHTML =
      '<p class="float-sm-start mb-1">&copy; 2024 February</p>' +
      '<p class="float-sm-end mb-1">Created by Anna T. Lai</p>';
    return footer;
  }

  function buildBackToHome() {
    var wrapper = document.createElement("div");
    wrapper.className = "position-fixed bottom-0 end-0 m-3";
    wrapper.innerHTML =
      '<button type="button" class="btn btn-outline-success">' +
      '<i class="bi bi-house-door-fill"></i>&nbsp;&nbsp;Back to Home' +
      "</button>";
    wrapper.querySelector("button").addEventListener("click", function () {
      window.location.href = HOME_URL;
    });
    return wrapper;
  }

  function mount() {
    var body = document.body;
    var main = document.querySelector("main");

    if (body.dataset.siteHeader !== "false") {
      body.insertBefore(buildHeader(), body.firstChild);
    }

    if (body.dataset.siteFooter !== "false" && main) {
      main.appendChild(document.createElement("hr"));
      main.appendChild(buildFooter());
    }

    if (body.dataset.backHome === "true") {
      body.appendChild(buildBackToHome());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
