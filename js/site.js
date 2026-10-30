// Alpha sign-up form -> Google Form, no server needed.
//
// Wired to the "FRED alpha testers" form. To point it at a different form:
//   1. Make a Google Form with these questions (any order):
//        Email (short answer), Name (short answer), Computer (dropdown), Use (checkboxes),
//        MIDI controller (short answer), Notes (paragraph), Acknowledged (checkbox, optional).
//      For the dropdown and checkboxes, type the options EXACTLY as they appear in index.html, or Google drops the answer.
//   2. In the form's menu choose "Get pre-filled link", answer every question with anything, press "Get link".
//      The link looks like  .../forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.1111111=...&entry.2222222=...
//   3. Paste the pieces below. Use the same URL with "viewform" changed to "formResponse".
//      Leave a field's id as "" to not send it.
const FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSdkLOCa4F2qv4vy64LUA3gBa6Jwchvu23THxgdJmOr5ggWnEQ/formResponse",
  fields: {
    email: "entry.721796648",
    name: "entry.1731097937",
    computer: "entry.1488114031",
    uses: "entry.1669922843", // a checkbox group: every ticked box is sent under this one id
    midi: "entry.1315125638",
    notes: "entry.1998489569",
    ack: "entry.582857801",
  },
};

(function () {
  const form = document.getElementById("signup-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const configured = () => FORM.action && FORM.fields.email;
  const say = (text, kind) => { status.textContent = text; status.className = "status" + (kind ? " " + kind : ""); };
  const stop = (field, text) => { field.focus(); say(text, "err"); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get("website")) return say("Thanks!", "ok"); // honeypot: pretend it worked

    const email = String(data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return stop(form.email, "That email does not look right.");
    if (!data.get("computer")) return stop(form.computer, "Please choose your computer.");
    if (!form.ack.checked) return stop(form.ack, "Please tick the box to confirm you know this is alpha software.");

    if (!configured()) {
      console.warn("FRED sign-up: set FORM.action and FORM.fields in js/site.js to send this to a Google Form.");
      return say("Applications are not open yet. Check back soon.", "err");
    }

    const body = new URLSearchParams();
    for (const [name, entry] of Object.entries(FORM.fields)) {
      if (!entry) continue;
      for (const value of data.getAll(name)) {
        const v = String(value).trim();
        if (v) body.append(entry, name === "email" ? email : v);
      }
    }

    const button = form.querySelector("button");
    button.disabled = true;
    say("Sending…");
    try {
      // Google Forms sends no CORS headers, so the reply is opaque: no error means it went through.
      await fetch(FORM.action, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      form.reset();
      say("Thank you! You are on the list, and we will be in touch.", "ok");
    } catch (err) {
      say("Could not send. Please try again.", "err");
    } finally {
      button.disabled = false;
    }
  });
})();
