# DARZI original media

Created 8 October 2026 with the built-in ImageGen tool. The images are original AI concept/editorial imagery, not photographs of actual DARZI customers, completed commissions, or staff. Use approved client imagery for production claims and testimonials. No competitor media was reused.

## Ready assets

| File served from `public/media` | Purpose | Framing | Approximate size |
| --- | --- | --- | --- |
| `hero-exploded.webp` | Primary desktop hero poster, exploded charcoal two-piece suit | 1672 × 941; suit right, quiet left | 114KB |
| `hero-mobile.webp` | Dedicated mobile hero poster, independently recomposed | 864 × 1536; suit below heading space | 94KB |
| `hero-complete.webp` | Complete-suit fallback and film final-frame design anchor | 1672 × 941 | 87KB |
| `craft-handwork.webp` | Canvas/lapel/basting craft editorial | 1448 × 1086 | 224KB |
| `portrait-charcoal.webp` | Illustrative charcoal three-piece garment story | 840 × 1120 | 49KB |
| `portrait-evening.webp` | Illustrative ivory evening-jacket garment story | 840 × 1120 | 40KB |
| `cloth-edit.webp` | Curated cloth editorial | 1448 × 1086 | 268KB |
| `work-charcoal.webp` | Close neck-down charcoal garment photograph | 1672 × 941; newly composed landscape | 109KB |
| `work-wedding.webp` | Close ivory dinner-jacket garment photograph | 840 × 1120 | 41KB |
| `craft-cutting.webp` | Cloth cutting/shears editorial | 1672 × 941 | 164KB |
| `hero-poster.webp` | Admin/preview compatibility alias | Same file as `hero-exploded.webp` | 114KB |

PNG masters are archived under `design/media-sources/`, outside the served folder. Encoding uses local `cwebp` at quality 84; mobile/portrait variants are downscaled without changing the composition. All generated images were visually reviewed for subject, framing, anatomy and garment structure. Original hero/master generation paths remain under `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/`.

## Current scroll assembly sequence

The user’s current hero direction supersedes the playback concept below: a full-screen opening with a transparent overlay navbar and native-scroll-driven photographic assembly, without player controls. Seven original photographic frames use one finished-suit image as their edit anchor. Each edit keeps the camera, architectural background, lighting, suit placement and final charcoal silhouette fixed. The left side remains quiet for HTML typography. This is an image sequence, not a generated film or a fabricated MP4.

| Served file | Assembly beat | Dimensions | Bytes |
| --- | --- | --- | --- |
| `assembly/frame-00.webp` | Cut wool panels, canvas, sleeve pieces, trouser cloth and buttons separated | 1920 × 1080 | 98,072 |
| `assembly/frame-01.webp` | Trousers take final shape; ivory chest canvas establishes jacket structure | 1920 × 1080 | 95,858 |
| `assembly/frame-02.webp` | Wool body and peaked lapels form; detached sleeves remain | 1920 × 1080 | 88,188 |
| `assembly/frame-03.webp` | Sleeves join; raw cuffs and basting seams remain | 1920 × 1080 | 77,636 |
| `assembly/frame-04.webp` | Exact joined suit silhouette with temporary tailor basting | 1920 × 1080 | 78,728 |
| `assembly/frame-05.webp` | Clean finished seams; horn buttons settle toward final positions | 1920 × 1080 | 73,824 |
| `assembly/frame-06.webp` | Complete charcoal suit and static fallback | 1920 × 1080 | 81,334 |

The complete sequence is 593,640 bytes (approximately 580KiB). All 18 served WebP assets total 1,928,700 bytes (approximately 1.84MiB). Assembly exports use `cwebp -resize 1920 1080 -q 83`; normalizing the native 1672 × 941 output changes the aspect by less than 0.1%. PNG masters live under `design/media-sources/assembly/`, outside the served folder. The finished master is copied from the original finished-suit anchor. All seven exports were visually reviewed and their dimensions verified. Mobile uses the same continuous sequence with responsive framing; separate `hero-mobile.webp` remains available as a portrait poster. Reduced motion uses `assembly/frame-06.webp` and bypasses animated assembly.

