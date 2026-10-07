#!/usr/bin/env python3
"""Extract reusable BARNES blocks from the canonical compiled page."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "arenda_sobstvennikam" / "index.html"
BLOCKS = ROOT / "blocks"

DEFINITIONS = (
    ("01-hero-header", "Хедер внутри hero", "header", "site-header"),
    ("02-sticky-header", "Второй хедер после прокрутки", "div", "owner-sale-sticky"),
    ("03-hero", "Hero страницы", "section", "owner-sale-hero"),
    ("04-presentation", "Стратегия презентации", "section", "owner-sale-presentation"),
    ("05-team", "Единая команда BARNES", "section", "owner-sale-services"),
    ("06-barnes-moscow", "BARNES / Москва", "section", "about-company"),
    ("07-exclusive", "Преимущества эксклюзивной работы", "section", "owner-sale-exclusive"),
    ("08-consultation", "CTA с Русланом и формой", "section", "catalog-contact"),
    ("09-property-links", "Перелинковка с изображениями", "section", "owner-sale-types"),
    ("10-newsletter", "Email-рассылка", "section", "newsletter-cta"),
    ("11-footer", "Footer", "footer", "site-footer"),
    ("12-floating-expert", "Плавающий контакт эксперта", "aside", "floating-expert"),
    ("13-valuation-popup", "Всплывающая форма оценки аренды", "div", "feedback-modal"),
)

DYNAMIC_FALLBACKS = {
    "12-floating-expert": '<aside data-v-cd0a1259="" class="floating-expert floating-expert--gorodskaya" aria-label="Руслан Прус"><button data-v-cd0a1259="" type="button" class="floating-expert__card" aria-haspopup="dialog"><span data-v-cd0a1259="" class="floating-expert__avatar"><img data-v-cd0a1259="" src="/arenda_sobstvennikam/pictures/consultation/cta-ruslan-pruss.webp" alt="Руслан Прус" width="72" height="72" loading="lazy" decoding="async"></span><span data-v-cd0a1259="" class="floating-expert__content"><span data-v-cd0a1259="" class="floating-expert__label">Руководитель департамента городской недвижимости</span><span data-v-cd0a1259="" class="floating-expert__title">Задать вопрос эксперту</span><span data-v-cd0a1259="" class="floating-expert__name">Руслан Прус</span></span></button><button data-v-cd0a1259="" type="button" class="floating-expert__close" aria-label="Скрыть карточку Руслан Прус"></button></aside>',
    "13-valuation-popup": '<div class="feedback-modal feedback-modal--owner-rent" role="dialog" aria-modal="true" aria-labelledby="owner-rent-valuation-title"><div class="feedback-modal__layout"><div class="feedback-modal__body"><h2 class="feedback-modal__title" id="owner-rent-valuation-title">За сколько можно сдать вашу недвижимость?</h2><p class="feedback-modal__intro">Поможем определить арендную ставку и найти подходящего арендатора.</p><form class="feedback-modal__form"><div class="feedback-modal__channels" role="group" aria-label="Способ связи"><button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button><button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button><button type="button" data-channel="MAX" aria-pressed="false">MAX</button><button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button></div><label class="feedback-modal__field"><input class="feedback-modal__input" name="name" autocomplete="name" placeholder="Ваше имя" aria-label="Ваше имя"></label><label class="feedback-modal__field"><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" aria-label="Номер телефона в Telegram" required></label><button class="feedback-modal__submit" type="submit">Получить оценку</button><label class="feedback-modal__consent"><input type="checkbox" name="consent" required><span>Я даю согласие на обработку персональных данных</span></label></form></div><div class="feedback-modal__hero"><picture><source media="(max-width: 580px)" srcset="/arenda_sobstvennikam/pictures/feedback-modal/interior-mobile.webp"><img class="feedback-modal__hero-image" src="/arenda_sobstvennikam/pictures/feedback-modal/interior-desktop.webp" alt="Премиальный интерьер с панорамным видом"></picture></div></div></div>',
}


def find_opening(html: str, tag: str, class_name: str) -> re.Match[str]:
    pattern = re.compile(
        rf"<{tag}\b(?=[^>]*\bclass=(['\"])[^'\"]*\b{re.escape(class_name)}\b[^'\"]*\1)[^>]*>",
        re.IGNORECASE,
    )
    match = pattern.search(html)
    if not match:
        raise ValueError(f"Cannot find {tag}.{class_name}")
    return match


def extract_balanced(html: str, tag: str, class_name: str) -> str:
    opening = find_opening(html, tag, class_name)
    token = re.compile(rf"</?{tag}\b[^>]*>", re.IGNORECASE)
    depth = 0
    for match in token.finditer(html, opening.start()):
        if match.group(0).startswith("</"):
            depth -= 1
            if depth == 0:
                return html[opening.start() : match.end()]
        elif not match.group(0).rstrip().endswith("/>"):
            depth += 1
    raise ValueError(f"Unbalanced {tag}.{class_name}")


def write_block(slug: str, title: str, tag: str, class_name: str, fragment: str) -> None:
    directory = BLOCKS / slug
    directory.mkdir(parents=True, exist_ok=True)
    selector = f"{tag}.{class_name}"
    (directory / "fragment.html").write_text(fragment + "\n", encoding="utf-8")
    metadata = {
        "name": title,
        "slug": slug,
        "selector": f".{class_name}",
        "source": "arenda_sobstvennikam/index.html",
        "styles": ["../../src/reference-ui-overrides.css"],
        "behavior": "../../src/reference-ui-behavior.js",
        "assetRoots": ["../../arenda_sobstvennikam/assets", "../../arenda_sobstvennikam/pictures", "../../arenda_sobstvennikam/fonts"],
    }
    (directory / "block.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    note = ""
    if slug == "08-consultation":
        note = "\nПри загрузке `reference-ui-behavior.js` исходный `.catalog-contact` преобразуется в актуальный `.catalog-consultation`.\n"
    if slug == "13-valuation-popup":
        note = "\nРазметка показывает итоговое состояние. В рабочей странице `reference-ui-behavior.js` улучшает штатную форму, сохраняя её обработчик отправки и валидацию.\n"
    readme = f"""# {title}

- Исходный селектор: `{selector}`
- Разметка: `fragment.html`
- Метаданные зависимостей: `block.json`
- Общие визуальные правила: `../../shared/reference-ui.md`
{note}
Для точного вида подключайте базовые стили из `arenda_sobstvennikam/index.html`, затем `../../src/reference-ui-overrides.css`. Интерактивные блоки требуют `../../src/reference-ui-behavior.js`.
"""
    (directory / "README.md").write_text(readme, encoding="utf-8")


def main() -> None:
    html = SOURCE.read_text(encoding="utf-8")
    for definition in DEFINITIONS:
        slug, title, tag, class_name = definition
        if slug == "13-valuation-popup":
            fragment = DYNAMIC_FALLBACKS[slug]
        else:
            try:
                fragment = extract_balanced(html, tag, class_name)
            except ValueError:
                fragment = DYNAMIC_FALLBACKS[slug]
        write_block(slug, title, tag, class_name, fragment)
        print(f"exported {slug}")


if __name__ == "__main__":
    main()
