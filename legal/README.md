# legal/

The footer "Terms" link points at a file in this folder, and switches with the
site language. Two files need to live here, with **exactly** these names:

| File | Shown when the site is in |
| --- | --- |
| `NLdigital-Terms-EN.pdf` | English |
| `NLdigital-Voorwaarden-NL.pdf` | Dutch |

## How to add them

I can't download binary files, so these two need saving by hand. Both are the
same documents already linked from the old Webflow site:

**English**
https://cdn.prod.website-files.com/643138b157e24b0daaae2bf6/68dbcd0d22c6909357c9a750_NLdigital-Terms-EN.pdf
→ save as `NLdigital-Terms-EN.pdf`

**Dutch**
https://cdn.prod.website-files.com/643138b157e24b0daaae2bf6/68dbcd09bcbf6dda10c92e11_NLdigital-Voorwaarden-NL.pdf
→ save as `NLdigital-Voorwaarden-NL.pdf`

Open each link, download the PDF, rename it to match the table, and drop it in
this folder. Until then the Terms link will 404.

## Why host them here rather than link to Webflow

The old links live on Webflow's CDN. They work today, but they stop working the
day that subscription ends. Keeping the files on your own domain means the Terms
link survives the move.

## A note on versions

NLdigital publishes these terms and updates them periodically. The filenames
deliberately carry no version number, so replacing the PDFs is enough to publish
a new edition, with no code change. If you'd rather show the version publicly,
say so and I'll add a dated label next to the link.

Note that the Dutch edition is normally the legally binding one, with the
English text as a translation. Worth confirming that matches what your contracts
say.
