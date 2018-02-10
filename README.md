CMS
===

Conventions
-----------

### file naming

Obviously, this is practically a religious topic. So here is the rule:

>   *No capital letters in file names*.

What?! How dare you make such a limiting and repressive edict?

You should design such that any folder or file could be extracted to its own
reusable package some day. Packages cannot contain uppercase letters.

>   New packages must not have uppercase letters in the
>   name.<https://docs.npmjs.com/files/package.json#name>

There. `camelCase` should never be used. This
leaves `snake_case` and `kebab-case`.

`kebab-case` is by far the most common convention today and it’s prettier
(subjective). Underscores are used for internal node packages as a convention
from the early days.

Content
-------

Content is stored as
[markdown](https://daringfireball.net/projects/markdown/syntax) for security and
consistency. HTML is a powerful markup language that can cause havoc when
blindly merged into another HTML document. Markdown is pure text formatting with
a few enhancements like images and links so it provides a reliable way to
separate the content and text-based formatting from layout and style. It will be
converted to html for convenience so the consumer will generally use the
resulting HTML with confidence it won’t hose the site.

TODO: how to handle style? Can it be embedded easily?

Test inline html!

 

Alignment can be handled using tables:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
|| <!-- empty table header -->
|:--:| <!-- table header/body separator with center formatting -->
| I'm centered! | <!-- cell gets column's alignment -->
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Middleware / Content Fragments / Targeting
------------------------------------------

The CMS middleware is registered to handle a route path in Express. Content is
targeted to either the request path i.e.: `/donuts/chocolate-sprinkles` or at
the route path i.e.: `/donuts/:flavor-slug`, in that order. So you might have a
generic route path where content is targeted to a specific URL
`/donuts/chocolate-sprinkles` vs `/donuts/plain`. This provides a means to
target specific content to granular, dynamic endpoints. If the request URL path
does not match exactly then the *route path* can be used to target more generic
content. `/donuts/:flavor-slug` would match for both
`/donuts/chocolate-sprinkles` and `/donuts/plain`. Finally, it is up to the
consumer to determine if they wish to query for content that is targeted to less
qualified paths `/donuts`. In some use cases, it would be appropriate to serve
generic parent targeted content for all child paths but the system cannot make
this value judgement without context.

Content is delivered as a `ContentPackage` having the following structure:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
  appKey: String,                 // support multiple apps per CMS
  resourceTargetPath: String,     // matches either URI or route path as determined by the consumer.  '/donuts/chocolate' or '/donuts/:flavor'

  fragments[
    {
      containerKey: String,       // fragment position or container.  'top.left' or simply 'body'.  Determined by consumer.
      markdown: String
    }
  ],
  published: {
    type: Boolean,
    default: false
  }
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

Essentially, a collection of fragments organized as a hash with string-based
key. Each hash item key corresponds to potential targeting area of the page. In
the simplest case, you may just have one fragment called `body`. In a more
complex case, you may have `leftpain.top`, `leftpain.bottom`, etc.   

The `resourceTargetPath` corresponds to the path or route the content is
targeted to.

The results will be appended to the request object as
request.managedContent.html and can be accessed by middleware the proceeds the
cms middleware.

You may access this object from your master templates, page template or wherever
you see fit.

Also included is a Json handler can be registered against any route. This
handler will send the contents of the request.managedContent through the
response object as JSON.

Configuration
-------------

We use [DotEnv](https://github.com/motdotla/dotenv).

To configure for local development, create a `.env `file at the project root.

Configure the following values:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
PORT=2001
DB_URI=mongodb://localhost/cms
TEST_PORT=2002
TEST_DB_URI=mongodb://localhost/cms_test
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 
-
