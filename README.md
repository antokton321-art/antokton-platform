# Antokton – Platforma Hallall për Punësim dhe Edukim

Ky projekt përmban një faqe web **të përgatitur për publikim** në Netlify, e ndërtuar me HTML, CSS dhe JavaScript, që integron Firebase për autentikim me Facebook dhe ruajtje të të dhënave në Cloud Firestore. Qëllimi i projektit është të ofrojë një platformë punësimi dhe edukimi hallall për komunitetin “Antokton”.

Versioni 4 shton:

- një skedar `firebase.json` dhe `netlify.toml` për konfigurimin e hostimit në Firebase ose Netlify;
- një direktori `functions/` me shembuj **Firebase Cloud Functions** për menaxhimin e roleve dhe listimin e përdoruesve. Këto funksione përdorin Firebase Admin SDK dhe mund të vendosen përmes `firebase deploy --only functions`;
- një faqe të re `admin.html` dhe logjikë në `js/script.js` për menaxhimin e roleve të përdoruesve dhe shikimin e përdoruesve ekzistues. Kjo faqe është e disponueshme vetëm për përdoruesit me rolin `admin` ose `moderator`.

## Strukturë e projektit

```
antokton_site_v3/
│  README.md           # Ky dokument
│  firestore.rules     # Shembull rregullash sigurie për Firestore
│
├─ img/                # Pamjet e përdorura në sajt
│   └─ Antokton_logo.png
│   └─ Antokton_map.jpg
│
├─ css/
│   └─ style.css       # Stili global i sajtit
│
├─ js/
│   └─ script.js       # Logjika e përbashkët e autentikimit dhe shfaqjes
│
├─ index.html          # Faqja kryesore (Home)
├─ edukim.html         # Seksioni i edukimit shkencor, moral dhe profesional
├─ tv-radio.html       # Seksioni për Antokton TV & Radio
├─ fitra.html          # Seksioni për bamirësi (Fitra)
└─ pune.html           # Portali interaktiv i punës

  ├─ firebase.json       # Konfigurim shembull për Firebase Hosting (rishkruan të gjitha rruget te index.html)
  ├─ netlify.toml        # Konfigurim për Netlify (rishkruan të gjitha rruget te index.html)
  ├─ functions/index.js  # Cloud Functions: menaxhimi i roleve dhe listimi i përdoruesve
  └─ admin.html          # Panel administrativ për menaxhimin e roleve
```

## Përdorimi

1. **Konfigurimi i Firebase:**
   - Krijoni një projekt në [Firebase Console](https://console.firebase.google.com/) dhe aktivizoni **Authentication** (Sign‑in method) me *Facebook*. Mos harroni të shtoni `App ID` dhe `App Secret` nga [Facebook for Developers](https://developers.facebook.com/).
   - Në seksionin **Firestore Database** zgjidhni “Start in production mode” dhe krijoni koleksionet `users` dhe `jobs` sipas nevojës. Përdorni skedarin `firestore.rules` si model rregullash.
   - Plotësoni kredencialet e projektit tuaj Firebase në seksionin `// TODO: Firebase config` të skedarit `js/script.js`.

2. **Konfigurimi i domenit dhe SSL në Netlify:**
   - Hapni një llogari në [Netlify](https://www.netlify.com) dhe shtoni një sajt të ri duke zgjedhur opsionin **Deploy a site without Git**.
   - Ngarkoni të gjithë përmbajtjen e dosjes `antokton_site_v3` (pasi të plotësoni konfigurimet). Netlify do të gjenerojë automatikisht një URL të tipit `https://antokton.netlify.app` me certifikatë SSL.
   - Për të lidhur një domen të personalizuar (p.sh. `antokton.al`), shkoni te **Site settings → Domain management**, shtoni domenin tuaj dhe ndiqni udhëzimet për të konfiguruar DNS‑in. Netlify ofron certifikatë **Let’s Encrypt** falas.

3. **Moderatorët, administratorët dhe paneli **:
   - Administratorët mund t’u caktojnë role përdoruesve duke përdorur **custom claims** përmes Firebase Admin SDK (shihni `firestore.rules` dhe dokumentacionin zyrtar). Të paktën dy moderatorë duhet të aprovojnë çdo njoftim pune, përveç kur e aprovon një administrator.
  - Faqja `admin.html` lejon listimin e përdoruesve dhe ndryshimin e roleve përmes një **callable Cloud Function**. Kjo faqe është e dukshme vetëm kur përdoruesi ka rolin `admin` ose `moderator`.

4. **Pagesat:**
   - Ky projekt përfshin vetëm logjikën e kufizimit të njoftimeve falas (një njoftim brenda 10 ditëve për punëkërkuesit). Integrimi i pagesave për punëdhënësit ose njoftimet shtesë duhet bërë duke përdorur Stripe ose PayPal sipas udhëzimeve të tyre.

## Konfigurimi i projektit (V4)

Për të përshtatur këtë projekt në ambientin tuaj, ndiqni këto hapa të përmbledhur:

1. **Krijo dhe konfiguro Firebase** – Shikoni seksionin “Përdorimi” më sipër. Plotësoni kredencialet në `js/script.js`. Në këtë version, mund të përdorni `functions/` për të vendosur funksione në cloud.
2. **Deploy në Netlify** – Dosja `netlify.toml` përmban një rishkrim të thjeshtë që e ridrejton çdo kërkesë te `index.html`, i cili është i nevojshëm për faqet një-faqëshe. Pasi ta ngarkoni projektin, mund të lidhni domainin dhe SSL në panelin e Netlify.
3. **Deploy Cloud Functions** – Nëse dëshironi të përdorni funksionet `setUserRole` dhe `listUsers`, instaloni Firebase CLI (`npm install -g firebase-tools`), pastaj logohuni (`firebase login`) dhe vendosni funksionet me `firebase deploy --only functions`.


## Referenca

* Dokumentacioni zyrtar i Firebase për aktivizimin e Facebook Login thekson se duhet të shtoni App ID dhe App Secret në konsolën Firebase dhe të aktivizoni metodën **Facebook sign‑in**【466799898840499†L1420-L1441】. Më pas mund të krijoni një `FacebookAuthProvider` dhe të thërrisni `signInWithPopup` për t’u kyçur【466799898840499†L1541-L1555】.
* Për të kontrolluar qasjen bazuar në role, Firebase rekomandon përdorimin e **custom claims**, të cilat ruhen në tokenet e autentikimit dhe mund të kontrollohen në rregullat e sigurisë【195966167300658†L140-L152】. Rregullat e shembullit në këtë projekt tregojnë se si të lejohet shkrimi vetëm për moderatorët ose administratorët kur njoftimi është në pritje.
* Një sugjerim i thjeshtë për moderimin e përmbajtjes në Firestore është që çdo dokument të ketë një fushë `approved: false` dhe vetëm kur kjo të jetë `true` të shfaqet publikisht【126755944705102†L255-L259】.