### Exact shared edit prompt

Use case: precise-object-edit. Asset type: one photorealistic 16:9 landscape keyframe in a bespoke suit assembly sequence. EDIT the attached anchor, do not invent a new camera or room. CRITICAL INVARIANTS: keep the exact same fixed camera, identical dark atelier wall panel geometry, floor, warm golden beam on the far right, shadows, perspective, colour grade, exposure, entire quiet left 45%, and exact final suit position/scale. Anchor neck at approximately x=66%/y=3%, trouser hems at x=66%/y=94%; do not zoom, pan, enlarge or shift suit. Same fine charcoal wool, same broad peaked lapels, same narrow trouser silhouette. The garment components may change only as specified in this assembly stage; background must remain visually identical. No human, body, mannequin, metal machine parts, sparks, hanger, shoes, shirt, words, logo, labels, watermark or graphics. Realistic soft fabric weight and tactile fibre detail. The sequence ends at exactly the attached complete-suit design. Output around 1920x1080, exact landscape 16:9 framing.
STAGE:

### Exact stage prompts and provenance

#### Frame 00

FRAME 00, from scratch. Remove the complete suit. Instead show only its separate precisely cut charcoal wool flat pattern pieces, two trouser leg cloth panels, two narrow sleeve panels, two jacket front pieces and ivory canvas chest pieces floating gently at various heights within the same right-side suit volume. Parts remain separated and flat, raw-cut edges with delicate chalk and ivory basting lines. Trouser cloth strips hover close to the floor where the final legs will be; chest canvas/folded lining hover around the future chest. No finished garment and no completed torso. Same small charcoal/horn buttons scattered close to the waist location. Full material constellation sits around the anchor center, preserves quiet left.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-78b889e3-44eb-49d8-ac9c-edf965ce5375.png`

#### Frame 01

FRAME 01, foundations. The charcoal trousers are now assembled to EXACTLY the anchor trousers shape, waistband height, leg length, leg position and hems. Above their waist, only a sculpted ivory canvas chest and shoulder foundation, shaped exactly like the inside of the anchor jacket, floating at the anchor jacket height. No outer wool jacket body, no wool sleeves, no lapels and no buttons attached. Cut charcoal front and back panels hover nearby ready to close, mostly to the sides of the canvas within right-side suit volume. The scene feels like careful bespoke tailoring rather than armor.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-4f5f6d95-e97c-4ec9-890b-1dce8fe7a12d.png`

#### Frame 02

FRAME 02, body takes shape. Keep the fully formed trousers EXACTLY like the anchor. Build only the jacket's charcoal wool chest and back shell over the canvas in the precise final jacket position and size; peaked lapels now roll into place with ivory basting traces, fronts are parted just enough to show a narrow strip of ivory canvas and Bordeaux lining. Both arms/sleeves are entirely absent, empty shoulder armholes clearly visible; the two charcoal sleeve pieces hover vertically immediately outside their future positions. No finished front buttons, no finished cuffs, no shirt. Do not make the jacket wider or longer than the anchor; preserve its exact tapered waist.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-94eac9d7-9945-4629-9ab2-c03d82c48dce.png`

#### Frame 03

