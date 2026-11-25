# AGENTS.md — Portail Citoyen Public (lexfront)

> Guide de développement et règles non-négociables pour le portail citoyen `lexfront`.
> L'agent doit lire ce fichier avant toute intervention sur le code Frontend.

---

## 1. Vue d'ensemble du Frontend

**Rôle** : Portail web citoyen public offrant un accès instantané et vulgarisé au Code du numérique béninois (chat interactif, FAQ thématique, formulaires de signalement et d'escalade juridique).

**Stack officielle** :
* **Runtime Node.js** : Node.js v24.21.0 (Active LTS recommandé) / v26.11.1
* **Framework** : Next.js 16.4.0 (App Router)
* **Bibliothèque UI** : React 19.3.0
* **Langage** : TypeScript 5+ (mode strict obligatoire)
* **Styling** : Tailwind CSS (mobile-first, responsive fluide)
* **Icônes** : Lucide React
* **Temps réel** : Streaming Server-Sent Events (SSE) pour l'affichage progressif des réponses RAG
* **Tests** : Vitest + React Testing Library

---

## 2. Architecture du projet (`lexfront/`)

```
lexfront/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── src/
│   ├── app/                                 # Routes App Router
│   │   ├── layout.tsx                       # Layout global (Navbar, Footer, Legal Disclaimer)
│   │   ├── page.tsx                         # Landing page d'accueil & recherche rapide
│   │   ├── chat/page.tsx                    # Interface de discussion en langage naturel
│   │   ├── faq/page.tsx                     # FAQ thématique pré-validée par les juristes
│   │   ├── escalade/page.tsx                # Formulaire d'orientation vers un juriste
│   │   └── a-propos/page.tsx                # Contexte, limites d'usage et textes de référence
│   │
│   ├── components/                          # Composants réutilisables
│   │   ├── ui/                              # Composants de base (Button, Card, Input, Badge)
│   │   ├── chat/                            # ChatBox, MessageBubble, SourceAccordion, LegalBadge
│   │   ├── audio/                           # AudioPlayer (lecture vocale des réponses)
│   │   └── layout/                          # Header, Footer, LegalDisclaimerBanner
│   │
│   └── lib/                                 # Utilitaires & Couche Réseau
│       ├── api.ts                           # Client HTTP vers l'API FastAPI (lexback)
│       ├── types.ts                         # Types TypeScript calqués sur les schémas Pydantic
│       ├── constants.ts                     # Constantes de statut, libellés et textes légaux
│       └── hooks/                           # useChatStream, useFeedback, useAudio
│
└── tests/
    ├── unit/                                # Tests de composants & hooks
    └── conftest/setup.ts                    # Configuration Vitest & Mocks Fetch
```

---

## 3. Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Dossiers de routes | `kebab-case` | `a-propos`, `escalade` |
| Fichiers de composants | `PascalCase.tsx` | `LegalStatusBadge.tsx`, `ChatBox.tsx` |
| Fichiers utilitaires / hooks | `camelCase.ts` | `useChatStream.ts`, `apiClient.ts` |
| Composants React | `PascalCase` | `function LegalStatusBadge() {}` |
| Types / Interfaces | `PascalCase` | `LegalResponse`, `CitizenQuestion` |
| Variables d'environnement | `NEXT_PUBLIC_SCREAMING_SNAKE` | `NEXT_PUBLIC_API_URL` |

---

## 4. Règles d'Accessibilité & UX Citoyenne

L'agent NE DOIT JAMAIS déroger à ces principes :

1. **Mobile-First Impératif** : Plus de 80 % des citoyens accèdent au service sur smartphone avec des connexions mobiles parfois instables. Zéro débordement horizontal, temps de chargement ultra-léger.
2. **Avertissement Légal Permanent (RG-JUR6)** : Le bandeau précisant que l'outil ne remplace pas un avocat doit être visible en permanence, notamment sur les pages `/chat` et `/escalade`.
3. **Codes Couleurs Normalisés des Statuts Juridiques (RG-JUR4)** :
   * **`autorisé`** : Vert (`bg-emerald-50 text-emerald-700 border-emerald-300`)
   * **`interdit`** : Rouge (`bg-rose-50 text-rose-700 border-rose-300`)
   * **`à risque`** : Orange / Ambre (`bg-amber-50 text-amber-700 border-amber-300`)
   * **`zone grise`** : Indigo / Gris (`bg-indigo-50 text-indigo-700 border-indigo-300`) avec **bouton direct vers le formulaire d'escalade**.
4. **Vulgarisation sans jargon** : L'interface doit privilégier des termes simples (« Ce que dit la loi », « Conseil pour agir », « Articles concernés »).

---

## 5. Charte Graphique & Design System Non-Négociable (America.gov + LexBénin)

Consulter obligatoirement [`DESIGN.md`](./DESIGN.md) avant toute création de composant ou de page. Règles strictes :

* **RG-DESIGN1 (Zéro carte blanche en mode sombre)** : Interdiction formelle d'ajouter un conteneur `bg-white` sans spécifier sa contrepartie sombre (`dark:bg-[#0F1217]` ou `dark:bg-[#14171D]`). Toujours privilégier le composant primitif `<CivicCard>`.
* **RG-DESIGN2 (Typographie de caste)** : Tout titre majeur de section ou de page doit porter la classe `font-editorial` (`Newsreader`). Tout texte d'article de loi doit porter `font-mono` (`JetBrains Mono`). L'interface générale porte `font-sans` (`Plus Jakarta Sans`).
* **RG-DESIGN3 (Enveloppe standardisée)** : Toute nouvelle page citoyenne (`/chat`, `/faq`, `/a-propos`, `/escalade`, etc.) doit obligatoirement être encapsulée dans `<PageContainer>` avec son entête `<PageHeader>`.
* **RG-DESIGN4 (Primitives UI obligatoires)** : Interdiction d'écrire des boutons ou badges ad-hoc sans passer par les primitives du dossier `src/components/ui/` (`<PillButton>`, `<VerdictBadge>`, `<CivicCard>`, `<LawArticleBox>`).
* **RG-DESIGN5 (Respect de l'intervalle dock ~55px)** : Tout pied de page ou bas de page interactive doit avoir `pb-24 sm:pb-28` pour maintenir ~55px de respiration au-dessus de la barre flottante `StickyBottomSearch`.
* **RG-DESIGN6 (Drapeau officiel unique)** : Utiliser exclusivement le composant `<BeninFlag />`. Zéro emoji drapeau ou SVG arbitraire.
* **RG-DESIGN7 (Palette officielle)** : Toile sombre `#0B0D12`, surfaces sombres `#0F1217`, accent sombre `#0066C5` (hover `#1A75D0`), sélection `#1B51FF`.


---

## 6. Workflow Git & Définition de "Terminé"

### Branches par Skill
Toute fonctionnalité frontend est développée sur une branche issue de `develop` :
```
skill/front-<nom-du-skill>

Exemples :
skill/front-chat-streaming
skill/front-faq-search
skill/front-escalade-form
skill/front-audio-player
```

### Validation obligatoire avant merge dans `develop`
Le skill ne peut être mergé que si **les 4 commandes suivantes sont 100 % vertes** :

```bash
# 1. Tests unitaires des composants avec couverture minimale 80%
npm run test -- --coverage

# 2. Vérification linter ESLint stricte
npm run lint

# 3. Vérification des types TypeScript
npm run type-check

# 4. Build de production Next.js sans warning bloquant
npm run build
```

---

## 7. Variables d'Environnement

```env
# URL de l'API FastAPI lexback
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
Toute variable publique doit obligatoirement être préfixée par `NEXT_PUBLIC_`.
