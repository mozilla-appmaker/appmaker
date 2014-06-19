AppMaker is an ambitious project, and we know we won't be able to reach our lofty goals without contributions of many kinds.  This document aims to be a guidepost which will explain our current thinking on how we're trying to facilitate contribution.

AppMaker is an open source project under the MPLv2 license -- it's fine by us if someone uses our code to take it in another direction, try something new, etc.  We encourage people to communicate back to us what they learn, what their motivations are, what they've tried, learned, where they've succeded at, etc.  We value input of all kinds, including user testing results, bug fixes, new components, design comps, visual assets, etc.  The AppMaker team will strive to give each input appropriate review, and equally strive to grow the team, so that more people can help shape the project.

AppMaker is a project with a somewhat crazy ambition of enabling millions of people to create in ways that they don't think they can today.  We'll only get there if we get along, grow our numbers, and keep a fine balance between a friendly ambiance, high standards of quality at every level, and inclusivity.  If that kind of community norms appeal to you, we'd love your help!

We're currently receiving feedback in the following categories:

## User testing

AppMaker's vision is that self-described non-developers will find it a fun tool for making mobile apps they care about.  We clearly need to test how well we're doing towards that vision by talking to potential users of all kinds.  We do three kinds of user testing -- in-person informal sessions (everyone on the AppMaker team is more than happy to show it off and get your feedback); online periodic testing through services like usertesting.com; user testing sessions in workshops with volunteers from specific audiences.

From such testing we expect both broad insights (maybe the current version works better for some demographics than others, in some countries or others, etc.) as well as specific wins and losses (such-and-such a UI concept is fuzzy -- such-and-such sample app is particularly compelling).  We're grateful to all of the people who are willing to try unfinished software and give us honest feedback, and even more grateful to people who help us organize user testing sessions, translate and synthesize feedback, and give us longitudinal trends ("this last version is clunkier than the last one").  If you're interested in helping our user testing efforts, please contact Luke Pacholski (@lpacholski) and Emily Goligoski (@emgollie).

## Bug fixes

We try to keep our GitHub Issues list organized, prioritized and tagged, so that people who just want to dig in and fix bugs can do so with as high a likelihood of seeing their contribution merged as possible.  For many of our coding bugs, front-end web development skills should be all that's needed (strong HTML, JavaScript, CSS skills; node.js skills are useful).  Check out the list of good-first-bugs at https://github.com/mozilla/appmaker/issues?labels=Contributors&page=1&state=open.  If you see some bugs that you think you want to tackle, we suggest setting up a developer instance (documented >here<).  Once you have that setup working, or if you have issues setting it up, feel free to come to the #appmaker IRC channel and let us know what bug you're intending to work on.  We may be able to help you with background that the bug is missing.  If you'd rather show up with a finished pull request, that's OK too.

AppMaker consists of four major components at this point -- the web component plumbing (Ceci); the designer tool; a simple publishing server; and a list of built-in modules.  We hope that the universe of available modules will grow in many directions, from the hyper-specialized to the polished general purpose.

Writing a new module is a great way for developers (seasoned as well as novice) to learn how the whole system works.  See <link> this page for a simple tutorial that explains how to make a new module from scratch.  Alternatively, just look at <link>the source of existing modules, and the <link>Ceci API docs.

## Specific Modules and Module Fixes

We have a set of modules that we're using as the proof-point for AppMaker testing -- we'll keep refining that set, evolving their capabilities in response to both changes in the framework as well as feedback from users as to what modules can be useful in what combinations.  We have a roadmap of the module work that we think we need, both in terms of issues with existing modules <link>, as well as brand new modules that we haven't yet built.

## Bug reports and module capability gaps

If you try to use AppMaker "in anger", and you're finding it isn't working the way you expect it to, or the components aren't doing what you think they should, please let us know (How??).  Also, if you find that there are "just plain bugs", please file them in <link>Github Issues.

## Getting more involved

Please feel free to hang out in #appmaker on irc.mozilla.org to say hi and/or see what we're up to.  We use the appmaker@mozilla.org mailing list to share relevant links and occasionally discuss topics.  We meet informally many times throughout the week, and regularly Mondays at 10am Pacific / 1pm Eastern / 7pm GMT.

---


Action items

* introduce LukeP to Chris Lawrence and Brett Gaylor, to coordinate user testing.
* write "writing a module from scratch" -- dethe has draft?
* decide whether to switch from component language to module language (or other?)
* where do we want to get usability feedback? (as in, i tried  to do this app, blah didn't work because ...)
