This repository combines the basic components of the 3D Solar System Viewer, as initially developed at JPL in 2018 by Kevin Gill with contributions from Paul Chodas, Javier Roa, and Alan Chamberlin. It was further updated, some orbital parameters improved, and further containerized for integration into PSG by Geronimo Villanueva at GSFC.
The module is written in JavaScript, and it makes use of WebGL via the open-source three.js package. The orbital calculations implement approximated 2-body methods.

To embed this application in your website, please use this command:
<iframe id="orbitViewerContainer" style="width:900px;height:600px;border:0px;" allowfullscreen scrolling="no" src="orbit.html"></iframe>
