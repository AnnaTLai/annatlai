/**
 * @jest-environment jsdom
 */
const { loadSiteScript } = require("./helpers");

/**
 * Builds a `.validateform` whose `.field` contains a single input/textarea and
 * a `.validation` message holder, matching the structure validate.js expects.
 */
function buildForm({ tag = "input", rule, msg, value = "", checked = false }) {
  const attrs = [
    'class="field-input"',
    rule !== undefined ? `data-rule="${rule}"` : "",
    msg !== undefined ? `data-msg="${msg}"` : "",
    checked ? "checked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const control =
    tag === "textarea"
      ? `<textarea ${attrs}>${value}</textarea>`
      : `<input ${attrs} value="${value}" />`;

  document.body.innerHTML = `
    <form class="validateform">
      <div class="field">
        ${control}
        <span class="validation"></span>
      </div>
    </form>`;
}

/** Submits the form and returns the (jQuery) event so callers can inspect it. */
function submit($) {
  const ev = $.Event("submit");
  $("form.validateform").trigger(ev);
  return ev;
}

function validationText($) {
  return $(".validation").html();
}

describe("validate.js form validation", () => {
  let ajaxSpy;

  async function load() {
    const $ = await loadSiteScript("validate.js");
    ajaxSpy = jest.fn();
    $.ajax = ajaxSpy;
    return $;
  }

  describe("required rule", () => {
    test("blocks submit and shows a message when empty", async () => {
      buildForm({ rule: "required", value: "" });
      const $ = await load();

      const ev = submit($);

      expect(ev.isDefaultPrevented()).toBe(true);
      expect(validationText($)).toBe("wrong Input");
      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    test("passes and clears the message when filled", async () => {
      buildForm({ rule: "required", value: "hello" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("");
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });

    test("uses the custom data-msg when provided", async () => {
      buildForm({ rule: "required", value: "", msg: "Name is required" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("Name is required");
    });
  });

  describe("email rule", () => {
    test.each(["not-an-email", "foo@bar", "@nope.com", "a b@x.com"])(
      "rejects invalid address %p",
      async (value) => {
        buildForm({ rule: "email", value });
        const $ = await load();

        submit($);

        expect(validationText($)).toBe("wrong Input");
        expect(ajaxSpy).not.toHaveBeenCalled();
      }
    );

    test.each(["anna@example.com", "a.b-c@sub.domain.co"])(
      "accepts valid address %p",
      async (value) => {
        buildForm({ rule: "email", value });
        const $ = await load();

        submit($);

        expect(validationText($)).toBe("");
        expect(ajaxSpy).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("maxlen rule (errors when shorter than the given length)", () => {
    test("shows a message when the value is too short", async () => {
      buildForm({ rule: "maxlen:5", value: "abc" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("wrong Input");
      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    test("passes when the value meets the length", async () => {
      buildForm({ rule: "maxlen:5", value: "abcde" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("");
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("regexp rule", () => {
    test("rejects a value that does not match", async () => {
      buildForm({ rule: "regexp:^[0-9]+$", value: "abc" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("wrong Input");
    });

    test("accepts a value that matches", async () => {
      buildForm({ rule: "regexp:^[0-9]+$", value: "12345" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("");
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("checked rule", () => {
    test("rejects an unchecked checkbox", async () => {
      buildForm({ rule: "checked", value: "on", checked: false });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("wrong Input");
      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    test("accepts a checked checkbox", async () => {
      buildForm({ rule: "checked", value: "on", checked: true });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("");
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("textarea handling", () => {
    test("required textarea blocks submit when empty", async () => {
      buildForm({ tag: "textarea", rule: "required", value: "" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("wrong Input");
      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    test("required textarea passes when filled", async () => {
      buildForm({ tag: "textarea", rule: "required", value: "a message" });
      const $ = await load();

      submit($);

      expect(validationText($)).toBe("");
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });
  });

  test("inputs without a data-rule are ignored", async () => {
    buildForm({ value: "" });
    const $ = await load();

    submit($);

    expect(validationText($)).toBe("");
    expect(ajaxSpy).toHaveBeenCalledTimes(1);
  });

  test("valid submit POSTs the serialized form to the contact endpoint", async () => {
    buildForm({ rule: "required", value: "hello" });
    const $ = await load();

    submit($);

    expect(ajaxSpy).toHaveBeenCalledTimes(1);
    const options = ajaxSpy.mock.calls[0][0];
    expect(options.type).toBe("POST");
    expect(options.url).toBe("contact/contact.php");
    expect(typeof options.data).toBe("string");
  });
});
