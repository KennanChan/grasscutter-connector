# grasscutter-connector
A nodejs connector to send commands to grasscutter java service via http.

Grasscutter-connector wraps the grasscutter java service as a child process.

Once grasscutter-connector receives an http post request with json array like `["command1", "command2"]`, it then passes the commands to grasscutter service via command line.

# usage
```shell
node grasscutter-connector.js
```
possible command line arguments:

--port: the port that grasscutter-connector listening to, 9508 by default

--jar: the grasscutter .jar file path, "./grasscutter.jar" by default