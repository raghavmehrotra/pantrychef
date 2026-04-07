@AGENTS.md

This is a project that helps a user track their pantry ingredients, match them to recipes
and track macros from the meals they have consumed. It is meant to ensure that the user 
stays on track to achieve their nutritional goals, and push them to avoid wasting 
ingredients from their pantry.

There are 5 distinct pages/routes in the app:
- / --> home dashboard with a pantry snapshot, top recipe matches, and today's nutrition summary.
- /pantry --> this is meant to display the current state of the user's pantry. This is editable in that the user can add and remove ingredients from the pantry too.
- /recipes --> a list of recipes that the user can try. They are ranked in the order of how many ingredients the user already
has to make the recipe
- /recipes/:item --> this shows a list of recipes that contain :item. The route is dynamic.
- /tracker --> allows the user to log their meals and track their macros.

The style is meant to be minimal, yet inviting. Make sure the layout isn't boring. The focus should
be the actual content of the app.

In its current iteration, the app does not store state. This means that details are
lost upon app refresh.

Tech stack:
Next.js
Tailwind CSS