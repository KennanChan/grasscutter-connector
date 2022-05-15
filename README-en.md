# Grasscutter-connector
A nodejs server that enables sending commands to [Grasscutter](https://github.com/Grasscutters/Grasscutter) Java service via http.

Grasscutter-connector wraps the Grasscutter Java service as a nodejs child process.

Once grasscutter-connector receives an http POST request or a WebSocket message with json array like `["command1", "command2"]`, it then passes the commands to Grasscutter Java service via command line.

# Usage
## Run the server
``` shell
node grasscutter-connector.js
```
Possible command line arguments:
```
--port: the port that grasscutter-connector listening to, 9508 by default

--jar: the grasscutter .jar file path, "./grasscutter.jar" by default

--web: serve the web page for command input and execution. candidates: "0", "1". "1" by default
```
## API Specification
```
[POST] http://{server_host}:{server_port}/commands
headers: {
  Content-Type: application/json
}
body: ["command1", "command2"]
```

```
[WebSocket] ws://{server_host}:{server_port}/terminal
message(JSON string): ["command1", "command2"]
```
## Web page
Grasscutter-connector is shipped with a web page for command execution

Once grasscutter-connector started, visit the web page by the server address(default: http://localhost:9508)

![web-page](./web-page.png) 