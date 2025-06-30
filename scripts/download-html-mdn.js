#!/usr/bin/env node

/**
 * Script pour télécharger la documentation HTML officielle depuis le dépôt GitHub MDN
 * Télécharge les fichiers Markdown bruts depuis https://github.com/mdn/content
 */

import { execSync } from "child_process";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, "..", "docs", "html");

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
};

function logStatus(status, message) {
    const color = status === "success" ? colors.green : status === "error" ? colors.red : colors.cyan;
    console.log(`${color}${message}${colors.reset}`);
}

// Liste des fichiers Markdown HTML à télécharger depuis le dépôt MDN
const HTML_MD_FILES = [
    // Eléments de base
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/index.md",
        category: "elements",
        name: "html-elements-reference.md",
        title: "Référence des éléments HTML",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/attributes/index.md",
        category: "attributes",
        name: "html-attributes-reference.md",
        title: "Référence des attributs HTML",
    },

    // Formulaires (doublons supprimés)
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/form/index.md",
        category: "forms",
        name: "form.md",
        title: "Élément form",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/input/index.md",
        category: "forms",
        name: "input.md",
        title: "Élément input",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/select/index.md",
        category: "forms",
        name: "select.md",
        title: "Élément select",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/textarea/index.md",
        category: "forms",
        name: "textarea.md",
        title: "Élément textarea",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/button/index.md",
        category: "forms",
        name: "button.md",
        title: "Élément button",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/fieldset/index.md",
        category: "forms",
        name: "fieldset.md",
        title: "Élément fieldset",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/legend/index.md",
        category: "forms",
        name: "legend.md",
        title: "Élément legend",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/datalist/index.md",
        category: "forms",
        name: "datalist.md",
        title: "Élément datalist",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/output/index.md",
        category: "forms",
        name: "output.md",
        title: "Élément output",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/progress/index.md",
        category: "forms",
        name: "progress.md",
        title: "Élément progress",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/meter/index.md",
        category: "forms",
        name: "meter.md",
        title: "Élément meter",
    },

    // Sémantique
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/header/index.md",
        category: "semantic",
        name: "header.md",
        title: "Élément header",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/nav/index.md",
        category: "semantic",
        name: "nav.md",
        title: "Élément nav",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/main/index.md",
        category: "semantic",
        name: "main.md",
        title: "Élément main",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/section/index.md",
        category: "semantic",
        name: "section.md",
        title: "Élément section",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/article/index.md",
        category: "semantic",
        name: "article.md",
        title: "Élément article",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/aside/index.md",
        category: "semantic",
        name: "aside.md",
        title: "Élément aside",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/footer/index.md",
        category: "semantic",
        name: "footer.md",
        title: "Élément footer",
    },

    // Média
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/img/index.md",
        category: "media",
        name: "img.md",
        title: "Élément img",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/picture/index.md",
        category: "media",
        name: "picture.md",
        title: "Élément picture",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/video/index.md",
        category: "media",
        name: "video.md",
        title: "Élément video",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/audio/index.md",
        category: "media",
        name: "audio.md",
        title: "Élément audio",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/canvas/index.md",
        category: "media",
        name: "canvas.md",
        title: "Élément canvas",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/svg/index.md",
        category: "media",
        name: "svg.md",
        title: "Élément SVG",
    },

    // Tables (doublons supprimés)
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/table/index.md",
        category: "tables",
        name: "table.md",
        title: "Élément table",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/caption/index.md",
        category: "tables",
        name: "caption.md",
        title: "Élément caption",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/th/index.md",
        category: "tables",
        name: "th.md",
        title: "Élément th",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/tr/index.md",
        category: "tables",
        name: "tr.md",
        title: "Élément tr",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/td/index.md",
        category: "tables",
        name: "td.md",
        title: "Élément td",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/thead/index.md",
        category: "tables",
        name: "thead.md",
        title: "Élément thead",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/tbody/index.md",
        category: "tables",
        name: "tbody.md",
        title: "Élément tbody",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/tfoot/index.md",
        category: "tables",
        name: "tfoot.md",
        title: "Élément tfoot",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/col/index.md",
        category: "tables",
        name: "col.md",
        title: "Élément col",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/colgroup/index.md",
        category: "tables",
        name: "colgroup.md",
        title: "Élément colgroup",
    },

    // Métadonnées
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/meta/index.md",
        category: "metadata",
        name: "meta.md",
        title: "Élément meta",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/link/index.md",
        category: "metadata",
        name: "link.md",
        title: "Élément link",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/title/index.md",
        category: "metadata",
        name: "title.md",
        title: "Élément title",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/global_attributes/index.md",
        category: "attributes",
        name: "global-attributes.md",
        title: "Attributs globaux",
    },

    // Accessibilité
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/accessibility/aria/index.md",
        category: "accessibility",
        name: "aria-basics.md",
        title: "ARIA - Accessibilité",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/accessibility/wcag/index.md",
        category: "accessibility",
        name: "wcag-guidelines.md",
        title: "Guidelines WCAG",
    },

    // Web Components
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/components/index.md",
        category: "components",
        name: "web-components.md",
        title: "Web Components",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/components/custom_elements/index.md",
        category: "components",
        name: "custom-elements.md",
        title: "Éléments personnalisés",
    },

    // Performance et bonnes pratiques
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/performance/index.md",
        category: "performance",
        name: "performance-html.md",
        title: "Performance HTML",
    },
    {
        url: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/howto/index.md",
        category: "guides",
        name: "html-howto.md",
        title: "Comment faire avec HTML",
    },
];

/**
 * Télécharge un document depuis MDN
 */
async function downloadMdnMarkdown(doc) {
    const categoryDir = join(DOCS_DIR, doc.category);
    if (!existsSync(categoryDir)) {
        mkdirSync(categoryDir, { recursive: true });
    }
    const filePath = join(categoryDir, doc.name);
    try {
        const content = execSync(`curl -sL "${doc.url}"`, { encoding: "utf-8" });
        if (!content || content.length < 100) throw new Error("Fichier vide ou trop court");
        const header = `# ${doc.title}\n\n> **Source officielle MDN GitHub**\n> [Voir sur GitHub](${doc.url})\n\n---\n\n`;
        writeFileSync(filePath, header + content);
        logStatus("success", `✅ ${doc.title}`);
        return true;
    } catch (e) {
        logStatus("error", `❌ ${doc.title} : ${e.message}`);
        writeFileSync(
            filePath,
            `# ${doc.title}\n\n> **Erreur de téléchargement**\n> [Voir sur GitHub](${doc.url})\n\n---\n\nCe fichier n'a pas pu être téléchargé.`
        );
        return false;
    }
}

/**
 * Fonction principale
 */
async function downloadAllHtmlMdn() {
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }
    let ok = 0,
        ko = 0;
    for (const doc of HTML_MD_FILES) {
        const res = await downloadMdnMarkdown(doc);
        if (res) ok++;
        else ko++;
    }
    logStatus("success", `\nTéléchargement terminé : ${ok} réussi(s), ${ko} échoué(s).`);
}

downloadAllHtmlMdn();
