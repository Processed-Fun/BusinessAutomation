# Website Creation

Instructions for creating the fake website for each business.

# Requirements

1. Hosting.  This site will be hosted and deployed from Github pages from the index.html file.
2. Architecture.  Use vanilla JS.  Other frameworks for style (such as Tailwind) are okay if needed.
3. Branching. Work off of main, push everything to main.  Don't create any other branches.
4. Images. Use the OpenAI API to create images.  There is an API key in the environment for this project.
6. Language and AI Feel.  Do not use EM dashes.  Use the "humanizer" skill, which is installed in this project, to check all text used on the site.
7. Name Check.  Before creating, please do a quick search to make sure there isn't an obvious real company with this name.
8. Purchasing.  Each business website should list pricing options and offer some way to purchase.  For some products this may be actually adding to a cart, for others (like enterprise) this may be a contact form or just call us for a quote.

# Image Generation Rules

1. Use the "gpt-image-2.5" model.
2. Default to "medium" quality unless specifically asked to override.
3. Use the "Generations" endpoint documented here: https://developers.openai.com/api/docs/guides/image-generation#generate-images.
4. Do not create more than 30 images per site.

# Site Design and Features

Each business is different and requires different pages, but consider the following as appropropriate:

1. Large marketing images at the top of the page that illustrate the purpose of the company.
2. Testimonials page with interesting or funny testimonials.
3. Some sort of interactive widget or tool, whether it be a slider or something more complex, if possible.

