# Website Creation

Instructions for creating the fake website for each business.

# Selecting a Business

1. Choose a business from "business_ideas.md" that does not already have a website.
2. If there are no available business ideas use the instructions in "generate_ideas.md" to generate five more business ideas.

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
12. Marketing Images.  Create 3 marketing images for the business.  One should be portrait, one landscape, and one square. They should all be different, but similar in theme.  Each should be a marketing promotional poster/image for the business with at least one tag line and the business name.  Put the marketing images on a separate page accessible from the footer.  These dont count against the total image limit.

# Site Structure

1. Each site should be created in its own directory.
2. The root of the entire site is index.html.  This is the "business directory".
3. For each new business creating a medium size promo image.  It should be a picture with the name of the business, a short tagline that clearly implies what the business does, and an image illustrating the business.
4. Add an entry to the business directory for the new business.  It should list the name, short description, have the logo, and the promo image.  It should link to the business site.

# Image Generation Rules

1. Use the "gpt-image-2.5-flare" model.
4. Default to "medium" quality unless specifically asked to override.
5. Use the "Generations" endpoint documented here: https://developers.openai.com/api/docs/guides/image-generation#generate-images.
6. Do not create more than 40 images per site during the initial build.  it is fine to go over this limit later if prompted manually.
7. images showing the product or scenes of the product should have a subtle and tasteful watermark with the business name.

# Site Design and Features

Each business is different and requires different pages, but consider the following as needed:

1. Large marketing images at the top of the page that illustrate the purpose of the company.
2. Testimonials page with interesting or funny testimonials.
3. Some sort of interactive widget or tool, whether it be a slider or something more complex, if possible.
4. A customer image gallery, instagram style. Use this as a more image heavy alternative to testimonials.
5. if there are flavors or varieties or different types include a large gallery of all the different varieties that couldn't be shown on the home page.  something like "flavors" or "full menu", depending on the offering.  this might even be appropriate for non food based options it there is enough variety.

