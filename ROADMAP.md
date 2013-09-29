AppMaker Roadmap

We could push AppMaker in many directions.  Here's my current thinking of the priorities for the project, with some rationales and some suggested milestones, because deadlines make things happen.

The order is negotiable (except probably 1.), and I expect we'll make progress on multiple dimensions in parallel, but with a small team we'll probably need to do some sequential focused work.

1. Articulating compelling vision & setting the stage for contributors

AppMaker's vision is big enough that for us to succeed, we'll need many people and many kinds of people to share in the vision and contribute talent.  We can't have them share the vision if it's not clearly explained; we can't have their talent applied to the project if it's unclear how to contribute.

Deadline: Summit & MozFest

Goal: engaged, happy, productive contributors. Buzz and support from important stakeholders (employers, partners, sponsors, thought leaders).

Both the Summit and MozFest are unbeatable opportunities to share the AppMaker vision and recruit contributors, fans, and sponsors.  We need therefore to both crisp up the pitches, make sure that everyone on the team roughly says the same thing (we can adjust the shared pitch based on feedback), make the demos powerful but still show opportunity-to-contribute.

--> we should very soon synthesize and publish vision, goals, roadmap, architecture of participation.

--> we should polish the demo so that the impact isn't just 'cool, i love it' but 'amazing, how can i help!'  I think getting the demo to result in a compelling on-phone app experience is key to that.

Even with our current demo, pitch, etc., we get people excited, but we don't have a clear ask of them.  That's a wasted opportunity, as the people who are excited today are those who can likely get us to increase our overall productivty the most.

--> we should have a v1 of a contribution pathway for the summit, and a v2 for mozfest.  Some of that is just open-source-best-practices, but I think we may want to have in-product realizations of that, such as the ability to add a component to the production designer and to the published apps.


2. Modules and remixable apps that let real people make apps they want to have on their phones.

AppMaker is currently compelling to the choir: people who are already bought into the power of the web, programming, etc.  We need to make it irresistible to an audience that is not yet bought into that belief system.  This will come through an existence proof -- specific apps that they wish they could make/tweak.  "I wish I had an app like that made for me"

Goal: A set of apps that a decent percentage of target users say they'd want to have and/or tweak.

Deadline: ______

WebRT on android is making good progress -- we should be able to make apps that feel real enough for many users.  I expect that we'll need to do things like reviving James' work for packaging apps, tackle offline (with hoodie hopefully).  We will likely need to make some decisions about API versioning.  We'll need sign-in.  Mostly, we'll need good remixable apps and components that are not-just-demoware, and a really good "front door" where people can find the apps that resonate for them.  Also, making it easy for people to send their apps to their friends.

3. AppMaker as part of an ecosystem: makeAPI integration; appstore integration; multiple sources of modules; recipes & remix as the driver of use.

A big differentiator for AppMaker is that we don't want to build the entire value proposition into the tool.  We want to build on the WebAPI and WebRT; we can use Phonegap to let people build apps for those environments where those aren't available; we can connect advanced users with both the learning pathways of Webmaker.org as well as the developer ecosystem (github, etc.). We can leverage the makeAPI to strengthen the remix


4. Localizability and federation -- AppMaker's biggest potential is likely not with people who already have high quality access to the internet as we see it and who may not be english speakers.

Goal: let our localization community massively expand our reach; get a reality check from multiple potential audiences to understand market fit and gap analysis.

Deadline: _______

Feedback from localized instances and user profiles that we don't interact with often is the most likely to reveal both challenges and opportunities that could radically change our minds.  It's therefore wise to get it as soon as it would be useful.  Thus, as soon as we think we can process the feedback, we should figure out how to make AppMaker localizable and deployable in target environments for which appmaker.mozillalabs.com isn't a good delivery model.  This might be appmaker-on-a-raspberry-pi for classrooms with segregated networks, or even highly skinnable custom deployments (a job-training program for out-of-work steelworkers and a pre-teen workshop will likely need tweaks on game mechanics and module choices).  The blocker for us to do this will be our ability to handle the feedback, and to have good communication channels with the intermediaries between us as the users.  Our partnership strategy will therefore be key here.

5. Leveling up from appmaker -- view source; bridge from appmaker to thimble; bridge from appmaker to github/etc.

* X-ray goggles to let people see inside components
* TogetherJS support for classrooms and workshops
* Edit component in thimble
* Submit my component for inclusion in The Catalog

6. Small-group apps and paired apps

Making an "app for me" is safe (so should be non-threatening for beginners) and may be satisfying.  Making an app for people I care about makes me look good and is a way to spread the meme.  There are two configurations that are particularly promising and differentiated relative to the iOS/Android universe:

* apps for small groups of people.  Not one app that works for N small groups but authored by a single person, but an app that is designed for the specific needs of a small set of people.  An app designed for a team; an app designed for a family; a couple; a group of friends.

* consumer/producer apps -- the web makes it easy for us to make paired apps, where one app is for a content producer, and the other app is for the consumer of the same content.  Specific data-heavy apps are a good example, from the soccer coach to the team, or the expert to the audience, or the small business owner to her clientele.

For both of those, we probably want to lean heavily on Hoodie, assuming it works out as planned.  We will also likely need to think about push notifications and equivalent.

7. Leveraging the strength of the platform for Wow.

The fireworks component is the most compelling because it embodies a lot of visual appeal, animation, liveliness, jank-free responsiveness and fun in a single atomic unit.  Gecko's made huge progress in graphics and animation support thanks to the focus on games.  I don't think that we should turn AppMaker into GameMaker, but I think we should look for opportunities to use the surprisingly powerful graphics capabilities of the platform in both the authoring experience but most particularly in the module selection.  It should be possible to have components that feel as "glidy" and lively as e.g. Letterpress on iOS.  We'll need help from Gecko hackers to optimize our code and make smart tradeoffs, but I'm sure we can get it, once we have a clear ask.