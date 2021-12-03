using System;

namespace lab3
{
    public class MT
    {
        private const int w = 32;
        private const int n = 624;
        private const int m = 397;
        private const int r = 31;
        private const uint a = 0x9908B0DF;
        private const int u = 11;
        private const uint d = 0xFFFFFFFF;
        private const int s = 7;
        private const uint b = 0x9D2C5680;
        private const int t = 15;
        private const uint c = 0xEFC60000;
        private const int l = 18;
        private const int f = 1812433253;
        private const long lowerMask = (1 << r) - 1L;
        private const long upperMask = ~lowerMask;
        private int index = n + 1;
        public uint[] mt { get; set; }

        public void Seed(uint seed)
        {
            mt = new uint[n];
            index = n;
            mt[0] = seed;
            for (int i = 1; i < n ; i++)
            {
                mt[i] = (uint)(f * (mt[i - 1] ^ (mt[i - 1] >> (w - 2))) + i);
            }
        }

        public uint ExtractNumber()
        {
            if(index >=n)
            {
                if (index > n) throw new Exception("Generator was never seeded");
                Twist();
            }

            uint y = mt[index];
            y = y ^ ((y >> u) & d);
            y = y ^ ((y << s) & b);
            y = y ^ ((y << t) & c);
            y = y ^ (y >> l);

            index += 1;
            return y;

        }

        public void Twist()
        {
            for(int i=0; i < n-1; i++)
            {
                uint x = (uint)((mt[i] & upperMask) + (mt[(i + 1) % n] & lowerMask));
                uint xA = x >> 1;
                if (x % 2 != 0) xA = xA ^ a;
                mt[i] = mt[(i + m) % n] ^ xA;
            }
            index = 0;
        }

        public uint Untemper(int n)
        {
            uint res = (uint)n;
            res = UnTemperRightShift(res, l);
            res = UnTemperLeftShift(res, t, c);
            res = UnTemperLeftShift(res, s, b);
            res = UnTemperRightShift(res, u);
            return res;
        }

        private uint UnTemperRightShift(uint input, int n)
        {
            uint res = input;
            for(int i=0; i < 32; i++)
            {
                res = input ^ res >> n;
            }

            return res;
        }

        private uint UnTemperLeftShift(uint input, int n, uint bitmask)
        {
            var res = input;

            for(int i=0; i < 32; i++)
            {
                res = input ^ (res << n & bitmask);
            }

            return res;
        }
    }
}
