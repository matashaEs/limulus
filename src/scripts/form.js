const WEBHOOK_URL = "https://hook.eu2.make.com/mmw4gixrn3lf0yufupntz8jnr7stb37z";

(() => {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    const els = {
        fullName: document.getElementById("fullName"),
        company: document.getElementById("company"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        eventDate: document.getElementById("eventDate"),
        rodo: form.querySelector('input[name="rodoConsent"]'),
        marketing: form.querySelector('input[name="marketingConsent"]'),
        submitBtn: document.getElementById("submitBtn"),
        formMessage: document.getElementById("formMessage"),
        errors: {
            fullName: document.getElementById("fullNameError"),
            company: document.getElementById("companyError"),
            email: document.getElementById("emailError"),
            phone: document.getElementById("phoneError"),
            eventDate: document.getElementById("eventDateError"),
            rodo: document.getElementById("rodoError"),
        },
    };

    const MESSAGE_DURATION_MS = 5000;
    let isShowingMessage = false;
    let messageTimer = null;

    els.formMessage?.setAttribute("aria-live", "polite");
    els.formMessage?.setAttribute("role", "status");
    [
        ["fullName", "fullNameError"],
        ["company", "companyError"],
        ["email", "emailError"],
        ["phone", "phoneError"],
        ["eventDate", "eventDateError"],
    ].forEach(([inputId, errId]) => {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errId);
        if (input && err) input.setAttribute("aria-describedby", errId);
    });
    els.rodo?.setAttribute("aria-describedby", "rodoError");

    const NAME_RX =
        /^[A-Za-zÀ-ÖØ-öø-ÿĄĆĘŁŃÓŚŹŻąćęłńóśźż'’\-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿĄĆĘŁŃÓŚŹŻąćęłńóśźż'’\-]+)+$/;

    function getFieldWrapper(inputEl, errorEl) {
        return (
            (errorEl && errorEl.closest(".booking-field, .booking-consents")) ||
            (inputEl && inputEl.closest(".booking-field, .booking-consents")) ||
            null
        );
    }

    function setError(inputEl, errorEl, msg) {
        if (inputEl) inputEl.setAttribute("aria-invalid", "true");
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.setAttribute("role", "alert");
            errorEl.setAttribute("aria-live", "polite");
        }
        const field = getFieldWrapper(inputEl, errorEl);
        field && field.classList.add("has-error");
    }

    function clearError(inputEl, errorEl) {
        if (inputEl) inputEl.setAttribute("aria-invalid", "false");
        if (errorEl) errorEl.textContent = "";
        const field = getFieldWrapper(inputEl, errorEl);
        field && field.classList.remove("has-error");
    }

    function isValidName(v) {
        const s = v.trim();
        return s.length >= 3 && NAME_RX.test(s);
    }
    function isValidCompany(v) {
        return v.trim().length >= 2;
    }
    function isValidEmail(el) {
        return el.checkValidity();
    }
    function isValidPhone(v) {
        if (!v) return false;
        let s = v.trim();
        s = s.replace(/\s|-/g, "");
        if (s.startsWith("0048")) s = s.slice(4);
        else if (s.startsWith("+48")) s = s.slice(3);
        else if (s.startsWith("48") && s.length > 9) s = s.slice(2);
        return /^\d{9}$/.test(s);
    }
    function parseEventDate(str) {
        const s = str.trim();
        if (!s) return null;
        let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
        m = s.match(/^(\d{2})[.\-\/](\d{2})[.\-\/](\d{4})$/);
        if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`);
        const d = new Date(s);
        return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    function isValidFutureOrToday(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date && date >= today;
    }
    function showFormMessage(type, text) {
        if (!els.formMessage) return;
        els.formMessage.textContent = text;
        els.formMessage.classList.remove("is-error", "is-success");
        els.formMessage.classList.add(type === "success" ? "is-success" : "is-error");
    }

    function resetFormFields() {
        form.reset();
        if (els.eventDate && els.eventDate._flatpickr) {
            els.eventDate._flatpickr.clear();
        }
        clearError(els.fullName, els.errors.fullName);
        clearError(els.company, els.errors.company);
        clearError(els.email, els.errors.email);
        clearError(els.phone, els.errors.phone);
        clearError(els.eventDate, els.errors.eventDate);
        clearError(els.rodo, els.errors.rodo);
    }

    function showTemporaryMessage(type, text, prevBtnText) {
        isShowingMessage = true;
        showFormMessage(type, text);

        form.hidden = true;
        form.removeAttribute("aria-busy");

        if (messageTimer) clearTimeout(messageTimer);
        messageTimer = setTimeout(() => {
            resetFormFields();

            if (els.formMessage) {
                els.formMessage.textContent = "";
                els.formMessage.classList.remove("is-success", "is-error");
            }

            form.hidden = false;
            els.submitBtn.disabled = false;
            if (prevBtnText) els.submitBtn.textContent = prevBtnText;

            isShowingMessage = false;
        }, MESSAGE_DURATION_MS);
    }

    function validateFullName() {
        const v = els.fullName.value;
        if (!v.trim()) {
            setError(els.fullName, els.errors.fullName, "To pole jest wymagane.");
            return false;
        }
        if (!isValidName(v)) {
            setError(
                els.fullName,
                els.errors.fullName,
                "Podaj imię i nazwisko (min. dwa słowa)."
            );
            return false;
        }
        clearError(els.fullName, els.errors.fullName);
        return true;
    }
    function validateCompany() {
        const v = els.company.value;
        if (!v.trim()) {
            setError(els.company, els.errors.company, "To pole jest wymagane.");
            return false;
        }
        if (!isValidCompany(v)) {
            setError(els.company, els.errors.company, "Nazwa firmy jest za krótka.");
            return false;
        }
        clearError(els.company, els.errors.company);
        return true;
    }
    function validateEmail() {
        const el = els.email;
        if (!el.value.trim()) {
            setError(el, els.errors.email, "To pole jest wymagane.");
            return false;
        }
        if (!isValidEmail(el)) {
            setError(el, els.errors.email, "Podaj poprawny adres e-mail.");
            return false;
        }
        clearError(el, els.errors.email);
        return true;
    }
    function validatePhone() {
        const v = els.phone.value;
        if (!v.trim()) {
            setError(els.phone, els.errors.phone, "To pole jest wymagane.");
            return false;
        }
        if (!isValidPhone(v)) {
            setError(
                els.phone,
                els.errors.phone,
                "Podaj poprawny numer telefonu (np. 123 456 789 lub +48 ...)."
            );
            return false;
        }
        clearError(els.phone, els.errors.phone);
        return true;
    }
    function validateEventDate() {
        const raw = els.eventDate.value;
        if (!raw.trim()) {
            setError(els.eventDate, els.errors.eventDate, "Wybierz termin wydarzenia.");
            return false;
        }
        const d = parseEventDate(raw);
        if (!d) {
            setError(els.eventDate, els.errors.eventDate, "Nieprawidłowy format daty.");
            return false;
        }
        if (!isValidFutureOrToday(d)) {
            setError(els.eventDate, els.errors.eventDate, "Termin nie może być w przeszłości.");
            return false;
        }
        clearError(els.eventDate, els.errors.eventDate);
        return true;
    }
    function validateRodo() {
        if (!els.rodo.checked) {
            setError(els.rodo, els.errors.rodo, "Zaznacz zgodę RODO, aby kontynuować.");
            return false;
        }
        clearError(els.rodo, els.errors.rodo);
        return true;
    }
    function validateForm() {
        const checks = [
            [validateFullName, els.fullName],
            [validateCompany, els.company],
            [validateEmail, els.email],
            [validatePhone, els.phone],
            [validateEventDate, els.eventDate],
            [validateRodo, els.rodo],
        ];
        let firstInvalid = null;
        let allValid = true;
        for (const [fn, el] of checks) {
            const ok = fn();
            if (!ok) {
                allValid = false;
                if (!firstInvalid) firstInvalid = el;
            }
        }
        if (!allValid && firstInvalid?.focus) firstInvalid.focus();
        return allValid;
    }

    els.fullName.addEventListener("blur", validateFullName);
    els.company.addEventListener("blur", validateCompany);
    els.email.addEventListener("blur", validateEmail);
    els.phone.addEventListener("blur", validatePhone);
    els.eventDate.addEventListener("change", validateEventDate);
    els.rodo.addEventListener("change", validateRodo);
    ["input", "change"].forEach((evt) => {
        [els.fullName, els.company, els.email, els.phone, els.eventDate].forEach((el) =>
            el.addEventListener(evt, () => {
                if (isShowingMessage || form.hidden) return;
                if (els.formMessage) {
                    els.formMessage.textContent = "";
                    els.formMessage.classList.remove("is-success", "is-error");
                }
            })
        );
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            name: els.fullName.value.trim(),
            company: els.company.value.trim(),
            email: els.email.value.trim(),
            phone: els.phone.value.trim(),
            eventDate: els.eventDate.value.trim(),
            marketingConsent: !!els.marketing.checked,
            rodoConsent: !!els.rodo.checked,
            submittedAt: new Date().toISOString(),
        };

        await sendToMake(payload);
    });

    async function sendToMake(payload) {
        if (!WEBHOOK_URL || !/^https?:\/\//i.test(WEBHOOK_URL)) {
            showTemporaryMessage("error", "Błąd konfiguracji: brak poprawnego adresu Webhook.");
            return;
        }

        const prevBtnText = els.submitBtn.textContent;
        els.submitBtn.disabled = true;
        form.setAttribute("aria-busy", "true");

        try {
            const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });

            let msg = "";
            try {
                const data = await res.clone().json();
                msg = data?.message || data?.status || "";
            } catch {
                msg = await res.text();
            }
            if (!res.ok) throw new Error(msg || `Błąd: ${res.status}`);

            showTemporaryMessage("success", "Dziękujemy! Do zobaczenia na wydarzeniu.", prevBtnText);
        } catch (err) {
            showTemporaryMessage(
                "error",
                "Ups! Nie udało się wysłać formularza. Spróbuj ponownie.",
                prevBtnText
            );
        }
    }
})();
