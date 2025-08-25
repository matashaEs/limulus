import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Polish } from 'flatpickr/dist/l10n/pl.js';

const allowedDates = ['2025-09-23', '2025-10-07', '2025-10-21'];

const el = document.querySelector('#eventDate');
if (el) {
  flatpickr(el, {
    locale: Polish,
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'd M Y',
    allowInput: false,
    enable: allowedDates
  });
}
