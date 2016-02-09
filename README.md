# Ghostchan

No frills commenting for the Ghost blogging platform. Like a self-hosted Disqus without all the cruft. Not quite ready for production usage, but getting there.

## Features

* No user login or registration.
* No upvotes, downvotes, likes, karma or reputation points.
* No Facebook or Google or Twitter or Github or MySpace or Friendster connect.
* No discussion threading.
* Imageboard-inspired [tripcodes](https://en.wikipedia.org/wiki/Imageboard#Tripcodes) for those rare occasions where your identity matters on the internet.

## Setup

* `git clone https://github.com/dmyates/ghostchan.git && cd ghostchan`
* `npm install`
* `mv config.example.js config.js`
* Setup a separate domain, subdomain or port for your blog's comments (for example, https://comments.example.com for a blog on https://example.com ).
* Edit `config.js` to match your site's details. Don't forget to choose your favourite hashing algorithm and a reasonably long salt for tripcode generation!
* Copy the HTML in `client/index.html` to where you want comments to go (i.e. `post.hbs` in your Ghost blog's theme).
* Add `client/js/comments.js` and `client/css/comments.css` your Ghost blog theme's `assets/css` and `assets/js` folders and link them in where necessary.
* Customise the look and feel of your comments as much you need to.
* Finally, run `npm start` in your ghostchan directory

You're probably going to want to set up a reverse proxy for serving ghostchan comments with a proper webserver like `nginx`, as you've likely already done with Ghost itself.

## Todo

* Currently, ghostchan assumes (1) you only want comments on blog posts and (2) your post URLs include dates (as is the default setting in Ghost). It will break if you try anything else.
* (Optional) rate limiting.
* Error messages for commenter.
* Ghostchan should check if a post exists before saving comments for it.
* Markdown formatting.
* Comment moderation.
