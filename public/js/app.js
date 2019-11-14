var socket = io.connect('http://localhost:8080', { 'forceNew': true });

var app = new Vue({
    el: '#app',
    data: {
      message: [],
      id: '',
      mensajeactual: '',
      username: '',
      noLogin: true
    },
    created() {
        socket.on('get-id', (data) => {
            console.log(data);
            this.id = data;
        });
        // Listening to chat-message event emitted from the server and pushing to messages array
        socket.on('messages', (data) => {
            console.log(data);
            
            data.forEach(element => {
                console.log(element);
                if (element.cliente == this.id) {
                    this.message = element.mensajes;                    
                }
            });
        });
        
    },
    methods: {
        enviarMensaje: function (event) {
          
          socket.emit('new-message', {
              cliente: this.id,
              mensaje: this.mensajeactual
          });
          this.mensajeactual='';
        },
        guardarNick: function (event) {
            this.noLogin = false;
            socket.emit('adduser', this.username);
        }
      }
  });