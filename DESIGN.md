# DESIGN.md — LexBénin Design System (Spécification Suprême)

> **Produit** : LexBénin — Assistant Numérique Citoyen de Prévention et de Vulgarisation Juridique sur le Code du Numérique de la République du Bénin.  
> **Inspiration Majeure** : [America.gov](https://america.gov/) (Sobriété éditoriale monumentale, clarté absolue, haute lisibilité, absence totale d'encombrement bureaucratique).  
> **Statut** : Document normatif et contraignant pour toute interface présente ou future du projet LexBénin.

---

## 1. Philosophie et Posture Visuelle

### Émotion & Intention Citoyenne
Lorsqu'un citoyen, un entrepreneur ou un étudiant béninois s'interroge sur la légalité d'une publication, d'un transfert d'argent, d'une photo ou d'un contrat électronique, il éprouve souvent de l'anxiété face à la complexité des textes de loi.  
L'interface de LexBénin répond par une **confiance sereine** :
- **Autorité bienveillante** : l'exactitude forensique du juriste alliée à la simplicité d'un service public numérique de classe mondiale.
- **Zéro encombrement bureaucratique** : aucun menu labyrinthique, aucune surcharge visuelle, un point focal unique invitant à l'action.
- **Sobriété républicaine** : le drapeau et les emblèmes du Bénin ne sont pas des gadgets publicitaires ou des boutons criards ; ils interviennent avec dignité sous forme de micro-accents et de sceaux de certification.

---

## 2. Contrat des Couleurs (Tokens Officiels)

Le système de couleurs repose sur une discipline stricte entre les modes clair et sombre, calibrée pour un contraste maximal (WCAG AAA) et le respect de l'ambiance nocturne feutrée d'America.gov.

### A. Toile & Surfaces Fondatrices

| Token | Mode Clair | Mode Sombre (America.gov) | Rôle & Usage |
|---|---|---|---|
| `--canvas-bg` | `#F7F7F5` | `#0B0D12` | Fond principal de page (albâtre chaud le jour, noir abyssal teinté la nuit). |
| `--card-bg` | `#FFFFFF` | `#0F1217` | Surface des cartes de contenu, dossiers de réponse et formulaires. |
| `--card-elevated` | `#F7F7F5` | `#14171D` | Cartes en retrait, encadrés de citations de loi et blocs métriques. |
| `--surface-subtle`| `#EFECE6` | `#1A202C` | Badges neutres, séparateurs et fonds de survol discrets. |
| `--border-subtle` | `#E5E7EB` | `rgba(255, 255, 255, 0.10)` | Délimitation fine (1px) garantissant la netteté des cartes. |
| `--border-focus`  | `#0F2942` | `rgba(255, 255, 255, 0.30)` | Anneau de focus accessible et contour des champs actifs. |

### B. Typographie & Contrastes Textuels

| Token | Mode Clair | Mode Sombre | Rôle & Usage |
|---|---|---|---|
| `--text-main` | `#0A0D14` | `#FFFFFF` | Titres monumentaux, textes de verdict et libellés majeurs. |
| `--text-muted`| `#525866` | `rgba(255, 255, 255, 0.70)` | Sous-titres explicatifs, explications vulgarisées, légendes. |
| `--text-subtle`| `#88909E` | `rgba(255, 255, 255, 0.40)` | Métadonnées de dates, mentions légales secondaires, placeholders. |

### C. Accents Interactifs d'Action

| Token | Mode Clair | Mode Sombre | Rôle & Usage |
|---|---|---|---|
| `--accent-primary` | `#0F2942` (Bleu Nuit Civique) | `#0066C5` (Bleu Électrique) | Boutons d'envoi principaux, validation et actions décisives. |
| `--accent-hover`   | `#001428` | `#1A75D0` | État au survol des boutons primaires. |
| `--accent-selection` | `#0F2942` | `#1B51FF` | Couleur de sélection du texte au surlignage. |

### D. Micro-Accents Républicains (Drapeau du Bénin)
> **Règle absolue** : Les trois couleurs nationales ne doivent **JAMAIS** être utilisées comme couleurs de fond de boutons interactifs. Elles sont réservées aux indicateurs d'officialité et au composant `<BeninFlag />`.

* **Vert Émeraude Bénin** : `#008751`
* **Jaune Savane Bénin** : `#FCD116`
* **Rouge Terre Bénin** : `#E8112D`

### E. Système Sémantique des Qualifications Juridiques (RG-JUR4)

Chaque réponse ou analyse juridique porte un statut qualifié sans équivoque :

| Statut Juridique | Fond Clair / Sombre | Bordure | Texte | Pastille Dot |
|---|---|---|---|---|
| **Autorisé** | `#ECFDF5` / `rgba(6, 95, 70, 0.25)` | `#A7F3D0` / `rgba(52, 211, 153, 0.3)` | `#065F46` / `#6EE7B7` | `#10B981` |
| **À risque / Zone grise** | `#FFFBEB` / `rgba(146, 64, 14, 0.25)` | `#FDE68A` / `rgba(251, 191, 36, 0.3)` | `#92400E` / `#FCD34D` | `#F59E0B` |
| **Interdit / Infraction** | `#FEF2F2` / `rgba(153, 27, 27, 0.25)` | `#FECACA` / `rgba(248, 113, 113, 0.3)` | `#991B1B` / `#FCA5A5` | `#EF4444` |

---

## 3. Typographie

L'architecture typographique repose sur un dialogue strict entre trois polices :

```
Newsreader (Serif Monumental)  <--->  Plus Jakarta Sans (UI Moderne)  <--->  JetBrains Mono (Loi Exacte)
```

1. **`Newsreader` (`font-editorial`)** :
   - Usage : Titre d'accueil (`Bonjour, Bénin.`), grand mot-symbole `LexBénin`, entêtes de pages secondaires (`PageHeader`), et questions fondamentales.
   - Propriétés : Tracking serré (`-0.025em` à `-0.04em`), interlignage court (`1.05` à `1.15`), élégance éditoriale d'imprimerie nationale.
2. **`Plus Jakarta Sans` (`font-sans`)** :
   - Usage : Corps de texte de vulgarisation, champs de saisie, boutons, liens de navigation, menus et alertes.
   - Propriétés : Hauteur d'x élevée, lisibilité parfaite sur smartphone à faible résolution, graisse 400 (normal) à 600 (semi-bold).
3. **`JetBrains Mono` (`font-mono`)** :
   - Usage : Références d'articles (`Article 550 — Loi n° 2017-20`), identifiants de transactions, hashes APDP, badges de registre.
   - Propriétés : Rigueur technique, neutralité d'huissier, forensic clair.

---

## 4. Règles Spatiales, Grille & Conteneurs

### Conteneur Principal Citoyen
- Toute interface d'interaction citoyenne est centrée et contenue dans **`max-w-4xl` (ou `max-w-5xl`)** :
  - `px-4 sm:px-6` pour la sécurité mobile.
  - Largeur de lecture optimale (65 à 80 caractères par ligne).
- Espacement vertical généreux : `py-10 sm:py-16` pour donner de la respiration et de la sérénité.

### Règle d'Or du Dock Flottant Inférieur (~55px)
- La barre flottante de prompt/recherche inférieure (`StickyBottomSearch`) reste accessible au défilement dès que l'usager quitte le haut de la page.
- **Pour éviter tout masquage de texte ou de liens**, tout pied de page (`Footer`) ou fond de page interactive **doit impérativement comporter un padding inférieur de `pb-24 sm:pb-28`**.
- Cet espacement assure exactement **~55px à 65px de marge libre** entre le dernier élément cliquable et le dock flottant (calibré sur la mesure exacte d'America.gov).

---

## 5. Primitives d'Interface UI Obligatoires (`src/components/ui/`)

Toute future page doit assembler ces primitives au lieu de recréer du balisage ad-hoc :

### 1. `CivicCard`
- **Rôle** : Encapsule les surfaces de contenu avec le respect infaillible du mode clair (`bg-white`) et sombre (`dark:bg-[#0F1217]`), contour 1px (`border-[#E5E7EB] dark:border-white/10`) et coins arrondis `rounded-3xl`.
- **Variante `elevated`** : utilise `dark:bg-[#14171D]` pour les encadrés secondaires.

### 2. `PillButton`
- **Rôle** : Boutons d'action au format pilule (`rounded-full`).
- **Variante `primary`** : Bleu Nuit `#0F2942` le jour, Bleu Électrique `#0066C5` la nuit, texte blanc, effet micro-scale au clic.
- **Variante `secondary`** : Contour subtil sur fond semi-transparent.
- **Variante `ghost`** : Texte épuré avec survol doux.

### 3. `VerdictBadge`
- **Rôle** : Affiche la qualification juridique selon la norme RG-JUR4 avec une pastille lumineuse colorée (dot) et un contraste garanti sans agresser l'œil.

### 4. `LawArticleBox`
- **Rôle** : Affiche un extrait officiel du Code du numérique en police `JetBrains Mono` sur fond teinté, avec le badge d'authenticité de la base officielle de la République du Bénin.

### 5. `PageHeader` & `PageContainer`
- **Rôle** : Structure le sommet de toute page secondaire (`/a-propos`, `/faq`, `/escalade`, `/chat`) avec le titre monumental en `font-editorial` et le sous-titre calibré.

---

## 6. Composants Signatures du Système

1. **Header Minimaliste Républicain** :
   - Mot-symbole `LexBénin` à gauche + vrai drapeau du Bénin `<BeninFlag />`.
   - Bouton de bascule Thème Clair / Sombre (`ThemeToggle`).
   - Bouton pilule `Menu` ouvrant le tiroir plein écran.
2. **Menu Tiroir Plein Écran (`MenuDrawer`)** :
   - Fond synchronisé sur le thème en cours (`bg-white` en clair, `bg-[#0B0D12]` en sombre).
   - Liens monumentaux de navigation, sélecteur de langues et rappel d'assistance citoyenne.
3. **Dock Flottant Inférieur Déterministe (`StickyBottomSearch`)** :
   - Fond flouté `backdrop-blur-md` (`bg-white/95` ou `dark:bg-[#0B0D12]/95`).
   - Apparition immédiate au défilement dès que le champ supérieur quitte l'écran (`window.scrollY > 180`).
   - Saisie texte, bouton pièce jointe (capture d'écran OCR), bouton micro (note vocale) et flèche circulaire d'envoi.
4. **Pied de Page Monumental (`Footer`)** :
   - Liens éditoriaux clairs, lettrage géant `LexBénin`, et mentions tripartites avec le Barreau du Bénin et la conformité à la Loi N° 2017-20.

---

## 7. Règles Non-Négociables pour Tout Nouveau Développement

| Règle | Intitulé | Prescription stricte |
|---|---|---|
| **RG-DESIGN1** | **Zéro carte blanche en mode sombre** | Interdiction formelle d'ajouter un conteneur `bg-white` sans spécifier `dark:bg-[#0F1217]` ou `dark:bg-[#14171D]`. Toujours privilégier `<CivicCard>`. |
| **RG-DESIGN2** | **Typographie de caste** | Tout titre majeur doit porter la classe `font-editorial`. Tout texte d'article de loi doit porter `font-mono`. L'interface générale porte `font-sans`. |
| **RG-DESIGN3** | **Enveloppe standardisée** | Toute nouvelle page citoyenne doit être logée dans `<PageContainer>` avec son `<PageHeader>`. |
| **RG-DESIGN4** | **Usage obligatoire des primitives** | Pas de classes de boutons arbitraires : utiliser `<PillButton>` et `<VerdictBadge>`. |
| **RG-DESIGN5** | **Respect de l'intervalle dock (~55px)** | Tout bas de page doit avoir `pb-24 sm:pb-28` pour ne jamais chevaucher la barre flottante. |
| **RG-DESIGN6** | **Drapeau officiel unique** | Utiliser exclusivement le composant `<BeninFlag />`. Zéro emoji drapeau ou SVG externe. |
| **RG-DESIGN7** | **Avertissement légal permanent** | Rappeler systématiquement que LexBénin est un outil citoyen et ne remplace pas un avocat. |
