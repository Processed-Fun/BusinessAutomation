# Website Creation

Instructions for creating the fake website for each business.

# Selecting a Business

1. Choose a business from "business_ideas.md". That file only contains ideas that do not yet have websites, so any idea in it is available. ("ideas_index.md" is the master index of all ideas, built and unbuilt, with a status column.)
2. If "business_ideas.md" is empty, use the instructions in "generate_ideas.md" to generate five more business ideas.

# Archetype and Style

1. Archetype.  The idea comes with an archetype (the kind of site: see "archetypes.md"), assigned at idea generation time.  Build the site as that archetype: it dictates the page structure, not just the skin.  A landing-page and an ecommerce-catalog and a gov-institutional portal should feel structurally different, not like the same page in different colors.  If the archetype turns out not to work in practice, you may override it with a different value from "archetypes.md"; update the idea's row in "ideas_index.md" and note the reason in the site's "business.md".  If the idea has no archetype (older ideas), choose one now, avoiding "landing-page".
2. Style.  Choose the visual style at build time from the style list in "archetypes.md".  Read "ideas_index.md" first: the style must be different from the styles of the last 3 built sites, and avoid any style that dominates the index overall.
3. Fit.  Default to the archetype and style this business's fictional webmaster would honestly pick; the humor comes from executing a real genre earnestly around an absurd premise.  A deliberate mismatch is allowed only if you can write one in-world sentence explaining why the site looks that way.  The style must serve the site's one joke, never add a second unrelated one.
4. Record both values (exactly as spelled in "archetypes.md") in the site's "business.md" and in the idea's row in "ideas_index.md".

# Requirements

1. Hosting.  This site will be hosted and deployed from Github pages from the index.html file.
2. Architecture.  Use vanilla JS.  Other frameworks for style (such as Tailwind) are okay if needed.
3. Branching. Work off of main and get everything onto main.  If the platform assigns the session its own working branch, develop and push there, then merge that branch into main and push main.  After pushing main, verify the merge landed (git log origin/main should show your commit).  This is standing permission from the repo owner to merge and push to main; no additional confirmation is needed.  Don't create any other branches beyond the assigned one.
4. Images. Use the OpenAI API to create images.  There is an API key in the environment for this project.
6. Language and AI Feel.  Do not use EM dashes.  Use the "humanizer" skill, which is installed in this project, to check all text used on the site.
7. Name Check.  Before creating, please do a quick search to make sure there isn't an obvious real company with this name.
8. Purchasing.  Each business website should list pricing options and offer some way to purchase.  For some products this may be actually adding to a cart, for others (like enterprise) this may be a contact form or just call us for a quote.
9. Logo. Generate a logo using the OpenAI image API.  This should be relatively small and be used to linking to it from the main site.
10. mobile friendly.  each site should be mobile friendly.  do a check after generation to confirm this.
11. image display. where possible, clicking or tapping an image should open it in a modal.  this does not need to apply to background images or things like logos or header images.
12. Messaging.  No matter what archtype or style is selected, the purpose of the business should be clear and unambiguous when users first land on the site, above the fold on the main page.  Taglines or slogans are okay, but make sure there is a clear explanation accompanying it.

# Marketing Images

1. Create 3 marketing images for the business.  One should be portrait, one landscape, and one square. They should all be different, but similar in theme.  Each should be a marketing promotional poster/image for the business with at least one tag line and the business name.
2. Put the marketing images on a separate page accessible from the footer.  These dont count against the total image limit.
3. Marketing images must show the site's actual products, using the real product images as reference input per Image Generation Rule 5a, not a newly invented product.

# Site Structure

1. Each site should be created in its own directory.
2. The root of the entire site is index.html.  This is the "business directory".
3. For each new business creating a medium size promo image.  It should be a picture with the name of the business, a short tagline that clearly implies what the business does, and an image illustrating the business.  If the promo depicts products, build it from the site's real product images via the Edits endpoint.
4. Add an entry to the business directory for the new business.  It should list the name, short description, have the logo, and the promo image.  It should link to the business site.

# Bookkeeping

When the website is complete, update the idea tracking files:

1. Copy the idea's full entry from "business_ideas.md" into a new file named "business.md" at the root of the site's directory (e.g. "my-site/business.md").  Also record the site's archetype and style in that file, using the exact values from "archetypes.md".
2. Remove the idea's entry from "business_ideas.md".  Do not touch the other entries.
3. Update the idea's row in "ideas_index.md": set status to "built" and fill in the directory, archetype, and style columns.  Never delete rows from the index.

# Image Generation Rules

1. Use the "gpt-image-2.5-flare" model.
4. Default to "medium" quality unless specifically asked to override.
5. Use the "Generations" endpoint documented here: https://developers.openai.com/api/docs/guides/image-generation#generate-images for original images (logos, product shots, scenes, heroes).
5a. Any image that depicts a product already shown elsewhere on the site (marketing images, the directory promo image, lifestyle shots featuring a specific product) must be generated with the "Edits" endpoint documented here: https://developers.openai.com/api/docs/guides/image-generation#edit-images, passing the actual product image(s) as the input image so the product looks the same everywhere. Generate product images first, derivative images after.
6. Do not create more than 40 images per site during the initial build.  it is fine to go over this limit later if prompted manually.  Marketing images do not count towards this total.
7. images showing the product or scenes of the product should have a subtle and tasteful watermark with the business name.

# Site Design and Features

Each business is different and requires different pages, but consider the following as needed:

1. Large marketing images at the top of the page that illustrate the purpose of the company.
2. Testimonials page with interesting or funny testimonials.
3. Some sort of interactive widget or tool, whether it be a slider or something more complex, if possible.
4. A customer image gallery, instagram style. Use this as a more image heavy alternative to testimonials.
5. if there are flavors or varieties or different types include a large gallery of all the different varieties that couldn't be shown on the home page.  something like "flavors" or "full menu", depending on the offering.  this might even be appropriate for non food based options it there is enough variety.

