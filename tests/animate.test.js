/**
 * @jest-environment jsdom
 */
const { loadSiteScript } = require("./helpers");

describe("animate.js hover animations", () => {
  test("adds 'animated flash' on mouseenter and removes on mouseleave", async () => {
    document.body.innerHTML = '<div class="e_flash"></div>';
    const $ = await loadSiteScript("animate.js");
    const el = $(".e_flash");

    el.trigger("mouseenter");
    expect(el.hasClass("animated")).toBe(true);
    expect(el.hasClass("flash")).toBe(true);

    el.trigger("mouseleave");
    expect(el.hasClass("animated")).toBe(false);
    expect(el.hasClass("flash")).toBe(false);
  });

  // Every hover block in animate.js binds the same behavior: on a `.e_<name>`
  // element, mouseenter adds `animated <name>` and mouseleave removes it.
  const TRIGGER_CLASSES = [
    "e_bounce", "e_bounceIn", "e_bounceInDown", "e_bounceInLeft",
    "e_bounceInRight", "e_bounceInUp", "e_bounceOut", "e_bounceOutDown",
    "e_bounceOutLeft", "e_bounceOutRight", "e_bounceOutUp", "e_fadeIn",
    "e_fadeInDown", "e_fadeInDownBig", "e_fadeInLeft", "e_fadeInLeftBig",
    "e_fadeInRight", "e_fadeInRightBig", "e_fadeInUp", "e_fadeInUpBig",
    "e_fadeOut", "e_fadeOutDown", "e_fadeOutDownBig", "e_fadeOutLeft",
    "e_fadeOutLeftBig", "e_fadeOutRight", "e_fadeOutRightBig", "e_fadeOutUp",
    "e_fadeOutUpBig", "e_flash", "e_flip", "e_flipInX", "e_flipInY",
    "e_flipOutX", "e_flipOutY", "e_hinge", "e_lightSpeedIn", "e_lightSpeedOut",
    "e_pulse", "e_rollIn", "e_rollOut", "e_rotateIn", "e_rotateInDownLeft",
    "e_rotateInDownRight", "e_rotateInUpLeft", "e_rotateInUpRight",
    "e_rotateOut", "e_rotateOutDownLeft", "e_rotateOutDownRight",
    "e_rotateOutUpLeft", "e_rotateOutUpRight", "e_shake", "e_swing", "e_tada",
    "e_wiggle", "e_wobble",
  ];

  test.each(TRIGGER_CLASSES.map((c) => [c, c.replace(/^e_/, "")]))(
    "%s toggles 'animated %s' on hover",
    async (triggerClass, animClass) => {
    document.body.innerHTML = `<div class="${triggerClass}"></div>`;
    const $ = await loadSiteScript("animate.js");
    const el = $("." + triggerClass);

    el.trigger("mouseenter");
    expect(el.hasClass("animated")).toBe(true);
    expect(el.hasClass(animClass)).toBe(true);

    el.trigger("mouseleave");
    expect(el.hasClass("animated")).toBe(false);
    expect(el.hasClass(animClass)).toBe(false);
  });

  test("does not touch elements without an animation trigger class", async () => {
    document.body.innerHTML = '<div class="plain"></div>';
    const $ = await loadSiteScript("animate.js");
    const el = $(".plain");

    el.trigger("mouseenter");
    expect(el.hasClass("animated")).toBe(false);
  });
});
