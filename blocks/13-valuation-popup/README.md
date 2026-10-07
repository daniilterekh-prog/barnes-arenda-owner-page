# Всплывающая форма оценки аренды

- Исходный селектор: `div.feedback-modal`
- Разметка: `fragment.html`
- Метаданные зависимостей: `block.json`
- Общие визуальные правила: `../../shared/reference-ui.md`

Разметка показывает итоговое состояние. В рабочей странице `reference-ui-behavior.js` улучшает штатную форму, сохраняя её обработчик отправки и валидацию.

Для точного вида подключайте базовые стили из `arenda_sobstvennikam/index.html`, затем `../../src/reference-ui-overrides.css`. Интерактивные блоки требуют `../../src/reference-ui-behavior.js`.
