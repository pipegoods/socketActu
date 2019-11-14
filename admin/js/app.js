var socket = io.connect('http://localhost:8080', { 'forceNew': true });

var app = new Vue({
    el: '#app',
    data: {
      messages: [],
      id: '',
      mensajeactual: '',
      username: '',
      pcON: [],
      pcChat: {},
      auxChatBAN: false
    },
    created() {
        // Listening to chat-message event emitted from the server and pushing to messages array
        socket.on('messages', (data) => {
          console.log(data);
          
            this.messages = data;
            this.chat({id: this.pcChat.cliente});
        });
        socket.on('updateList', (data) => {
          this.pcON = data;
        });

        
    },
    mounted() {
      socket.on('updateList', (data) => {
        this.pcON = data;
      });
    },
    methods: {
        enviarMensaje: function (cliente) {
          
          socket.emit('new-message', {
              cliente: cliente.cliente,
              mensaje: this.mensajeactual
          });
          this.mensajeactual = '';
          this.chat({id: cliente.cliente});
        },
        chat: function (pc) {
          this.auxChatBAN = false;
          this.messages.forEach(element => {     
            if (element.cliente == pc.id) {
              this.pcChat = element;
              this.auxChatBAN = true;
            }
          });
          
          if (!this.auxChatBAN) {
            this.pcChat = {cliente: pc.id, mensajes: []};
            this.auxChatBAN = true;
          }

        }
      }
  });