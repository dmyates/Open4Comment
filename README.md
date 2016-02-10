# Open4Comment

No frills commenting for the your minimalist blog. Like a self-hosted Disqus without all the cruft. Not quite ready for production usage, but getting there.

## Features

* No user login or registration.
* No upvotes, downvotes, likes, karma or reputation points.
* No Facebook or Google or Twitter or Github or MySpace or Friendster connect.
* No discussion threading.
* Imageboard-inspired [tripcodes](https://en.wikipedia.org/wiki/Imageboard#Tripcodes) for those rare occasions when your identity matters on the internet.

## Setup

* `git clone https://github.com/dmyates/Open4Comment.git && cd Open4Comment`
* `npm install`
* `mv config.example.js config.js`
* Setup a separate domain, subdomain or port for your blog's comments (for example, https://comments.example.com for a blog on https://example.com ).
* Edit `config.js` to match your site's details. Don't forget to choose your favourite hashing algorithm and a reasonably long salt for tripcode generation!
* Copy the HTML in `client/index.html` to where you want comments to go (e.g. if you're using [Ghost](https://ghost.org), `post.hbs` in your blog's theme).
* Add `client/js/comments.js` and `client/css/comments.css` to your JS and CSS respectively (e.g. if you're using ghost, they go in your blog theme's `assets/css` and `assets/js` folders) and link them in where necessary.
* Customise the look and feel of your comments as much you need to.
* Finally, run `npm start` in your Open4Comment directory

You're probably going to want to set up a reverse proxy for serving Open4Comment comments with a proper webserver like `nginx`.

## Todo

* Currently, Open4Comment assumes (1) you only want comments on blog posts and (2) your post URLs include dates (as is the default setting in Ghost). It will break if you try anything else.
* Error messages for commenter.
* Open4Comment should check if a page is open for comment before saving comments for it.
* Comment moderation.
* Markdown formatting.