FRAME 03, sleeves and lining join. Keep the trousers exactly like the anchor. The charcoal jacket chest/back and broad peaked lapels now nearly match the final anchored shape, in the exact final position/scale. Deep Bordeaux lining lies just inside the jacket fronts; a narrow raw interior edge is visible. The two charcoal wool sleeves have moved close to the shoulders but retain a very small 2–3cm visible seam gap at the armholes, with loose restrained ivory basting thread bridging the gap. Raw sleeve cuff edges are unfinished. Front button positions still unoccupied. No extra sleeves, no buttons floating across the left, no shirt. Preserve the slim original suit proportions and camera.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-38174665-4fc4-4afe-9a65-52b13646ee45.png`

#### Frame 04

FRAME 04 of 06. The complete charcoal wool jacket and both trouser legs have now joined into the exact final suit silhouette from the reference. All wool sections joined, sleeves hang in precisely their final positions. Fine ivory temporary tailor basting threads trace the shoulder joins, sleeve heads, lapel edges and front waist seams; subtle unfinished cuff edges. No horn front buttons yet, no cuff buttons. Interior wine lining is almost fully concealed within the closed wool jacket, with only a very narrow glimpse at the jacket opening. No detached cloth pieces. Keep the exact final jacket dimensions and shape, same broad peaked lapels, same trouser silhouette. Same room pixels and light, left entirely quiet.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-aee6d234-dbf5-4199-995a-078e3b3d270c.png`

#### Frame 05

FRAME 05 of 06. The charcoal wool suit is nearly complete, exactly matching the finished jacket and trouser silhouette in the anchor. All temporary basting threads are removed, all cuffs and seams finished, wine lining fully hidden. Two realistic dark horn front buttons float only 2–3 centimetres directly in front of their exact final waist fastening positions, with subtle matching dark thread following; four small dark horn sleeve buttons float only 2 centimetres beside each cuff where they will be sewn. Keep the jacket unbuttoned with the same opening and exact final peaked lapels, sleeves, trousers as reference. No other detached parts, no sparks or mechanical elements. Last instant before buttons settle into the complete suit. Same room pixels and light, left entirely quiet.

Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-f5e823f1-7ce4-4678-8b03-e868bcc00914.png`

#### Frame 06

Uses the original finished-suit anchor above, encoded to match the other six exports. Original returned source: `/Users/omtomar/.codex/generated_images/01a119c5-a59e-7e22-ab35-f3ddd2591bbb/exec-97a0dc53-69c6-40a9-bda2-191aba91e33a.png`.

## Hero-film production status

No `hero-assembly.mp4` has been fabricated. The installed HeyGen plugin is connected and advertises general AI video, but this session exposes no `text_to_video`, `image_to_video`, or `reference_to_video` creation tool. The available `create_video_from_image` animates an image with lip-sync to audio; it does not implement a suit-assembly film. `get_model_video` only retrieves an existing model generation.

Video Agent and cinematic style/session tools are exposed. Its `presenterMode: none` contract requires the user to have explicitly declined both digital-twin setup and a public-avatar showcase. The general-scene workflow in the [HeyGen skill](/Users/omtomar/.codex/plugins/cache/openai-curated-remote/heygen/4.1.0/skills/heygen-workflows/SKILL.md) says to use model-clip creation and not substitute Video Agent for a clear model-clip request. This is the unresolved connector capability/presenter-routing issue, not an image-generation or local encoding issue. Plugin discovery confirmed HeyGen is installed; no additional plugin was installed or account setting changed.

When a suitable general model-creation workflow is available, use these posters as visual anchors and the following film brief. Display an actual returned video ID through HeyGen's native video player. Integrate a returned usable downloadable output only after the workflow supplies one. A native playback widget or signed remote link alone is not a self-hosted MP4 asset.

## Earlier film brief (superseded by scroll assembly)

Create an original 14-second, 16:9 landscape luxury tailoring film. No person, avatar, narrator, visible mannequin, words, logo, shirt, watch or competing props. One charcoal-wool two-piece suit with broad peaked lapels, horn buttons, ivory canvas and small Bordeaux lining detail assembles in a dark atelier. Preserve design and cloth throughout. Directional warm side light, slow push, near-black background `#161817`, quiet left 40% for HTML heading, suit centered near x=66%. Cloth bends and settles with believable weight; no rigid metal-body motion or sparks.

| Time | Beat |
| --- | --- |
| 0–2s | Exploded charcoal wool, ivory canvas, lining, sleeves, trouser panels and buttons already form a legible suit silhouette. |
| 2–4.5s | Trouser panels align; waistband, seams and crease settle. |
| 4.5–7.5s | Chest canvas establishes structure, wool fronts/back close, lapels roll. |
| 7.5–10s | Lining settles inside, sleeves join shoulders; subtle stitch traces. |
| 10–12s | Buttons, cuffs, pockets, collar and shoulders resolve. |
| 12–14s | Complete suit holds in warm light and makes one natural settling movement. |

