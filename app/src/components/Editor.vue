<template>
  <div id="editor" style="width: 500px; height: 500px"></div>
</template>

<script>
import { listen } from "vscode-ws-jsonrpc";

window.setImmediate = window.setTimeout; 

import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  createConnection,
  MonacoServices,
} from "monaco-languageclient";

import loader from "@monaco-editor/loader";

export default {
  name: "Editor",
  async mounted() {
    loader.init().then((monaco) => {
        
      const editorOptions = {
        language: "python",
        minimap: { enabled: false },
      };

      monaco.editor.create(document.getElementById("editor"), editorOptions);

      MonacoServices.install(monaco);
      this.connectToLangServer();

    });

  },
  methods: {
    createLanguageClient: function (connection) {

      return new MonacoLanguageClient({
        name: "Monaco language client",
        clientOptions: {
          documentSelector: ["python"],
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.Restart,
          },
        },

        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(
              createConnection(connection, errorHandler, closeHandler)
            );
          },
        },
      });
    },
    connectToLangServer: function () {
      const webSocket = new WebSocket("ws://127.0.0.1:8989");

      listen({
        webSocket: webSocket,
        onConnection: (connection) => {
          var languageClient = this.createLanguageClient(connection);
          var disposable = languageClient.start();

          connection.onClose(function () {
            return disposable.dispose();
          });
          
          connection.onError(function (error) {
            console.log(error);
          });

        },
      });
    },
  },
};
</script>


