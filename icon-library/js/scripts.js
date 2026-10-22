'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('#icon-grid');
    const search = document.querySelector('#icon-search');
    const count = document.querySelector('#result-count');
    const status = document.querySelector('#copy-status');

    let selectedCard = null;

    function renderIcons(icons) {

        const fragment = document.createDocumentFragment();

        for (const icon of icons) {

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'icon-card';
            button.dataset.icon = icon.name;
            button.title = `Copy ${icon.name}`;

            const preview = document.createElement('i');
            preview.className = `fa-solid fa-${icon.name}`;
            preview.setAttribute('aria-hidden', 'true');

            const name = document.createElement('span');
            name.className = 'icon-name';
            name.textContent = icon.name;

            button.append(preview, name);
            fragment.appendChild(button);
        }

        grid.replaceChildren(fragment);
        selectedCard = null;

        count.textContent =
            `Showing ${icons.length} of ${iconLibrary.length} icons`;
    }

    function filterIcons() {

        const term = search.value.trim().toLowerCase();

        const matches = iconLibrary.filter(icon => {

            const searchable = [
                icon.name,
                icon.label,
                ...icon.keywords
            ].join(' ').toLowerCase();

            return searchable.includes(term);
        });

        renderIcons(matches);
    }

    async function copyIcon(button) {

        const name = button.dataset.icon;

        try {
            await navigator.clipboard.writeText(name);

            if (selectedCard) {
                selectedCard.classList.remove('copied');
            }

            button.classList.add('copied');
            selectedCard = button;

            status.textContent = `${name} copied to clipboard`;

        } catch (error) {
            status.textContent =
                'Unable to copy automatically. Please try again.';
            console.error('Clipboard error:', error);
        }
    }

    search.addEventListener('input', filterIcons);

    grid.addEventListener('click', event => {

        const button = event.target.closest('.icon-card');

        if (button) {
            copyIcon(button);
        }
    });

    renderIcons(iconLibrary);
});