Mobile requires a separately composed 9:16 cut with smaller lateral separation, the complete suit visible below calm upper copy space, and the same garment/light. Latest user direction: use a full-screen scroll-driven sequence without player controls. Decode matching frames and map native scroll progress to assembly progress. Hero text/CTA and sharp poster paint immediately. Reduced motion/data-saving/failed loading show the complete-suit still without pinning. No typography is burned into the footage.

## Prompt set used

### Finished suit anchor

Use case: product-mockup. Asset type: original cinematic landscape hero poster for a bespoke tailoring house website, 16:9 composition. Create a photorealistic luxury fashion editorial image, a single extraordinary charcoal wool two-piece suit suspended naturally in an expansive dark atelier; no person and no mannequin visible. The whole jacket AND trousers visible, crisp impeccably fitted silhouette, jacket with elegant broad peaked lapels, two matte horn buttons, subtly sculpted shoulders, very fine realistic charcoal wool twill and faint ivory basting thread along one lapel; trousers with precise crease. The suit is a finished design anchor for a later film where its pieces assemble. Set the suit in the RIGHT 60–70% of the frame, leaving LEFT 40% quiet midnight-charcoal negative space for live webpage headings. Floor and wall dark blue-black wool tone #17262B, barely visible architectural depth, no props. Dramatic warm side light catches lapel roll, canvas structure, seams and fabric pile; editorial fashion photography, palpable textile grain, deep shadow, delicate amber highlights, exquisitely restrained. Slow-camera cinematography still, focal length about 65mm, full suit clear and grounded without a glowing outline. Composition must feel eccentric and precise, sophisticated couture not office stock photography. No printed words, logos, watermark, gradient graphic decorations, mannequins, body, face, skin, shirt, tie, shoes, watch, hanger, extra suit, mechanical metal parts or sparks. Output a high quality 2048x1152 landscape image.

### Exploded hero (edit of finished anchor)

Use case: precise-object-edit. Asset type: cinematic luxury tailoring assembly hero poster. EDIT THIS IMAGE. Preserve the exact charcoal wool suit silhouette, its broad peaked lapels, two horn buttons, slim creased trousers, realistic textile, warm amber side lighting, existing dark atelier perspective and full-body scale. Change only the suit into a sophisticated exploded assembly stage: jacket fronts/back, sleeves, inner chest canvas, dark Bordeaux lining, trouser fabric panels and a handful of buttons separate by small precise distances while maintaining the recognisable complete two-piece suit arrangement in the RIGHT 60–70% of the landscape frame. The jacket shell must be visibly disassembled with its front panels suspended either side of the central ivory canvas chest; detached sleeves suspend near shoulders; trouser panels remain aligned under the waist; no metal, no mechanical machine parts. Garment components bend and drape naturally, suspended as a cinematic tailoring metaphor. Make the left 42% of frame entirely quiet near-black #161817 matte darkness; darken background to this near-black palette, retain delicate warm ivory highlights and tiny wine lining detail #552629. Add a faint restrained white basting stitch detail. Eccentric architectural precision and sensual cloth texture. No person, visible mannequin, shirt, tie, shoes, hanger, copy, labels, numbers, logos, or watermark. High-quality photorealistic fashion cinematography, 16:9, around 2048x1152.

### Mobile hero (edit/recomposition of exploded anchor)

