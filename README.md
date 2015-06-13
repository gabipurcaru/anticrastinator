### Anticrastinate [an-tee-kras-tuh-neyt], verb

So you're working on something really important, but you can't take your eyes off Reddit. You start doing your work, but instead of searching for something, your fingers type in "reddit.com" in the URL bar, and now you're looking at cat pictures again!

What if there was a way to block some websites while working on really important stuff? Something like this: http://i.imgur.com/x1IBWUJ.gifv


### Installing

#### Ubuntu 14.10 or later

Download [this .deb file](https://cdn.rawgit.com/gabipurcaru/anticrastinator/master/ubuntu/anticrastinator_0.0-1.deb) and run `$ sudo dpkg -i anticrastinator_0.0-1.deb`.

#### Others

Run the following commands:

```bash
$ [sudo] npm install -g anticrastinator
$ sudo anticrastinator start
```

Now you can edit your `/etc/hosts` file like shown above.

### Usage
Edit your `/etc/hosts` file and add one or more lines that look like this:

```
# anticrastinate: [start_time]-[end_time] -- [website1] [website2]
```

You can also put `weekdays` or `weekends` after the time if needed.

For example, to block facebook.com between 9AM and 5PM during weekdays, you can use this:

```
# anticrastinate: 9:00-17:00 -- facebook.com
```

### Author
gabi@purcaru.com
