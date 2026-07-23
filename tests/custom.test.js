/**
 * @jest-environment jsdom
 */
const { loadSiteScript } = require("./helpers");

describe("custom.js UI behaviors", () => {
  test(".big-cta hover toggles 'animated shake' on '.cta a'", async () => {
    document.body.innerHTML =
      '<div class="big-cta"></div><div class="cta"><a>Go</a></div>';
    const $ = await loadSiteScript("custom.js");
    const link = $(".cta a");

    $(".big-cta").trigger("mouseenter");
    expect(link.hasClass("animated")).toBe(true);
    expect(link.hasClass("shake")).toBe(true);

    $(".big-cta").trigger("mouseleave");
    expect(link.hasClass("animated")).toBe(false);
    expect(link.hasClass("shake")).toBe(false);
  });

  test(".box hover animates its icon and paragraph, then clears them", async () => {
    document.body.innerHTML =
      '<div class="box"><span class="icon"></span><p>text</p></div>';
    const $ = await loadSiteScript("custom.js");
    const box = $(".box");

    box.trigger("mouseenter");
    expect(box.find(".icon").hasClass("animated")).toBe(true);
    expect(box.find(".icon").hasClass("fadeInDown")).toBe(true);
    expect(box.find("p").hasClass("animated")).toBe(true);
    expect(box.find("p").hasClass("fadeInUp")).toBe(true);

    box.trigger("mouseleave");
    expect(box.find(".icon").hasClass("fadeInDown")).toBe(false);
    expect(box.find("p").hasClass("fadeInUp")).toBe(false);
  });

  test("accordion 'show' activates the heading toggle and swaps the icon", async () => {
    document.body.innerHTML = `
      <div class="accordion">
        <div class="accordion-heading">
          <a class="accordion-toggle"><i class="icon-plus"></i></a>
        </div>
        <div class="accordion-body">body</div>
      </div>`;
    const $ = await loadSiteScript("custom.js");

    $(".accordion-body").trigger("show");

    const toggle = $(".accordion-toggle");
    expect(toggle.hasClass("active")).toBe(true);
    expect(toggle.find("i").hasClass("icon-minus")).toBe(true);
    expect(toggle.find("i").hasClass("icon-plus")).toBe(false);
  });

  test("accordion 'hide' deactivates other toggles and restores their icon", async () => {
    document.body.innerHTML = `
      <div class="accordion">
        <div class="accordion-heading">
          <a class="accordion-toggle active"><i class="icon-minus"></i></a>
        </div>
        <div class="accordion-body">body</div>
      </div>`;
    const $ = await loadSiteScript("custom.js");

    $(".accordion-body").trigger("hide");

    const toggle = $(".accordion-toggle");
    expect(toggle.hasClass("active")).toBe(false);
    expect(toggle.find("i").hasClass("icon-plus")).toBe(true);
    expect(toggle.find("i").hasClass("icon-minus")).toBe(false);
  });

  test(".scrollup click is handled (default prevented)", async () => {
    document.body.innerHTML = '<a class="scrollup">top</a>';
    const $ = await loadSiteScript("custom.js");

    const ev = $.Event("click");
    $(".scrollup").trigger(ev);

    expect(ev.isDefaultPrevented()).toBe(true);
  });

  test("initializes the flexslider, tooltip and fancybox plugins", async () => {
    const flexslider = jest.fn(function () {
      return this;
    });
    const tooltip = jest.fn(function () {
      return this;
    });
    const fancybox = jest.fn(function () {
      return this;
    });

    document.body.innerHTML =
      '<div id="post-slider"></div><div id="main-slider"></div>';
    await loadSiteScript("custom.js", ($) => {
      $.fn.flexslider = flexslider;
      $.fn.tooltip = tooltip;
      $.fn.fancybox = fancybox;
    });

    expect(flexslider).toHaveBeenCalledTimes(2);
    expect(tooltip).toHaveBeenCalledTimes(1);
    expect(fancybox).toHaveBeenCalledTimes(1);
  });
});