Use case: precise-object-edit. Asset type: dedicated MOBILE 9:16 cinematic assembly hero poster, NOT a crop. Recompose this exact scene into a portrait frame, about 1152x2048. Preserve the same charcoal wool exploded two-piece suit, broad peaked lapels, canvas chest, detached sleeves, Bordeaux lining, precision trouser pieces, horn buttons, realistic fabric, dark atelier and warm side lighting. Whole suit stays visible. Place it centered in the lower 64% of the vertical composition, compress lateral separation between sleeve and jacket parts for a compact coherent silhouette. TOP 28–32% must be absolutely calm near-black #161817 wall/negative space reserved for live HTML brand heading, with no objects intruding. Matte near-black atelier background, no props. Dark floor lower edge, cloth detailed and sculptural, small warm ivory highlights. Draw new portrait framing and lighting naturally instead of stretching or mechanically cropping the landscape. No words, logos, watermark, person, mannequin, shirt, tie, shoes, hanger, or graphics.

### Handwork

Use case: photorealistic-natural. Asset type: premium bespoke tailoring website craftsmanship editorial photograph, 4:3 landscape. An intimate macro photograph of an experienced tailor's brown hands hand-stitching the rolled lapel of a charcoal wool jacket, real needle and fine ivory basting thread, open jacket reveals a small Bordeaux lining fold. Only the hands, fine wool, canvas edge and sewing detail fill the image; no face or full person. Garment rests on a warm ivory #F5F2EA pattern-paper covered timber worktable, a small brass thimble slightly out of focus at edge. Tactile authentic editorial craft photography with natural directional window light, handwork in sharp focus, visible textile fibres, warm neutral tonality, deep ink shadows. Shot close from a diagonal above, documentary fashion-house feel, elegant imperfect human touch, no staged stock-photo smiling gesture. Anatomically plausible natural hands: five fingers per hand, one working needle, no duplicated tools. No readable writing, measurements, brands, labels, logos, captions, watermark, AI interface or decoration. Original scene, no claimed real client or real Darzi staff. High quality 1600x1200 composition.

### Charcoal portrait

Use case: photorealistic-natural. Asset type: original luxury tailoring fashion editorial portrait photograph for a website garment story, vertical 3:4 composition. A fictional adult South Asian male fashion model about 32, composed and quietly confident, standing full length in a serene sculptural warm ivory atelier, wearing a striking impeccably cut deep charcoal three-piece bespoke wool suit, single-breasted jacket with peaked lapels and a close fitted waistcoat, fine ivory shirt, subtle charcoal tie. One hand rests naturally in trouser pocket, other relaxed. Rich wool weave, precise sleeve length, clean silhouette, sharp drape. Framed as a sophisticated independent fashion campaign, directional afternoon light with one architectural shadow, warm ivory #F5F2EA plaster and dark walnut doorway, restrained wine tone in a small pocket square, no props. Model has unique invented features, natural skin texture, no celebrity resemblance. Eye-level medium telephoto shot, full body with enough breathing room, silhouette is primary focus; elegant, modern, eccentric precision instead of posed catalogue blandness. No words, brand logos, labels, watermark, text overlay, badges, fashion magazine cover elements or extra people. High quality 1200x1600 portrait.

### Evening portrait

Use case: photorealistic-natural. Asset type: original premium tailoring fashion editorial portrait, 3:4 vertical, for wedding and evening garment story on an independent tailoring website. Fictional adult male fashion model about 35 with dark brown skin and close cropped hair, composed expression, wearing an extraordinary warm ivory silk-wool dinner jacket with broad black satin shawl lapel, single covered button, welt breast pocket with precisely folded ivory pocket square, white formal shirt with black bow tie and exceptionally draped black tuxedo trousers. Three-quarter length portrait from head to mid-calf, strong tailoring and lapel texture foreground, natural balanced pose with hands relaxed, one thumb lightly in pocket. Shot in a dark sculptural atelier with deep Bordeaux #552629 wall, narrow warm side light, dark walnut detail; luxurious cinematic contrast, original modern couture editorial, tactile silk and wool, clear skin texture. No celebrity resemblance, logos, labels, readable text, watermark, decorative graphics, props, extra people or invented brand marks. Palette black ink #161817, warm ivory #F5F2EA and deep wine. Visual quality of a restrained high fashion print campaign, not wedding-stock imagery. High quality 1200x1600 portrait.

