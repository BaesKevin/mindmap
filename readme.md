# Mindmapper PWA

[github](https://github.com/BaesKevin/mindmap)
[heroku app](https://mindmapper.herokuapp.com)

Het kan dat de heroku app even tijd nodig heeft om te laden aangezien de free tier servers slapen als er even geen requests zijn.
Er is een zeldzame niet-reproduceerbare bug waarbij je 2 keer moet inloggen met google en dan een errorpagina te zien krijgt. Gewoon nog eens naar de site surfen en alles is in orde.

## Projectbeschrijving en verloop project

Webapplicatie om mindmaps te maken. Gebruikers kunnen mindmaps maken en opslaan adhv. hun google account. Applicatie werkt bijna volledig offline (nieuwe maps maken niet ondersteund) en is een PWA.

Voor dit project is het meeste werk gegaan in het leren van libraries en de offline/online functionaliteiten (syncen met de server,serviceworker tweaken,... ). Dit is zeker geen afgewerkte applicatie aangezien ik mij het meest heb toegelegd op het technische aspect van het project en minder op features implementeren waar ik niets nieuws uit leer.

####Features

* Google sign-in
* mindmap editor (vis.js)
* mindmap lokaal en op de server opslaan adhv. google id, gebruikers kunnen dus overal aan hun mindmaps maar niet aan andere gebruikers hun mindmaps
* offline support
  * PWA; serviceworker die pagina's cachet en manifest om site toe te voegen aan startpagina
  * lokale cache van mindmaps
  * Mogelijkheid om offline verder te werken aan mindmaps die je eerder maakte in die browser. Enkel een nieuwe mindmap maken werkt niet offline. Mindmaps die nog niet aanwezig zijn in localstorage kunnen offline niet bewerkt worden.
  * Controle of je lokale versie nog overeenkomt met de server wanneer je terug online komt. Gebruiker krijgt de keuze of hij zijn lokale versie of de versie vanop de server wil gebruiken.

#### Uitgebreide beschrijving verloop project
**backend**
De backend is Spring Boot en was vrij eenvoudig om mee van start te gaan. Met het Spring Mvc framework en Spring Data Jpa was het eenvoudig om snel een api te maken om mindmap objecten op te slaan en op te halen. Dit project gebruikt Postgresql als dbms omdat dit het makkelijkst is om werkend te krijgen op Heroku. 

De mindmap wordt opgeslaan met het id van de googlegebruiker. Het Spring Security framework biedt handige functionaliteit aan om oauth 2 te gebruiken, dus daar was het gewoon een kwestie van de juiste configuratie te vinden. 

**frontend**
In de frontend gebruik ik ```foundation-sites``` voor het design en ```vis.js``` om de mindmaps te tekenen en aan te passen.
2 beslissingen in de front-end mbt. tot offline functionaliteit:

* bij het laden van de index worden de netwerken die enkel lokaal bestaan verwijdert. Dit omdat de gebruiker het netwerk op een ander device/andere browser verwijderd kan hebben.
* bij het laden of online komen van de client in de mindmap editor wordt gevraagd of de gebruiker zijn lokale versie of versie op de server wil houden. Dit is zo gemaakt omdat er voor beide keuzes toepassingen zijn: je wil je lokale changes houden als je even online bent geweest en terug online komt, en je wil je lokale versie verwijderen als je op een ander device/browser hebt gewerkt.


**serviceworker**

De serviceworker is gebaseerd op het "offline copy of pages" recept vanop www.pwabuilder.com. 
De serviceworker moest wat getweakt worden om ervoor te zorgen
apicalls en calls die te maken hebben met het oauth proces niet gecachet worden. Enkel GET's en non-apicalls worden gecachet.

**webpack config**

Webpack is geconfigureerd om css en js files te minifyen. De js files worden gebundled. De css files worden geïnlined. Images die in de css via url() worden ingeladen worden omgevormd naar data urls.

**security headers**

Enkel ```upgrade-insecure-requests``` zelf ingesteld. 

## Project runnen

### Prerequisites

**Backend** 
* java 8
* maven 3
* postgresql db. Zie backend/config/application.properties voor credentials en connectionstring.
* optioneel: eigen google app voor oauth2 login, in dit geval moet je ook nog de credentials aanpassen in application.properties

**Frontend**

Enkel nodig indien u van plan bent aan de frontend te werken.

* node en npm

### Build

Indien u Spring Tool Suite gebruikt kunt u het project daar importeren en runnen.
U kunt ook ```mvn spring-boot:run``` uitvoeren in een terminal in de root van de backend map. Het project zou beschikbaar moeten zijn op ```localhost:8080```.

**frontend builden**

Dit project gebruikt webpack om de frontend te builden.
Tijdens development moet je manueel de code voor productie in commentaar zetten en code voor development uit commentaar halen in ```webpack.config.js```.

    npm install
    npm run-script build

