
(function () {
    'use strict';

    const iframeUrl =
        'https://raulgonzalez77.github.io/blinn-font-awesome-icons/icon-library/index.html';

    // Add modal styles.
    const style = document.createElement('style');

    style.textContent = `
        .cms-modal {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, .65);
        }

        .cms-modal.is-open {
            display: flex;
        }

        .cms-modal-dialog {
            width: min(95vw, 1100px);
            height: min(85vh, 800px);
            background: #fff;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .cms-modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cms-modal-header h2 {
            margin: 0;
            font-size: 20px;
        }

        .cms-modal-close {
            border: 0;
            background: transparent;
            font-size: 28px;
            cursor: pointer;
        }

        .cms-modal-frame {
            width: 100%;
            flex: 1;
            border: 0;
        }
    `;

    document.head.appendChild(style);

    // Create modal.
    const modal = document.createElement('div');
    modal.className = 'cms-modal';

    modal.innerHTML = `
        <div class="cms-modal-dialog"
             role="dialog"
             aria-modal="true"
             aria-labelledby="cms-modal-title">

            <div class="cms-modal-header">
                <h2 id="cms-modal-title">Icon Library Test</h2>
                <button type="button"
                        class="cms-modal-close"
                        aria-label="Close modal">
                    &times;
                </button>
            </div>

        <iframe
            class="cms-modal-frame"
            title="Icon Library"
            allow="clipboard-write">
        </iframe>
        </div>
    `;

    document.body.appendChild(modal);

    const frame = modal.querySelector('iframe');
    const closeButton = modal.querySelector('.cms-modal-close');

    let previousFocus = null;

    function openModal() {
        previousFocus = document.activeElement;

        frame.src = iframeUrl;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        closeButton.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        frame.removeAttribute('src');
        document.body.style.overflow = '';

        previousFocus?.focus();
    }

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' &&
            modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Expose a function for testing.
    window.openCmsIconModal = openModal;

})();