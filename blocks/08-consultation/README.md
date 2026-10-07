# CTA с Русланом и формой

- Исходный селектор: `section.catalog-contact`
- Разметка: `fragment.html`
- Метаданные зависимостей: `block.json`
- Общие визуальные правила: `../../shared/reference-ui.md`

При загрузке `reference-ui-behavior.js` исходный `.catalog-contact` преобразуется в актуальный `.catalog-consultation`.

Для точного вида подключайте базовые стили из `arenda_sobstvennikam/index.html`, затем `../../src/reference-ui-overrides.css`. Интерактивные блоки требуют `../../src/reference-ui-behavior.js`.
