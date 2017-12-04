# Basic HTTP Server

Note, this was thrown together quickly as a demo.  It is probably not the best
way to do things on a big project, but it works.

You can run the server by going to the folder with all of these files, and typing:

```
python server.py
```

Nothing will happen.

Then open a modern browser (I only tested in Google Chrome) and enter
"http://127.0.0.1:8000" into the header.  You should see some text show up in
the terminal where you started the server.

Press "Ctrl-C" to stop the server.

See comments in the code for some details.

This should show you how to send data back and forth from the client to the server using python!

Note also, that the python server will "server" files in the same directory as
itself.  In particular, the "index.html" file is loaded and the "favicon.ico"
are loaded using the server.
# LRP-engine-v2
