
$(document).ready(function(){

  var buttonPlay = $('#play');
  var buttonLevel = $('#go-level');
  var intervalCreaBolle;
  var checkLose;
  var movimentoBolle;
  var countdownInterval;

  // definisco una variabile di appoggio che mi servirà per quantificare le vittorie del player
   var numberVictory = 0;

  // al click sul button play parte il gioco
  buttonPlay.click(function () {

    // viene rimosso il button play
    buttonPlay.remove();

    // viene rimosso il blocco regole
    $('.regole').remove();

    for (var i = 0; i < 15; i++) {
      // eseguo la funzione aggiungiBolla per 15  volte, quindi vengono create 15 bolle e aggiunte al body
      aggiungiBolla();
    }

    countdown(40); // richiamo funzione che stampa in pagina il countdown

    bolleClick(); // richiamo funzione che gestisci il click sulle bolle

    timing(2000, 40000); // richiamo funzione che gestisce il tempo di creazione di una nuova bolla e il tempo massimo che ha a disposizione il player per scoppiare tutte le bolle

    movimentoDirezione(); // richiamo funzione che gestisce il movimento e la direzione delle bolle

  });


  // al click sul bottone del livello successivo riparte il gioco con una difficoltà maggiore
  buttonLevel.click(function () {

    // se il conteggio è 0 allora si carica il gioco al livello 1
    if (numberVictory == 0) {

      for (var i = 0; i < 15; i++) {
        // eseguo la funzione aggiungiBolla per 20 volte, quindi vengono create 10 bolle e aggiunte al body
        aggiungiBolla();
      }

      countdown(40); // richiamo funzione che stampa in pagina il countdown

      bolleClick();

      timing(2000, 40000);

      movimentoDirezione();

    }

    // il messaggio di vittoria e l'immagine spariscono con un'animazione
    $('.coriandoli').animate({
      top: '-500px',
      opacity: 0
    },700, function () {
      // alla fine dell'animazione parte il livello successivo facendo un check per capire a quale livello è arrivato il player
      $('.container').slideUp(function () {

        // per il secondo livello diminuisco il tempo in cui vengono create le bolle e anche il tempo massimo per scoppiarle tutte
        if (numberVictory == 1) {

          for (var i = 0; i < 20; i++) {
            // eseguo la funzione aggiungiBolla per 20 volte, quindi vengono create 10 bolle e aggiunte al body
            aggiungiBolla();
          }

          countdown(35); // richiamo funzione che stampa in pagina il countdown

          bolleClick();

          timing(1500, 35000);

          movimentoDirezione();

        }

        // per il terzo livello diminuisco il tempo in cui vengono create le bolle e anche il tempo massimo per scoppiarle tutte
        if (numberVictory == 2) {

          for (var i = 0; i < 25; i++) {
            // eseguo la funzione aggiungiBolla per 25 volte, quindi vengono create 10 bolle e aggiunte al body
            aggiungiBolla();
          }

          countdown(30); // richiamo funzione che stampa in pagina il countdown

          bolleClick();

          timing(1000, 30000);

          movimentoDirezione();

        }

      });

    });

  });




    // funzione che gestisce il movimento e la direzione delle bolle
    function movimentoDirezione () {

      // ogni 10 millesimi di secondo le bolle si spostano verso destra o verso sinistra fino ad arrivare alle rispettive estremità, poi cambiano direzione andando nella direzione opposta
      movimentoBolle = setInterval(function () {

        // per ogni bolla esegui tutte le operazioni
        $('.bolla').each(function () {

          var positionTop = $(this).position().top; // posizione di ogni singola bolla rispetto all'estremità superiore

          var positionLeft = $(this).position().left; // posizione di ogni singola bolla rispetto all'estremità di sinistra

          var direzioneX = $(this).data('directionX'); // direzione sull'asse x della bolla

          var direzioneY = $(this).data('directionY'); // direzione sull'asse y della bolla

          var widthBody = $('body').width(); // larghezza del body

          var heightBody = $('body').height(); // altezza del body

          var dimensioneBolla = $(this).width(); // dimensione bolla

          // se la direzione è uguale a right allora left incrementa di 1px
          if (direzioneX == "RIGHT") {

            positionLeft += 1;
            // se la bolla non è ancora arrivata all'estremità destra del monitor allora applico alla bolla l'incremento della posizione
            if (positionLeft < (widthBody - dimensioneBolla)) {

              $(this).css({"left": positionLeft});

              // altrimenti se la bolla è arrivata all'estremità destra cambio la sua direzione in left
            } else {

              $(this).data('directionX', 'LEFT');
            }

            // se la bolla ha la direzione left decrementa la sua posizione di 1px
          } else {

            positionLeft = positionLeft - 1;

              // se la bolla arriva all'estremità sinistra cambio la sua direzione in right
              if (positionLeft == 0) {

                $(this).data('directionX', 'RIGHT');

                // altrimenti applico il decremento della posizione
              } else {

                $(this).css({"left": positionLeft });
              }
          }

          // se la direzione della bolla è verso il basso aumenta di 1 la posizione della bolla verso l'alto
          if (direzioneY == "BOTTOM") {

            positionTop += 1;

            // se la bolla non è ancora arrivata all'estremità inferiore allora applica l'incremento
            if (positionTop < (heightBody - dimensioneBolla)) {

              $(this).css({"top": positionTop});

              // altrimenti cambio la direzione della bolla in top
            } else {

              $(this).data('directionY', "TOP");

            }

            // se la bolla ha direzione top decrementa la sua posizione verso l'alto
          } else {

            positionTop = positionTop - 1;

            // se la bolla ha raggiunto l'estremità superiore cambio la sua direzione in bottom
            if (positionTop == 0) {

              $(this).data('directionY', 'BOTTOM');

              // altrimenti applico il decremento alla bolla
            } else {

              $(this).css({"top": positionTop});

            }

          }

        });

      }, 10);

    }


    // funzione che gestisce il click sulle bolle e di conseguenza quando il player ha superato il livello
    function bolleClick () {
      $('body').on('click', '.bolla', function () {

        // al click sulla bolla essa scompare
          $(this).remove();
            // quando la bolla viene eliminata dal documento faccio un controllo per vedere se sono presenti ancora bolle nel documento. Se così fosse il player ha superato il livello
            if ($('.bolla').length == 0) {

              clearInterval(countdownInterval); // stoppo il countdown
              clearInterval(intervalCreaBolle); // stoppo la creazione di bolle
              clearTimeout(checkLose); // stoppo il check per vedere se il player ha perso
              clearInterval(movimentoBolle); // stoppo il movimento delle bolle
              $('body').off('click'); // stoppo l'evento click al body e quindi di conseguenza alle bolle

              // se il player ha superato il primo livello
              if (numberVictory == 0) {

                buttonLevel.text("Vai al secondo livello");
                $('.container h3').text('Hai superato il primo livello')

              }

              // se il player ha superato il secondo livello
              if (numberVictory == 1) {

                buttonLevel.text("Vai all'ultimo livello");
                $('.container h3').text('Hai superato il secondo livello')

              }

              // se il player ha superato l'ultimo livello
              if (numberVictory == 2) {
                $('.coriandoli').remove(); // rimuovo i coriandoli
                buttonLevel.remove(); // rimuovo il bottone
                $('.container').fadeIn();
                $('.container h2').text("Sei il campione di BoolBubble!");
                $('.container h3').text('Anzi, sei un DRAGO!');
                $('.container h2').css({"color": "#ffad33"})
                $('.container h3').css({
                  "color": "darkred",
                  "font-size": "50px"
              });
                $('.container h3').hide().delay(1500).fadeIn(1500);

                // timign function per modificare il background del body dopo un certo tempo
                setTimeout(function () {
                  $('body').css({
                    "background-image": "url(img/drago.jpg)",
                    "background-size": "cover",
                    "background-repeat": "no-repeat",
                    "background-position": "center"
                  });
                }, 3200);


              } else {

                $('.coriandoli').animate({
                  top: '-100px',
                  opacity: 1
                }, 1500, function () {
                  $('.container').fadeIn();

                  numberVictory ++; // incremento la variabile ogni volta che il player vince

                });
              }

            }

      });

    }




  // funzione che crea le bolle e le aggiunge
  function aggiungiBolla () {

    // richiamo il valore della funzione createBolla in modo da farmi ritornare l'oggetto che comporrà la bolla
    var bolla = createBolla();

    // creoun oggetto jquery che rappresenta la bolla
    var $bolla = $('<div class="bolla"></div>');

    // do lo stile alla bolla richiamando i valori dell'oggetto bolla
     $bolla.css({
       "position": "absolute",
       "left": bolla.posizioneLeft + "px",
       "top": bolla.posizioneTop + "px",
       "width": bolla.dimensione + "px",
       "height": bolla.dimensione + "px",
       "background-color": bolla.color,
       "border-radius": "100%"
     });

     // stampo le bolle in pagina
     $('body').append($bolla);

     // do la direzioneX alle bolle in maniera casuale
     if(Math.random() > 0.5) {
       $bolla.data('directionX', 'RIGHT');
     } else if (Math.random() < 0.5) {
       $bolla.data('directionX', 'LEFT');
     }

     // do la direzioneY alle bolle in maniera casuale
     if(Math.floor(Math.random() * 10) > 5) {
       $bolla.data('directionY', 'TOP');
     } else if (Math.floor(Math.random() * 10) < 5) {
       $bolla.data('directionY', 'BOTTOM');
     }
  }


  // funzione che ritorna l'oggetto bolla con le varie proprietà
  function createBolla () {

    // creo l'oggetto nuovaBolla che verrà ritornato nel ciclo for per comporre la bolla
    var nuovaBolla = {

      color: 'rgb(' + generateColor() + ", " + generateColor() + ", " + generateColor() + ")", // colore random
      dimensione: Math.floor(Math.random() * (100 - 50 + 1) + 50) // dimensione random tra 50 e 100
    }

    // la posizione sull'asse x delle bolle sarà un numero random compreso tra 0 e la larghezza del body - la dimensione della bolla
    nuovaBolla.posizioneLeft = generaPosizione(true, nuovaBolla.dimensione);
    // la posizione sull'asse y delle bolle sarà un numero random compreso tra 0 e la larghezza del body - la dimensione della bolla
    nuovaBolla.posizioneTop = generaPosizione(false, nuovaBolla.dimensione);



    return nuovaBolla; // ritorno l'oggetto nuovaBolla che diventerà l'oggetto bolla

  }


  function timing (timeBolla, timeLose) {
    // ogni 2 secondi viene eseguita la funzione aggiungiBolla, e quindi viene creata e aggiunta una bolla
     intervalCreaBolle = setInterval(aggiungiBolla, timeBolla);

    //  fla funzione fa un controllo se sono presenti ancora bolle sulla pagina dopo un certo periodo di tempo che cambia in base ai livelli. Se è presente anche solo una bolla il player ha perso.
     checkLose = setTimeout(function () {

      // se è presente anche solo una bolla il player ha perso
      if ($('.bolla').length > 0) {

        // quando l'utente perde il conteggio delle vittorie torna a zero
        numberVictory = 0;

        clearInterval(intervalCreaBolle); // stoppo la creazione delle bolle
        clearInterval(movimentoBolle); // stoppo il movimento delle bolle
        $('body').off('click'); // stoppo l'evento click al body e quindi di conseguenza alle bolle
        $('body').append('<div class="overlay"><div class="loser"><h2>GAME OVER</h2><button id="riprova">Riprova</button></div></div>'); // aggiungo al body l'overlay e il bottone "riprova"

        // modifico stile bottone "riprova"
      $('#riprova').css({
        "opacity": 0,
        "transition": 'opacity 2s',
        "font-size": '20px'
      });

      // animazione al blocco loser
      $('.overlay .loser').animate({
        left: '50%',
        top: '50%',
        fontSize: '50px',
        rotate: '-360deg'

      }, 2000, function () {
        // quando l'animazione è terminata modifico lo stele del bottone "riprova"
          $('#riprova').css({
            "width": "100px",
            "height": "100px",
            "border-radius": "100%",
            "cursor": "pointer",
            "background-color": "transparent",
            "color": "lightblue",
            "opacity": 1
          });
        });

        // aggancio l'evento click al bottone riprova
        $('body').on('click', '#riprova', function () {

          // rimuovo overlay con tutti i suoi figli
          $('.overlay').remove();
          $('.bolla').remove();

            for (var i = 0; i < 15; i++) {
              // eseguo la funzione aggiungiBolla per 15  volte, quindi vengono create 15 bolle e aggiunte al body
              aggiungiBolla();
            }

            countdown(40); // richiamo funzione che stampa in pagina il countdown

            bolleClick(); // richiamo funzione che gestisci il click sulle bolle

            timing(2000, 40000); // richiamo funzione che gestisce il tempo di creazione di una nuova bolla e il tempo massimo che ha a disposizione il player per scoppiare tutte le bolle

            movimentoDirezione(); // richiamo funzione che gestisce il movimento e la direzione delle bolle

        });

      }
    }, timeLose);



  }


  // funzione di generazione numero casuale compreso tra 0 e l'altezza o la larghezza dal body. Questo numero determinerà la posizione delle bolle
  function generaPosizione (isLeft, dimensioneBolla) {

    var widthBody = $('body').width();
    var heightBody = $('body').height();

    // se il parametro è vero allora il numero generato andrà a comporre la posizione sull'asse x
    if (isLeft) {

      return Math.floor(Math.random() * (widthBody - dimensioneBolla));

      // altrimenti tappresenterà la posizione sull'asse y
    } else {

      return Math.floor(Math.random() * (heightBody - dimensioneBolla));
    }

  }


  // funzione che genera in maniera casuale dei colori da 0 a 256 per le bolle
  function generateColor () {
    return Math.floor(Math.random() * 256);
  }



  // funzione che stampa in pagina il numero dei secondi che rimangono per superare il livello
  function countdown (seconds) {

    var numberCountdown = seconds;
     countdownInterval = setInterval(function () {

      if (numberCountdown == 0) {

        clearInterval(countdownInterval);

        $('.count-down').animate({
          fontSize: "40px",
        }, 1000);

      } else {

        numberCountdown --;
        $('.container-count-down').html('<h2 class="count-down">' + numberCountdown + '</h2>');
        $('.count-down').css({"color": "rgba(" + generateColor() + ", " + generateColor() + ", " +  generateColor() + ")"});
      }

    }, 1000);
  }


});
