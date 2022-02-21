const rpc = require('vscode-ws-jsonrpc')
const server = require('vscode-ws-jsonrpc/lib/server')
const lsp = require('vscode-languageserver')

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8989 });

function launch (socket) {
  const reader = new rpc.WebSocketMessageReader(socket)
  const writer = new rpc.WebSocketMessageWriter(socket)
  const socketConnection = server.createConnection(reader, writer, () => socket.dispose())
  const serverConnection = server.createServerProcess('JSON', 'pyls')
  server.forward(socketConnection, serverConnection, message => {
    console.log(message)
    if (rpc.isRequestMessage(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params
        initializeParams.processId = process.pid
      }
    }
    return message
  })
}

wss.on('connection', function connection(ws) {
  const socket = {
    send:(content)=>ws.send(content,(error)=>{
      if(error){
        console.log(error)
      }
    }),
    onMessage:(cb)=>ws.on('message',cb),
    onError:(cb)=>ws.on('error',cb),
    onClose:(cb)=>ws.on('close',cb),
    dispose:(cb)=>ws.close()
  }
  launch(socket)
})