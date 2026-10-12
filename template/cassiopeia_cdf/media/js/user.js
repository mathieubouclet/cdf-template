/**
 * CoupDeFouet.fr – mise en forme des recettes existantes.
 *
 * Les recettes ont été saisies dans l'éditeur sous la forme :
 *   <h4>Titre</h4> (ou <p><strong>Titre</strong></p>)
 *   <p><strong>Information recette:</strong></p> <ul>…</ul>
 *   <p><strong>Ingrédients:</strong></p> [<p>Pour la pâte :</p>] <ul>…</ul> …
 *   <p><strong>Préparation :</strong></p> <ul>…</ul> ou <ul><li>Partie</li></ul> <p>étape<br>étape…</p>
 * Ce script repère ces blocs et leur ajoute des classes (voir user.css) :
 * vrai titre H1, encadrés d'infos, ingrédients à cocher, étapes numérotées.
 * Un bloc qui n'est pas reconnu est simplement laissé tel quel.
 */
const cdfFormatRecipe = () => {
  const body = document.querySelector('.com-content-article__body');

  if (!body) {
    return;
  }

  const clean = (text) => text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const isBold = (el) => !!el.querySelector('strong, b, u, span[style*="underline"]');
  const SECTIONS = [
    { re: /^informations?( recette)?/i, type: 'infos' },
    { re: /^ingr[ée]dients?/i, type: 'ingredients' },
    { re: /^(pr[ée]parations?|montage|cuisson|finition|d[ée]roulement)\b/i, type: 'steps' },
  ];

  const replaceWithHeading = (el, tag, className, text) => {
    const heading = document.createElement(tag);
    heading.className = className;
    heading.textContent = text;
    el.replaceWith(heading);
    return heading;
  };

  // 1. Titre saisi dans le texte : supprimé s'il double le titre de l'article,
  //    sinon transformé en vrai <h1> (le titre de l'article n'est pas affiché).
  const titleEl = body.firstElementChild;
  if (titleEl && /^(H2|H3|H4|P)$/.test(titleEl.tagName) && !titleEl.querySelector('img')) {
    const text = clean(titleEl.textContent);
    const pageTitle = document.querySelector('.com-content-article .page-header :is(h1, h2)');
    if (text && text.length < 80 && (titleEl.tagName !== 'P' || isBold(titleEl))) {
      if (pageTitle) {
        if (clean(pageTitle.textContent).toLowerCase() === text.toLowerCase()) {
          titleEl.remove();
        }
      } else {
        replaceWithHeading(titleEl, 'h1', 'cdf-title', text);
      }
    }
  }

  // Paragraphes vides (souvent juste un espace) laissés par l'éditeur
  body.querySelectorAll(':scope > p').forEach((p) => {
    if (!clean(p.textContent) && !p.querySelector('img, iframe, video')) {
      p.remove();
    }
  });

  const formatInfos = (ul) => {
    ul.classList.add('cdf-infos');
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const parts = clean(li.textContent).split(/\s*:\s*/);
      if (parts.length < 2) {
        return;
      }
      // Champ du modèle laissé vide (« Température : ») : on ne l'affiche pas
      if (!parts.slice(1).join('').trim()) {
        li.remove();
        return;
      }
      const label = document.createElement('span');
      label.className = 'cdf-infos__label';
      label.textContent = parts.shift().replace(/^(niveau de |temps de )/i, '');
      li.textContent = parts.join(' : ');
      li.prepend(label);
    });
  };

  const formatIngredients = (ul) => {
    ul.classList.add('cdf-ingredients');
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const label = document.createElement('label');
      const box = document.createElement('input');
      const text = document.createElement('span');
      box.type = 'checkbox';
      text.append(...li.childNodes);
      label.append(box, text);
      li.append(label);
    });
  };

  const makeSteps = (items) => {
    const ol = document.createElement('ol');
    ol.className = 'cdf-steps';
    items.forEach((content) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      if (typeof content === 'string') {
        span.innerHTML = content;
      } else {
        span.append(...content);
      }
      li.append(span);
      ol.append(li);
    });
    return ol;
  };

  // <ul> de plusieurs lignes → liste numérotée
  const formatStepList = (ul) => {
    const items = [...ul.querySelectorAll(':scope > li')].map((li) => [...li.childNodes]);
    ul.replaceWith(makeSteps(items));
  };

  // <p> avec des retours à la ligne → une étape par ligne
  const formatStepParagraph = (p) => {
    const steps = p.innerHTML
      .split(/<br\s*\/?>/i)
      .map((html) => html.trim())
      .filter((html) => clean(html.replace(/<[^>]+>/g, '')) !== '');

    if (steps.length >= 2) {
      p.replaceWith(makeSteps(steps));
    }
  };

  let current = null;

  [...body.children].forEach((el) => {
    const text = clean(el.textContent);
    const shortBold = el.tagName === 'P' && text.length > 0 && text.length < 80 && isBold(el);

    // Titre de rubrique : « Ingrédients : », « Préparation : »…
    if (shortBold) {
      const section = SECTIONS.find((s) => s.re.test(text));
      if (section) {
        replaceWithHeading(el, 'h2', 'cdf-subtitle', text.replace(/\s*[:;]\s*$/, ''));
        current = section.type;
        return;
      }
    }

    if (current === 'infos') {
      if (el.tagName === 'UL') {
        formatInfos(el);
      }
      current = null;
      return;
    }

    if (current === 'ingredients') {
      if (el.tagName === 'UL') {
        formatIngredients(el);
      } else if (el.tagName === 'P' && text.length < 80) {
        // Sous-groupe : « Pour la pâte : »
        replaceWithHeading(el, 'h3', 'cdf-group-title', text.replace(/\s*:\s*$/, ''));
      }
      return;
    }

    if (current === 'steps') {
      if (el.tagName === 'UL' && el.children.length === 1) {
        // Une seule ligne : c'est le nom d'une partie (« La crème pâtissière »)
        replaceWithHeading(el, 'h3', 'cdf-group-title', clean(el.textContent).replace(/\s*:\s*$/, ''));
      } else if (el.tagName === 'UL') {
        formatStepList(el);
      } else if (el.tagName === 'OL') {
        // Liste déjà numérotée dans l'éditeur
        el.classList.add('cdf-steps');
        el.querySelectorAll(':scope > li').forEach((li) => {
          const span = document.createElement('span');
          span.append(...li.childNodes);
          li.append(span);
        });
      } else if (shortBold && !el.querySelector('br')) {
        replaceWithHeading(el, 'h3', 'cdf-group-title', text.replace(/\s*:\s*$/, ''));
      } else if (el.tagName === 'P' && el.querySelector('br')) {
        formatStepParagraph(el);
      }
    }
  });
};

// Le script est chargé dans le <head> : on attend que la page soit construite
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cdfFormatRecipe);
} else {
  cdfFormatRecipe();
}