### Cloth edit

Use case: product-mockup. Asset type: original premium fabric editorial photograph for a tailoring house website, wide 4:3 landscape. A sculptural arrangement of six expertly folded tailoring cloth lengths on a warm ivory #F5F2EA pattern-paper tabletop: charcoal fine wool twill in foreground, soft ivory silk-wool, understated blue-grey pinstripe, warm dove-grey herringbone, small monochrome micro-check, and one deep Bordeaux satin lining #552629 folding through the composition. Fabrics have rich true-to-life weave, realistic soft weighted folds and tactile fibres. Directional natural window light, long quiet shadow, airy warm paper negative space, close diagonal camera angle, editorial craft-house photograph, understated modern luxury, strong textile contrast rather than colourful retail swatch catalogue. No readable writing, mill marks, hangtags, numbers, labels, logos, watermark, measuring tape, extra tools, people or decorative graphics. Full image is one coherent original photo, no collage or panels. High quality about 1600x1200.

### Close charcoal work (edit of charcoal portrait)

Use case: precise-object-edit. Asset type: luxury tailoring website LANDSCAPE garment-detail photograph, 16:9. Recompose and photograph the exact charcoal three-piece suit in this image as a much closer neck-down portrait. Preserve its charcoal wool, peaked lapels, waistcoat, ivory shirt, subtle charcoal tie, wine pocket square, real model torso and warm ivory architectural background. No head or face in the image: frame from neck to upper thighs, placing the suit torso slightly right of centre and creating a calm sculptural ivory wall area on the left. Keep shoulders, rolled lapels, sleeve and waist clearly visible with extremely tactile wool and sharp tailoring. This is an entirely new landscape camera composition, not a stretched portrait. Sophisticated independent fashion editorial, side-lit warm #F5F2EA plaster, deep #161817 cloth shadows, focal emphasis on jacket/canvas silhouette. No words, logo, label, watermark, extra people, props or graphic decoration. Aim about 1672x941 wide landscape.

### Close wedding work (edit of evening portrait)

Use case: precise-object-edit. Asset type: premium tailoring website close garment portrait, vertical 3:4. Reframe this exact ivory dinner jacket into a stronger close editorial garment photograph, from the model's chin/neck to upper thigh; remove face from composition. Preserve the same dark-skinned fictional model torso, warm ivory silk-wool jacket, broad black shawl lapel, covered button, ivory pocket square, white shirt, bow tie, black tuxedo trousers, Bordeaux wall #552629 and warm side light. Garment texture and lapel roll are the primary subject, polished tailoring, one hand naturally rests near trousers. Maintain realistic proportion and material, no smoothing or surreal geometry. A restrained bespoke-wedding fashion editorial, no readable text, labels, logo, watermark, caption, extra people or props. About 1086x1448 portrait.

### Cutting

Use case: photorealistic-natural. Asset type: original luxury bespoke tailoring website craftsmanship photograph, 16:9 LANDSCAPE. A close editorial view of an experienced tailor's brown hands cutting deep charcoal fine wool with heavy vintage tailoring shears along precise ivory chalk pattern lines on a large warm ivory timber cutting table. One hand controls realistic heavy dark-metal shears correctly, the other hand lies naturally flat steadying the cloth away from the blade. The jacket paper pattern edges and a folded warm ivory pattern-paper sheet lie nearby, but no readable text or numbers. Hands and shear blade in sharp focus, felted fine wool texture, strong diagonal composition, dark atmospheric atelier recedes into background. Side light through a high window, near-black #161817 shadows and warm ivory highlights #F5F2EA, small restrained Bordeaux lining fold at distant edge. Only hands and forearms, no faces. True material physics, one cutting tool, plausible human anatomy and five fingers per hand. Sophisticated cinematic documentary craftsmanship photograph, not posed stock image, no logos, watermark, caption, decorative graphics, measurement labels, extra hands or tools. Original illustrative image, not actual DARZI staff. Wide high-quality about 1672x941.
