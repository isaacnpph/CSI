const Session = require('./models/Session');


module.exports = async (socket, user_id) => {
    // Socket.io
    socket.on('chat', async function(data){

        let session = await Session.find({_id:data.session});

        let socket_clients = global.socket_clients;

        session_users = session[0].invitedUsers;
        session_users.push(session[0].author);

        for(let i = 0; i < session_users.length; i++) {
            for(let j = 0; j < socket_clients.length; j++) {
                if(session_users[i] == socket_clients[j].user_id) {
                    socket_clients[j].socket.emit('new_chat_message', {
                        session_id:session[0]._id,
                        msg:data.msg,
                        user_name: data.user_name
                    });
                }
            }
        }
        
    });
}